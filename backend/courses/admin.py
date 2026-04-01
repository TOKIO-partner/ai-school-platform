from django.contrib import admin
from .models import Course, Chapter, Lesson


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0


class ChapterInline(admin.TabularInline):
    model = Chapter
    extra = 0


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'difficulty', 'instructor', 'status', 'created_at']
    list_filter = ['category', 'difficulty', 'status']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ChapterInline]


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order']
    list_filter = ['course']
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'chapter', 'lesson_type', 'order', 'duration_seconds']
    list_filter = ['lesson_type', 'chapter__course']
