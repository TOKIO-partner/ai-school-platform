from django.contrib import admin
from .models import Enrollment, LessonProgress, SkillPoint, Badge, UserBadge


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'progress_percent', 'created_at']
    list_filter = ['course']
    search_fields = ['user__username', 'course__title']


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ['enrollment', 'lesson', 'is_completed', 'watch_time_seconds']
    list_filter = ['is_completed']


@admin.register(SkillPoint)
class SkillPointAdmin(admin.ModelAdmin):
    list_display = ['user', 'category', 'points', 'level']
    list_filter = ['category']


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'icon']


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ['user', 'badge', 'earned_at']
    list_filter = ['badge']
