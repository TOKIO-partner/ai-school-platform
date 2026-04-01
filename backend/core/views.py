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
