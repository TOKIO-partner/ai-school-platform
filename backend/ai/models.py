from django.db import models
from django.conf import settings
from core.models import TimestampedModel


class ChatSession(TimestampedModel):
    """AI chat session per user per lesson."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ai_chat_sessions',
    )
    lesson = models.ForeignKey(
        'courses.Lesson',
        on_delete=models.CASCADE,
        related_name='ai_chat_sessions',
    )

    class Meta:
        unique_together = ['user', 'lesson']
        ordering = ['-updated_at']

    def __str__(self):
        return f"ChatSession({self.user} / Lesson {self.lesson_id})"


class ChatMessage(TimestampedModel):
    """Individual message in a chat session."""
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
    ]

    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name='messages',
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.role}: {self.content[:50]}"


class LessonAIComment(TimestampedModel):
    """AI-generated comments for a lesson (cached)."""
    lesson = models.OneToOneField(
        'courses.Lesson',
        on_delete=models.CASCADE,
        related_name='ai_comment',
    )
    comments = models.JSONField(
        default=list,
        help_text='[{"time_label": "02:30", "text": "..."}]',
    )
    input_tokens = models.PositiveIntegerField(default=0)
    output_tokens = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"AIComments(Lesson {self.lesson_id})"
