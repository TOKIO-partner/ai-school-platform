import traceback

from django.http import JsonResponse
from django.db import connection


def health_check(request):
    """Health check endpoint for Render monitoring."""
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
        db_status = 'ok'
    except Exception:
        db_status = 'error'

    return JsonResponse({
        'status': 'ok' if db_status == 'ok' else 'degraded',
        'database': db_status,
    })


def debug_check(request):
    """Temporary diagnostic endpoint to debug 500 errors."""
    info = {'db_engine': '', 'tables': [], 'courses_query': '', 'drf_test': ''}
    try:
        info['db_engine'] = str(connection.settings_dict.get('ENGINE', ''))
        with connection.cursor() as cursor:
            # Check which tables exist
            cursor.execute(
                "SELECT table_name FROM information_schema.tables "
                "WHERE table_schema = 'public' ORDER BY table_name"
            )
            info['tables'] = [row[0] for row in cursor.fetchall()]
    except Exception as e:
        info['tables_error'] = f'{type(e).__name__}: {e}'

    try:
        from courses.models import Course
        count = Course.objects.count()
        info['courses_query'] = f'ok, count={count}'
    except Exception as e:
        info['courses_query'] = f'{type(e).__name__}: {e}'
        info['courses_traceback'] = traceback.format_exc()

    try:
        from rest_framework.test import APIRequestFactory
        from courses.views import CourseViewSet
        factory = APIRequestFactory()
        req = factory.get('/api/v1/courses/')
        view = CourseViewSet.as_view({'get': 'list'})
        resp = view(req)
        resp.render()
        info['drf_test'] = f'status={resp.status_code}'
    except Exception as e:
        info['drf_test'] = f'{type(e).__name__}: {e}'
        info['drf_traceback'] = traceback.format_exc()

    return JsonResponse(info)
