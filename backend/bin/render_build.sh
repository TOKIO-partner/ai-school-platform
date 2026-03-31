#!/usr/bin/env bash
# Render build script for Django backend
# This runs during each deploy on Render.

set -o errexit  # exit on error
set -o pipefail # exit on pipe failure
set -o nounset  # exit on unset variable

pip install --upgrade pip
pip install -r requirements/production.txt

python manage.py collectstatic --noinput

if [ -n "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is set, running migrations..."
  python manage.py migrate --noinput
else
  echo "DATABASE_URL not set, skipping migrations."
fi
