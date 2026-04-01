from django.urls import path
from . import views

urlpatterns = [
    path('enrollments/me/', views.MyEnrollmentListView.as_view(), name='my-enrollments'),
    path('enrollments/me/stats/', views.MyStatsView.as_view(), name='my-stats'),
    path('enrollments/me/skills/', views.MySkillsView.as_view(), name='my-skills'),
    path('enrollments/me/badges/', views.MyBadgesView.as_view(), name='my-badges'),
    path('enrollments/me/lessons/<int:lesson_id>/progress/',
         views.LessonProgressUpdateView.as_view(), name='lesson-progress-update'),
]
