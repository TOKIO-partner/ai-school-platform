#!/usr/bin/env bash
# Render build script for Django backend
# This runs during each deploy on Render.

set -o errexit  # exit on error
set -o pipefail # exit on pipe failure
set -o nounset  # exit on unset variable

pip install --upgrade pip
pip install -r requirements/production.txt

python manage.py collectstatic --noinput
python manage.py migrate --noinput
