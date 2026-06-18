from django.urls import path
from . import views

urlpatterns = [
    path('notifications/me/', views.MyNotificationListView.as_view(), name='my-notifications'),
    path('notifications/me/unread-count/', views.MyUnreadCountView.as_view(), name='my-notifications-unread-count'),
    path('notifications/me/read-all/', views.NotificationMarkAllReadView.as_view(), name='my-notifications-read-all'),
    path('notifications/me/<int:pk>/read/', views.NotificationMarkReadView.as_view(), name='my-notification-read'),
]
