"""Migrate lesson videos from Google Drive to self-hosted storage (mp4).

Google Drive `/file/d/<ID>/preview` URLs are iframe-embed URLs and cannot be
played by the HTML5 <video> element. This command downloads each Drive-hosted
lesson video and re-uploads it to Django's configured default storage
(Cloudflare R2 / S3-compatible in production), then rewrites
``lesson.video_url`` to the direct, playable mp4 URL.

The command is idempotent:
  * lessons whose video_url is already non-Drive are skipped (unless --force)
  * uploads use a stable key ``videos/lesson_<id>.mp4`` so re-runs overwrite
    the same object instead of creating duplicates

Usage:
  python manage.py migrate_video_storage                 # all Drive-hosted lessons
  python manage.py migrate_video_storage --lesson-id 71  # a single lesson
  python manage.py migrate_video_storage --course-id 5   # all lessons in a course
  python manage.py migrate_video_storage --dry-run       # show what would happen
  python manage.py migrate_video_storage --force         # re-download + overwrite
"""
import os
import re
import tempfile

from django.core.files import File
from django.core.files.storage import default_storage
from django.core.management.base import BaseCommand

from courses.models import Lesson

DRIVE_ID_RE = re.compile(r'/file/d/([^/]+)/')


def extract_drive_id(url: str) -> str | None:
    """Return the Google Drive file id from a /file/d/<ID>/... URL, else None."""
    if 'drive.google.com' not in url:
        return None
    m = DRIVE_ID_RE.search(url)
    if m:
        return m.group(1)
    # Fallback: ?id=<ID>
    m = re.search(r'[?&]id=([^&]+)', url)
    return m.group(1) if m else None


class Command(BaseCommand):
    help = 'Download Google Drive lesson videos and re-host them as direct mp4.'

    def add_arguments(self, parser):
        parser.add_argument('--lesson-id', type=int, help='Migrate a specific lesson')
        parser.add_argument('--course-id', type=int, help='Migrate all lessons in a course')
        parser.add_argument('--dry-run', action='store_true', help='Show actions without changing anything')
        parser.add_argument('--force', action='store_true', help='Re-download and overwrite already-migrated lessons')

    def handle(self, *args, **options):
        import gdown

        qs = Lesson.objects.filter(video_url__gt='')
        if options['lesson_id']:
            qs = qs.filter(pk=options['lesson_id'])
        elif options['course_id']:
            qs = qs.filter(chapter__course_id=options['course_id'])

        lessons = list(
            qs.select_related('chapter__course')
            .order_by('chapter__course_id', 'chapter__order', 'order')
        )

        # Keep only Drive-hosted lessons unless forcing a re-run on a specific set
        targets = []
        for lesson in lessons:
            drive_id = extract_drive_id(lesson.video_url)
            if drive_id is None and not options['force']:
                continue
            targets.append((lesson, drive_id))

        self.stdout.write(f'{len(targets)} lesson(s) to migrate')
        if not targets:
            return

        dry = options['dry_run']
        migrated = 0
        for i, (lesson, drive_id) in enumerate(targets, 1):
            course = lesson.chapter.course
            self.stdout.write(f'\n[{i}/{len(targets)}] {course.title} > {lesson.title}')
            self.stdout.write(f'  from: {lesson.video_url}')

            if drive_id is None:
                self.stdout.write(self.style.WARNING('  SKIP: not a Google Drive URL and no --force handling'))
                continue

            key = f'videos/lesson_{lesson.id}.mp4'

            if dry:
                self.stdout.write(f'  would download Drive id {drive_id} -> {key}')
                continue

            tmp_path = None
            try:
                # 1. Download from Google Drive
                fd, tmp_path = tempfile.mkstemp(suffix='.mp4')
                os.close(fd)
                gdown.download(id=drive_id, output=tmp_path, quiet=True)
                if not os.path.exists(tmp_path) or os.path.getsize(tmp_path) == 0:
                    self.stdout.write(self.style.ERROR('  ERROR: download failed / empty file'))
                    continue

                # 2. Upload to default storage (overwrite stable key for idempotency)
                if default_storage.exists(key):
                    default_storage.delete(key)
                with open(tmp_path, 'rb') as fh:
                    saved_key = default_storage.save(key, File(fh))
                url = default_storage.url(saved_key)

                # 3. Point the lesson at the new direct mp4 URL
                lesson.video_url = url
                lesson.save(update_fields=['video_url'])
                migrated += 1
                self.stdout.write(self.style.SUCCESS(f'  to:   {url}'))
            except Exception as exc:  # noqa: BLE001 - surface and continue
                self.stdout.write(self.style.ERROR(f'  ERROR: {exc}'))
            finally:
                if tmp_path and os.path.exists(tmp_path):
                    os.remove(tmp_path)

        self.stdout.write(self.style.SUCCESS(f'\nDone. {migrated}/{len(targets)} migrated.'))
