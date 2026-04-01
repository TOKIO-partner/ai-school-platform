from django.db import models
from django.conf import settings
from core.models import TimestampedModel


class Course(TimestampedModel):
    """Online course."""
    CATEGORY_CHOICES = [
        ('design', 'Design'),
        ('dev', 'Development'),
        ('ai', 'AI'),
        ('business', 'Business'),
    ]
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('hidden', 'Hidden'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='beginner')
    description = models.TextField(blank=True, default='')
    overview = models.TextField(blank=True, default='')
    thumbnail = models.URLField(blank=True, default='')
    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='taught_courses',
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    duration_hours = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    tags = models.JSONField(default=list, blank=True)
    language = models.CharField(max_length=10, default='ja')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Chapter(TimestampedModel):
    """Chapter within a course."""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    duration_label = models.CharField(max_length=50, blank=True, default='')

    class Meta:
        ordering = ['order']
        unique_together = ['course', 'order']

    def __str__(self):
        return f'{self.course.title} - {self.title}'


class Lesson(TimestampedModel):
    """Lesson within a chapter."""
    LESSON_TYPE_CHOICES = [
        ('video', 'Video'),
        ('article', 'Article'),
        ('quiz', 'Quiz'),
        ('exercise', 'Exercise'),
    ]

    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    video_url = models.URLField(blank=True, default='')
    duration_seconds = models.PositiveIntegerField(default=0)
    duration_label = models.CharField(max_length=50, blank=True, default='')
    order = models.PositiveIntegerField(default=0)
    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPE_CHOICES, default='video')

    class Meta:
        ordering = ['order']
        unique_together = ['chapter', 'order']

    def __str__(self):
        return self.title
