from rest_framework import serializers
from .models import Course, Chapter, Lesson


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'video_url', 'thumbnail',
                  'duration_seconds', 'duration_label', 'order', 'lesson_type']


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


# ---------------------------------------------------------------------------
# Admin serializers (CRUD)
# ---------------------------------------------------------------------------

class AdminLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'chapter', 'title', 'description', 'video_url',
                  'thumbnail', 'transcript', 'duration_seconds', 'duration_label',
                  'order', 'lesson_type', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class AdminChapterSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    lesson_count = serializers.SerializerMethodField()

    class Meta:
        model = Chapter
        fields = ['id', 'course', 'title', 'order', 'duration_label',
                  'lessons', 'lesson_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_lesson_count(self, obj):
        return obj.lessons.count()


class AdminCourseListSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField()
    lesson_count = serializers.IntegerField(read_only=True)
    enrolled_count = serializers.IntegerField(read_only=True)
    chapter_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'category', 'difficulty', 'description',
                  'thumbnail', 'instructor', 'instructor_name', 'duration_hours',
                  'tags', 'status', 'lesson_count', 'enrolled_count',
                  'chapter_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_instructor_name(self, obj):
        return obj.instructor.get_full_name() or obj.instructor.username


class AdminCourseDetailSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField()
    chapters = AdminChapterSerializer(many=True, read_only=True)
    lesson_count = serializers.IntegerField(read_only=True)
    enrolled_count = serializers.IntegerField(read_only=True)
    chapter_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'category', 'difficulty', 'description',
                  'overview', 'thumbnail', 'instructor', 'instructor_name',
                  'duration_hours', 'tags', 'language', 'status',
                  'lesson_count', 'enrolled_count', 'chapter_count',
                  'chapters', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_instructor_name(self, obj):
        return obj.instructor.get_full_name() or obj.instructor.username
