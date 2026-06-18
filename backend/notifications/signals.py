"""Auto-generate notifications on domain events (e.g. course publishing)."""
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

from courses.models import Course
from .models import Notification


def _get_students():
    """All active students who should receive broadcast notifications."""
    from accounts.models import User
    return User.objects.filter(role='student', is_active=True)


@receiver(pre_save, sender=Course)
def cache_previous_course_status(sender, instance, **kwargs):
    """Stash the previous status so post_save can detect a publish transition."""
    if instance.pk:
        previous = sender.objects.filter(pk=instance.pk).values_list('status', flat=True).first()
        instance._previous_status = previous
    else:
        instance._previous_status = None


@receiver(post_save, sender=Course)
def notify_course_published(sender, instance, created, **kwargs):
    """Broadcast a notification to every student when a course becomes published."""
    previous_status = getattr(instance, '_previous_status', None)
    became_published = (
        instance.status == 'published'
        and (created or previous_status != 'published')
    )
    if not became_published:
        return

    students = _get_students()
    notifications = [
        Notification(
            user=student,
            type='course',
            title='新しいコースが追加されました',
            message=f'「{instance.title}」が公開されました。今すぐチェックしてみましょう。',
            link=f'/courses/{instance.slug}',
        )
        for student in students
    ]
    if notifications:
        Notification.objects.bulk_create(notifications)
