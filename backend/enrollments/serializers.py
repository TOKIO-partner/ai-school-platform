from rest_framework import serializers
from .models import Enrollment, LessonProgress, SkillPoint, Badge, UserBadge
from courses.serializers import CourseListSerializer


class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

    class Meta:
        model = LessonProgress
        fields = ['id', 'lesson', 'lesson_title', 'is_completed', 'watch_time_seconds']


class EnrollmentListSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'progress_percent', 'created_at']


class SkillPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillPoint
        fields = ['category', 'points', 'level']


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon']


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'earned_at']
