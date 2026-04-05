import json
import logging

import anthropic
from django.conf import settings
from django.core.cache import cache

from .models import ChatSession, ChatMessage, LessonAIComment

logger = logging.getLogger(__name__)

CHAT_SYSTEM_PROMPT = """あなたはオンライン学習プラットフォームのAIコーチ「アイ」です。
日本語で丁寧に、しかし親しみやすく回答してください。

以下のルール:
- 現在のレッスン内容に関連する質問に的確に答える
- わかりやすい例えや具体例を使う
- 学習者のモチベーションを高める
- 回答は簡潔にまとめる（長すぎない）
- コースの文脈を踏まえて回答する"""

COMMENT_SYSTEM_PROMPT = """あなたはオンライン学習プラットフォームのAIアシスタントです。
レッスン内容を分析し、学習者向けのタイムスタンプ付きコメントを生成してください。

出力はJSON配列のみ。説明文は不要です。
フォーマット: [{"time_label": "MM:SS", "text": "コメント"}]

ルール:
- 3〜5個のコメントを生成
- 重要ポイント、ヒント、励ましを混ぜる
- 各コメントは30文字以内
- time_labelはレッスン時間内で均等に分布させる"""


def _get_client():
    """Create an Anthropic client."""
    return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def build_lesson_context(lesson):
    """Build structured context text from lesson/chapter/course hierarchy."""
    chapter = lesson.chapter
    course = chapter.course

    parts = [
        f"コース: {course.title}",
        f"カテゴリ: {course.get_category_display()}",
        f"難易度: {course.get_difficulty_display()}",
        f"コース概要: {course.description}",
        f"チャプター: {chapter.title}",
        f"レッスン: {lesson.title}",
    ]
    if lesson.description:
        parts.append(f"レッスン説明: {lesson.description}")
    parts.append(f"レッスンタイプ: {lesson.get_lesson_type_display()}")
    if lesson.duration_seconds:
        m = lesson.duration_seconds // 60
        s = lesson.duration_seconds % 60
        parts.append(f"レッスン時間: {m}分{s}秒")

    return "\n".join(parts)


def generate_lesson_comments(lesson):
    """Generate AI comments for a lesson. Uses DB cache via LessonAIComment.

    Returns list of {"time_label": "MM:SS", "text": "..."}.
    """
    # Check DB cache first
    try:
        cached = LessonAIComment.objects.get(lesson=lesson)
        return cached.comments
    except LessonAIComment.DoesNotExist:
        pass

    # Check Redis cache (in case DB write failed previously)
    cache_key = f"ai_comments:lesson:{lesson.pk}"
    cached_redis = cache.get(cache_key)
    if cached_redis:
        return cached_redis

    context = build_lesson_context(lesson)
    duration_min = max(1, lesson.duration_seconds // 60)

    client = _get_client()
    try:
        response = client.messages.create(
            model=settings.AI_COMMENT_MODEL,
            max_tokens=settings.AI_COMMENT_MAX_TOKENS,
            system=COMMENT_SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": (
                    f"以下のレッスン情報に基づいてコメントを生成してください。\n"
                    f"レッスン時間は約{duration_min}分です。\n\n{context}"
                ),
            }],
        )

        text = response.content[0].text.strip()
        # Extract JSON from response (handle possible markdown wrapping)
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        comments = json.loads(text)

        # Persist to DB
        LessonAIComment.objects.update_or_create(
            lesson=lesson,
            defaults={
                "comments": comments,
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
            },
        )

        # Also cache in Redis for 1 hour
        cache.set(cache_key, comments, 3600)

        return comments

    except Exception:
        logger.exception("Failed to generate AI comments for lesson %s", lesson.pk)
        return []


def stream_chat_response(session, user_message):
    """Stream a chat response via Claude. Yields SSE-formatted chunks.

    Saves both user and assistant messages to DB.
    """
    # Save user message
    ChatMessage.objects.create(
        session=session,
        role="user",
        content=user_message,
    )

    # Build conversation history (last 10 messages)
    history = list(
        session.messages.order_by('-created_at')[:10]
    )
    history.reverse()

    messages = []
    for msg in history:
        messages.append({
            "role": msg.role,
            "content": msg.content,
        })

    # Build system prompt with lesson context
    lesson = session.lesson
    context = build_lesson_context(lesson)
    system = f"{CHAT_SYSTEM_PROMPT}\n\n--- 現在のレッスン情報 ---\n{context}"

    client = _get_client()
    full_response = []

    try:
        with client.messages.stream(
            model=settings.AI_CHAT_MODEL,
            max_tokens=settings.AI_CHAT_MAX_TOKENS,
            system=system,
            messages=messages,
        ) as stream:
            for text in stream.text_stream:
                full_response.append(text)
                yield f"data: {json.dumps({'type': 'chunk', 'content': text}, ensure_ascii=False)}\n\n"

        # Save assistant message
        assistant_content = "".join(full_response)
        ChatMessage.objects.create(
            session=session,
            role="assistant",
            content=assistant_content,
        )

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    except Exception:
        logger.exception("Failed to stream chat response for session %s", session.pk)
        yield f"data: {json.dumps({'type': 'error', 'content': 'AI応答の生成中にエラーが発生しました。'}, ensure_ascii=False)}\n\n"
