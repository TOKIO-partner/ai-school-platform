from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('courses', views.CourseViewSet, basename='course')

urlpatterns = [
    path('', include(router.urls)),
    # Admin CRUD
    path('admin/courses/', views.AdminCourseListCreateView.as_view(), name='admin-course-list'),
    path('admin/courses/<int:pk>/', views.AdminCourseDetailView.as_view(), name='admin-course-detail'),
    path('admin/courses/<int:course_pk>/chapters/', views.AdminChapterListCreateView.as_view(), name='admin-chapter-list'),
    path('admin/courses/<int:course_pk>/chapters/<int:pk>/', views.AdminChapterDetailView.as_view(), name='admin-chapter-detail'),
    path('admin/courses/<int:course_pk>/chapters/<int:chapter_pk>/lessons/', views.AdminLessonListCreateView.as_view(), name='admin-lesson-list'),
    path('admin/courses/<int:course_pk>/chapters/<int:chapter_pk>/lessons/<int:pk>/', views.AdminLessonDetailView.as_view(), name='admin-lesson-detail'),
]
