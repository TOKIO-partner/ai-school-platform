from django.db import models
from django.conf import settings
from core.models import TimestampedModel


class Enrollment(TimestampedModel):
    """User enrollment in a course."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    course = models.ForeignKey(
        'courses.Course',
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    progress_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'course']

    def __str__(self):
        return f'{self.user.username} - {self.course.title} ({self.progress_percent}%)'


class LessonProgress(TimestampedModel):
    """Progress tracking for individual lessons."""
    enrollment = models.ForeignKey(
        Enrollment,
        on_delete=models.CASCADE,
        related_name='lesson_progresses',
    )
    lesson = models.ForeignKey(
        'courses.Lesson',
        on_delete=models.CASCADE,
        related_name='progresses',
    )
    is_completed = models.BooleanField(default=False)
    watch_time_seconds = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-updated_at']
        unique_together = ['enrollment', 'lesson']

    def __str__(self):
        status = 'completed' if self.is_completed else 'in-progress'
        return f'{self.enrollment.user.username} - {self.lesson.title} ({status})'


class SkillPoint(TimestampedModel):
    """Skill points per category for a user."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='skill_points',
    )
    category = models.CharField(max_length=50)
    points = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['-points']
        unique_together = ['user', 'category']

    def __str__(self):
        return f'{self.user.username} - {self.category}: {self.points}pts (Lv{self.level})'


class Badge(TimestampedModel):
    """Achievement badge definition."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, blank=True, default='')

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class UserBadge(TimestampedModel):
    """Badge earned by a user."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='badges',
    )
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='awarded_to')
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-earned_at']
        unique_together = ['user', 'badge']

    def __str__(self):
        return f'{self.user.username} - {self.badge.name}'
