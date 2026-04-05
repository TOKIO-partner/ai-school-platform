from django.urls import path
from . import views

urlpatterns = [
    path('ai/chat/', views.chat_stream, name='ai-chat-stream'),
    path('ai/chat/<int:lesson_id>/history/', views.chat_history, name='ai-chat-history'),
    path('ai/lessons/<int:lesson_id>/comments/', views.lesson_comments, name='ai-lesson-comments'),
]
