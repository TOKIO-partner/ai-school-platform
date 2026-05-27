import uuid

from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.db import connection
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsAdmin


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


ALLOWED_EXTENSIONS = {
    'video': {'mp4', 'mov', 'webm', 'avi'},
    'image': {'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'},
    'document': {'pdf', 'pptx', 'xlsx', 'docx'},
}
ALL_ALLOWED = {ext for exts in ALLOWED_EXTENSIONS.values() for ext in exts}

MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024  # 2GB


class MediaUploadView(APIView):
    """Upload media files to default storage (local or R2)."""
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser]

    def post(self, request):
        uploaded = request.FILES.get('file')
        if not uploaded:
            return Response({'detail': 'ファイルが指定されていません。'}, status=status.HTTP_400_BAD_REQUEST)

        if uploaded.size > MAX_FILE_SIZE:
            return Response({'detail': 'ファイルサイズが上限(2GB)を超えています。'}, status=status.HTTP_400_BAD_REQUEST)

        ext = uploaded.name.rsplit('.', 1)[-1].lower() if '.' in uploaded.name else ''
        if ext not in ALL_ALLOWED:
            return Response({'detail': f'許可されていないファイル形式です: .{ext}'}, status=status.HTTP_400_BAD_REQUEST)

        # Determine subdirectory
        for category, exts in ALLOWED_EXTENSIONS.items():
            if ext in exts:
                subdir = category
                break
        else:
            subdir = 'other'

        filename = f'{subdir}/{uuid.uuid4().hex}.{ext}'
        saved_path = default_storage.save(filename, uploaded)
        url = default_storage.url(saved_path)

        return Response({
            'url': url,
            'path': saved_path,
            'name': uploaded.name,
            'size': uploaded.size,
            'content_type': uploaded.content_type,
        }, status=status.HTTP_201_CREATED)
