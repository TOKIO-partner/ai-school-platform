from rest_framework import viewsets, generics, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count

from .models import Course, Chapter, Lesson
from .serializers import (
    CourseListSerializer, CourseDetailSerializer,
    AdminCourseListSerializer, AdminCourseDetailSerializer,
    AdminChapterSerializer, AdminLessonSerializer,
)
from core.permissions import IsAdmin


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve published courses."""
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category', 'difficulty']
    search_fields = ['title', 'description']

    def get_queryset(self):
        return Course.objects.filter(status='published').annotate(
            lesson_count=Count('chapters__lessons', distinct=True),
            enrolled_count=Count('enrollments', distinct=True),
        ).select_related('instructor')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer


# ---------------------------------------------------------------------------
# Admin CRUD views
# ---------------------------------------------------------------------------

class AdminCourseListCreateView(generics.ListCreateAPIView):
    """Admin: list all courses (any status) and create new courses."""
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'difficulty', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        return Course.objects.annotate(
            lesson_count=Count('chapters__lessons', distinct=True),
            enrolled_count=Count('enrollments', distinct=True),
            chapter_count=Count('chapters', distinct=True),
        ).select_related('instructor')

    def get_serializer_class(self):
        return AdminCourseListSerializer

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)


class AdminCourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: retrieve, update, delete a course."""
    permission_classes = [IsAdmin]
    serializer_class = AdminCourseDetailSerializer

    def get_queryset(self):
        return Course.objects.annotate(
            lesson_count=Count('chapters__lessons', distinct=True),
            enrolled_count=Count('enrollments', distinct=True),
            chapter_count=Count('chapters', distinct=True),
        ).select_related('instructor')


class AdminChapterListCreateView(generics.ListCreateAPIView):
    """Admin: list chapters for a course and create new chapters."""
    permission_classes = [IsAdmin]
    serializer_class = AdminChapterSerializer

    def get_queryset(self):
        return Chapter.objects.filter(
            course_id=self.kwargs['course_pk']
        ).prefetch_related('lessons')

    def perform_create(self, serializer):
        serializer.save(course_id=self.kwargs['course_pk'])


class AdminChapterDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: retrieve, update, delete a chapter."""
    permission_classes = [IsAdmin]
    serializer_class = AdminChapterSerializer

    def get_queryset(self):
        return Chapter.objects.filter(
            course_id=self.kwargs['course_pk']
        ).prefetch_related('lessons')


class AdminLessonListCreateView(generics.ListCreateAPIView):
    """Admin: list lessons for a chapter and create new lessons."""
    permission_classes = [IsAdmin]
    serializer_class = AdminLessonSerializer

    def get_queryset(self):
        return Lesson.objects.filter(
            chapter_id=self.kwargs['chapter_pk'],
            chapter__course_id=self.kwargs['course_pk'],
        )

    def perform_create(self, serializer):
        serializer.save(chapter_id=self.kwargs['chapter_pk'])


class AdminLessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin: retrieve, update, delete a lesson."""
    permission_classes = [IsAdmin]
    serializer_class = AdminLessonSerializer

    def get_queryset(self):
        return Lesson.objects.filter(
            chapter_id=self.kwargs['chapter_pk'],
            chapter__course_id=self.kwargs['course_pk'],
        )
