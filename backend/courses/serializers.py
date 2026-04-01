from rest_framework import serializers
from .models import Course, Chapter, Lesson


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'video_url', 'duration_seconds',
                  'duration_label', 'order', 'lesson_type']


class ChapterSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Chapter
        fields = ['id', 'title', 'order', 'duration_label', 'lessons']


class CourseListSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField()
    lesson_count = serializers.IntegerField(read_only=True)
    enrolled_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'category', 'difficulty', 'description',
                  'thumbnail', 'instructor', 'instructor_name', 'duration_hours',
                  'tags', 'lesson_count', 'enrolled_count', 'status']

    def get_instructor_name(self, obj):
        return obj.instructor.get_full_name() or obj.instructor.username


class CourseDetailSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField()
    chapters = ChapterSerializer(many=True, read_only=True)
    lesson_count = serializers.IntegerField(read_only=True)
    enrolled_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'category', 'difficulty', 'description',
                  'overview', 'thumbnail', 'instructor', 'instructor_name',
                  'duration_hours', 'tags', 'language', 'status',
                  'lesson_count', 'enrolled_count', 'chapters']

    def get_instructor_name(self, obj):
        return obj.instructor.get_full_name() or obj.instructor.username
