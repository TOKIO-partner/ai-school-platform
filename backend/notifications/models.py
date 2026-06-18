from django.db import models
from django.conf import settings
from core.models import TimestampedModel


class Notification(TimestampedModel):
    """In-app notification delivered to a single user."""
    TYPE_CHOICES = [
        ('system', 'System'),
        ('course', 'Course'),
        ('instructor', 'Instructor'),
        ('event', 'Event'),
        ('feedback', 'Feedback'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='system')
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True, default='')
    link = models.CharField(max_length=255, blank=True, default='')
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]

    def __str__(self):
        return f'{self.user.username} - {self.title}'
