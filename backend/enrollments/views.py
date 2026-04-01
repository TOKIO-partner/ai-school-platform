from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta

from .models import Enrollment, LessonProgress, SkillPoint, UserBadge
from .serializers import (
    EnrollmentListSerializer, LessonProgressSerializer,
    SkillPointSerializer, UserBadgeSerializer,
)


class MyEnrollmentListView(generics.ListAPIView):
    """GET /enrollments/me/ - User's enrolled courses."""
    serializer_class = EnrollmentListSerializer

    def get_queryset(self):
        return Enrollment.objects.filter(
            user=self.request.user
        ).select_related('course__instructor').annotate(
            lesson_count=Count('course__chapters__lessons'),
            enrolled_count=Count('course__enrollments'),
        )


class MyStatsView(APIView):
    """GET /enrollments/me/stats/ - Learning statistics."""

    def get(self, request):
        user = request.user
        enrollments = Enrollment.objects.filter(user=user)
        progresses = LessonProgress.objects.filter(enrollment__user=user)

        total_watch_time = progresses.aggregate(
            total=Sum('watch_time_seconds')
        )['total'] or 0

        completed_courses = enrollments.filter(progress_percent=100).count()
        completed_lessons = progresses.filter(is_completed=True).count()

        skill_total = SkillPoint.objects.filter(user=user).aggregate(
            total=Sum('points')
        )['total'] or 0

        week_ago = timezone.now() - timedelta(days=7)
        weekly_completed = progresses.filter(
            is_completed=True, updated_at__gte=week_ago
        ).count()

        return Response({
            'total_watch_time_seconds': total_watch_time,
            'total_watch_time_hours': round(total_watch_time / 3600, 1),
            'completed_courses': completed_courses,
            'completed_lessons': completed_lessons,
            'skill_points_total': skill_total,
            'weekly_completed_lessons': weekly_completed,
        })


class MySkillsView(generics.ListAPIView):
    """GET /enrollments/me/skills/ - Skill points by category."""
    serializer_class = SkillPointSerializer

    def get_queryset(self):
        return SkillPoint.objects.filter(user=self.request.user)


class MyBadgesView(generics.ListAPIView):
    """GET /enrollments/me/badges/ - Earned badges."""
    serializer_class = UserBadgeSerializer

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user).select_related('badge')


class LessonProgressUpdateView(APIView):
    """PATCH /enrollments/me/lessons/{id}/progress/ - Update lesson progress."""

    def patch(self, request, lesson_id):
        user = request.user
        try:
            enrollment = Enrollment.objects.get(
                user=user,
                course__chapters__lessons__id=lesson_id,
            )
        except Enrollment.DoesNotExist:
            return Response(
                {'detail': 'Enrollment not found for this lesson.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        progress, _ = LessonProgress.objects.get_or_create(
            enrollment=enrollment,
            lesson_id=lesson_id,
        )

        is_completed = request.data.get('is_completed', progress.is_completed)
        watch_time = request.data.get('watch_time_seconds', progress.watch_time_seconds)

        progress.is_completed = is_completed
        progress.watch_time_seconds = watch_time
        progress.save()

        # Recalculate enrollment progress
        total_lessons = enrollment.course.chapters.aggregate(
            total=Count('lessons')
        )['total'] or 1
        completed = enrollment.lesson_progresses.filter(is_completed=True).count()
        enrollment.progress_percent = round((completed / total_lessons) * 100, 2)
        enrollment.save()

        return Response(LessonProgressSerializer(progress).data)
