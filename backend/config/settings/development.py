"""Development settings."""

from .base import *  # noqa: F401,F403

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# CORS - allow Next.js dev server
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]
CORS_ALLOW_CREDENTIALS = True

# Use SQLite for simpler development if PostgreSQL is not available
# Uncomment below to use SQLite instead:
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

# Email backend
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
