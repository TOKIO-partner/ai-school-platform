from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('django-admin/', admin.site.urls),
    # API v1
    path('api/v1/', include('accounts.urls')),
    path('api/v1/', include('courses.urls')),
    path('api/v1/', include('enrollments.urls')),
    path('api/v1/', include('submissions.urls')),
    path('api/v1/', include('portfolios.urls')),
    path('api/v1/', include('community.urls')),
    path('api/v1/', include('events.urls')),
    path('api/v1/', include('notifications.urls')),
    path('api/v1/', include('billing.urls')),
    path('api/v1/', include('ai.urls')),
    path('api/v1/', include('analytics.urls')),
    # API Schema / Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
