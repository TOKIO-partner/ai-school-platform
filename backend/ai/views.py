import time

from django.core.cache import cache
from django.http import StreamingHttpResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from courses.models import Lesson
from .models import ChatSession
from .serializers import ChatInputSerializer, ChatMessageSerializer
from .services import generate_lesson_comments, stream_chat_response


def _check_rate_limit(user_id):
    """Simple rate limit: 60 requests/hour per user using Redis."""
    key = f"ai_rate:{user_id}:{int(time.time() // 3600)}"
    count = cache.get(key, 0)
    if count >= 60:
        return False
    cache.set(key, count + 1, 3600)
    return True


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_stream(request):
    """SSE streaming chat with AI coach."""
    serializer = ChatInputSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    lesson_id = serializer.validated_data['lesson_id']
    message = serializer.validated_data['message']

    # Rate limit
    if not _check_rate_limit(request.user.id):
        return Response(
            {"detail": "レート制限に達しました。しばらく待ってから再試行してください。"},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    # Validate lesson exists
    try:
        lesson = Lesson.objects.select_related('chapter__course').get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response(
            {"detail": "レッスンが見つかりません。"},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Get or create session
    session, _ = ChatSession.objects.get_or_create(
        user=request.user,
        lesson=lesson,
    )

    response = StreamingHttpResponse(
        stream_chat_response(session, message),
        content_type='text/event-stream',
    )
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history(request, lesson_id):
    """Get chat history for a lesson."""
    try:
        session = ChatSession.objects.get(
            user=request.user,
            lesson_id=lesson_id,
        )
    except ChatSession.DoesNotExist:
        return Response([])

    messages = session.messages.order_by('created_at')
    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lesson_comments(request, lesson_id):
    """Get AI-generated comments for a lesson."""
    try:
        lesson = Lesson.objects.select_related('chapter__course').get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response(
            {"detail": "レッスンが見つかりません。"},
            status=status.HTTP_404_NOT_FOUND,
        )

    comments = generate_lesson_comments(lesson)
    return Response(comments)
