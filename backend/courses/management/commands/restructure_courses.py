"""Split the single monolithic course into 6 topic-based courses.

The production DB currently holds one course (`ai-web-design-basics`) with
7 chapters / 27 lessons. This command rebuilds it into 6 standalone courses
mapped from the existing chapters, preserving every lesson's video_url and
transcript, then deletes the old course.

Idempotent-ish: re-running with --force first deletes any previously created
target courses (by slug) before recreating them.

Usage:
    python manage.py restructure_courses --dry-run
    python manage.py restructure_courses --backup /tmp/course1_backup.json
    python manage.py restructure_courses
"""
import json
from decimal import Decimal, ROUND_HALF_UP

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify

from courses.models import Course, Chapter, Lesson

SOURCE_SLUG = 'ai-web-design-basics'

# Unsplash placeholder thumbnails per topic (replaceable later via admin UI).
THUMB = {
    'design-basics': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    'canva-sns': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    'canva-thumbnail': 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
    'figma-banner': 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800',
    'illustrator-logo': 'https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?w=800',
    'ai-image-generation': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
}

# New course definitions. `chapters` lists the *source* chapter titles whose
# lessons move into this course, in order. Each entry becomes one Chapter in
# the new course (so design-basics keeps its 2 chapters).
COURSE_DEFS = [
    {
        'slug': 'design-basics',
        'title': 'デザインの基礎',
        'category': 'design',
        'description': '伝わる・魅せるデザインの考え方と基礎を学ぶ入門コース。',
        'chapters': ['はじめに', '伝わる・魅せるデザインの基礎'],
    },
    {
        'slug': 'canva-sns',
        'title': 'CanvaでつくるSNSデザイン',
        'category': 'design',
        'description': 'Canvaを使ってSNS向けのデザインを実践で作成する。',
        'chapters': ['Canvaでデザイン実践：SNS'],
    },
    {
        'slug': 'canva-thumbnail',
        'title': 'Canvaでつくるサムネイル',
        'category': 'design',
        'description': 'Canvaで目を引くサムネイルを制作する実践コース。',
        'chapters': ['Canvaでデザイン実践：サムネイル'],
    },
    {
        'slug': 'figma-banner',
        'title': 'Figmaバナー制作講座',
        'category': 'design',
        'description': 'Figmaの基本操作からバナー制作・模写・課題実演までを習得する。',
        'chapters': ['Figmaバナー制作講座'],
    },
    {
        'slug': 'illustrator-logo',
        'title': 'Illustratorロゴ制作',
        'category': 'design',
        'description': 'Illustratorでロゴ制作の流れと実践を学ぶ。',
        'chapters': ['Illustratorロゴ制作'],
    },
    {
        'slug': 'ai-image-generation',
        'title': 'AI画像生成講座',
        'category': 'ai',
        'description': 'Midjourney・Freepik・PhotoshopなどでAI画像生成を実践する。',
        'chapters': ['AI画像生成講座'],
    },
]

LESSON_FIELDS = ('title', 'description', 'video_url', 'transcript',
                 'duration_seconds', 'duration_label', 'lesson_type')


class Command(BaseCommand):
    help = 'Split the single AI web design course into 6 topic-based courses.'

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true',
                            help='Show what would happen without writing.')
        parser.add_argument('--force', action='store_true',
                            help='Delete pre-existing target courses (by slug) before recreating.')
        parser.add_argument('--backup', type=str, default=None,
                            help='Write a JSON backup of the source course to this path.')

    def handle(self, *args, **opts):
        dry = opts['dry_run']
        force = opts['force']

        try:
            source = Course.objects.get(slug=SOURCE_SLUG)
        except Course.DoesNotExist:
            raise CommandError(f'Source course "{SOURCE_SLUG}" not found. Nothing to do.')

        instructor = source.instructor

        # Index source lessons by chapter title.
        by_chapter = {}
        total_src_lessons = 0
        for ch in source.chapters.all().order_by('order'):
            lessons = list(ch.lessons.all().order_by('order'))
            by_chapter[ch.title] = lessons
            total_src_lessons += len(lessons)

        self.stdout.write(self.style.NOTICE(
            f'Source: {source.title} (id={source.id}) — '
            f'{len(by_chapter)} chapters / {total_src_lessons} lessons'))

        # Backup.
        if opts['backup']:
            self._write_backup(source, by_chapter, opts['backup'])
            self.stdout.write(self.style.SUCCESS(f'Backup written to {opts["backup"]}'))

        # Validate every referenced source chapter exists.
        referenced = {c for d in COURSE_DEFS for c in d['chapters']}
        missing = referenced - set(by_chapter)
        if missing:
            raise CommandError(f'Source chapters referenced but not found: {missing}')

        # Plan summary.
        planned_total = 0
        for d in COURSE_DEFS:
            n = sum(len(by_chapter[c]) for c in d['chapters'])
            planned_total += n
            self.stdout.write(f'  → {d["slug"]:<22} {d["title"]:<24} '
                              f'{len(d["chapters"])}章 / {n}レッスン  [{d["category"]}]')
        self.stdout.write(f'Planned lessons total: {planned_total} '
                          f'(source has {total_src_lessons})')
        if planned_total != total_src_lessons:
            self.stdout.write(self.style.WARNING(
                'WARNING: planned lesson count != source lesson count '
                '(some source chapters not mapped).'))

        if dry:
            self.stdout.write(self.style.WARNING('--dry-run: no changes written.'))
            return

        with transaction.atomic():
            # Handle pre-existing target slugs.
            existing = Course.objects.filter(slug__in=[d['slug'] for d in COURSE_DEFS])
            if existing.exists():
                if not force:
                    raise CommandError(
                        f'Target slugs already exist: '
                        f'{list(existing.values_list("slug", flat=True))}. '
                        f'Re-run with --force to recreate.')
                existing.delete()
                self.stdout.write(self.style.WARNING('Deleted pre-existing target courses.'))

            created_courses = 0
            created_lessons = 0
            for d in COURSE_DEFS:
                total_secs = sum(
                    getattr(l, 'duration_seconds', 0) or 0
                    for ct in d['chapters'] for l in by_chapter[ct])
                hours = (Decimal(total_secs) / Decimal(3600)).quantize(
                    Decimal('0.1'), rounding=ROUND_HALF_UP)

                course = Course.objects.create(
                    title=d['title'],
                    slug=d['slug'],
                    category=d['category'],
                    difficulty='beginner',
                    description=d['description'],
                    overview=source.overview,
                    thumbnail=THUMB.get(d['slug'], ''),
                    instructor=instructor,
                    status='published',
                    duration_hours=hours,
                    tags=source.tags,
                    language='ja',
                )
                created_courses += 1

                for ch_order, ct in enumerate(d['chapters']):
                    chapter = Chapter.objects.create(
                        course=course, title=ct, order=ch_order)
                    for lo, src in enumerate(by_chapter[ct]):
                        Lesson.objects.create(
                            chapter=chapter, order=lo,
                            **{f: getattr(src, f) for f in LESSON_FIELDS})
                        created_lessons += 1

                self.stdout.write(self.style.SUCCESS(
                    f'  created {course.slug}: {hours}h, '
                    f'{sum(len(by_chapter[c]) for c in d["chapters"])} lessons'))

            # Delete the old monolithic course (cascades FKs).
            src_id = source.id
            source.delete()
            self.stdout.write(self.style.SUCCESS(
                f'Deleted source course id={src_id}.'))

            self.stdout.write(self.style.SUCCESS(
                f'DONE: {created_courses} courses / {created_lessons} lessons created.'))

    def _write_backup(self, source, by_chapter, path):
        data = {
            'course': {
                'id': source.id, 'title': source.title, 'slug': source.slug,
                'category': source.category, 'overview': source.overview,
                'tags': source.tags, 'instructor_id': source.instructor_id,
            },
            'chapters': [
                {'title': ct, 'lessons': [
                    {f: getattr(l, f) for f in LESSON_FIELDS} | {'id': l.id}
                    for l in lessons]}
                for ct, lessons in by_chapter.items()
            ],
        }
        with open(path, 'w', encoding='utf-8') as fh:
            json.dump(data, fh, ensure_ascii=False, indent=2)
