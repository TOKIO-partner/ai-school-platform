"""
Production settings for MOMOCRI AI School Platform.

Services:
- Render: Django + Celery hosting + PostgreSQL (DATABASE_URL)
- Upstash: Serverless Redis (CELERY_BROKER_URL)
- Cloudflare R2: S3-compatible object storage
- Cloudflare: DNS/CDN
- Vercel: Next.js frontend
"""

import os

import dj_database_url

from .base import *  # noqa: F401,F403

DEBUG = False

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', '').split(',')

# --------------------------------------------------------------------------
# CORS (Vercel frontend → Render backend)
# --------------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = True

# --------------------------------------------------------------------------
# Database: Render PostgreSQL (built-in, auto-provisioned via render.yaml)
# --------------------------------------------------------------------------
_database_url = os.environ.get('DATABASE_URL', '')
if not _database_url:
    raise RuntimeError(
        'DATABASE_URL environment variable is required in production. '
        'It should be auto-set by the Render PostgreSQL database.'
    )
DATABASES = {
    'default': dj_database_url.config(
        default=_database_url,
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# --------------------------------------------------------------------------
# Security
# --------------------------------------------------------------------------
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = os.environ.get('DJANGO_SECURE_SSL_REDIRECT', 'True') == 'True'
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

SIMPLE_JWT['AUTH_COOKIE_SECURE'] = True  # noqa: F405

# Trust Render's proxy
CSRF_TRUSTED_ORIGINS = os.environ.get('CSRF_TRUSTED_ORIGINS', '').split(',')

# --------------------------------------------------------------------------
# Static files: WhiteNoise (serve from Django, no separate Nginx needed)
# --------------------------------------------------------------------------
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')  # noqa: F405
STORAGES = {
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

# --------------------------------------------------------------------------
# Media files: Cloudflare R2 (S3-compatible)
# --------------------------------------------------------------------------
if os.environ.get('R2_BUCKET_NAME'):
    STORAGES['default'] = {
        'BACKEND': 'storages.backends.s3boto3.S3Boto3Storage',
    }
    AWS_STORAGE_BUCKET_NAME = os.environ['R2_BUCKET_NAME']
    AWS_S3_ENDPOINT_URL = os.environ['R2_ENDPOINT_URL']  # https://<account_id>.r2.cloudflarestorage.com
    AWS_ACCESS_KEY_ID = os.environ['R2_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = os.environ['R2_SECRET_ACCESS_KEY']
    AWS_S3_REGION_NAME = 'auto'  # R2 uses 'auto'
    AWS_DEFAULT_ACL = None
    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',
    }
    AWS_QUERYSTRING_AUTH = False
    # Custom domain for R2 public access (optional)
    if os.environ.get('R2_CUSTOM_DOMAIN'):
        AWS_S3_CUSTOM_DOMAIN = os.environ['R2_CUSTOM_DOMAIN']

# --------------------------------------------------------------------------
# Celery: Upstash Redis (serverless, TLS)
# Connection string format: rediss://default:password@endpoint:6379
# --------------------------------------------------------------------------
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', CELERY_BROKER_URL)
CELERY_BROKER_USE_SSL = CELERY_BROKER_URL.startswith('rediss://')
CELERY_REDIS_BACKEND_USE_SSL = CELERY_BROKER_URL.startswith('rediss://')

# --------------------------------------------------------------------------
# Logging
# --------------------------------------------------------------------------
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': os.environ.get('DJANGO_LOG_LEVEL', 'INFO'),
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.environ.get('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
    },
}

# --------------------------------------------------------------------------
# Email (configure when needed)
# --------------------------------------------------------------------------
EMAIL_BACKEND = os.environ.get(
    'EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend'
)
