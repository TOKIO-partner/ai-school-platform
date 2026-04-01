from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count

from .models import Course
from .serializers import CourseListSerializer, CourseDetailSerializer


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve published courses."""
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category', 'difficulty']
    search_fields = ['title', 'description']

    def get_queryset(self):
        return Course.objects.filter(status='published').annotate(
            lesson_count=Count('chapters__lessons'),
            enrolled_count=Count('enrollments'),
        ).select_related('instructor')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer
