"""Transcribe lesson videos using faster-whisper (local).

Usage:
  python manage.py transcribe_lessons              # all lessons with video_url & empty transcript
  python manage.py transcribe_lessons --lesson-id 5  # specific lesson
  python manage.py transcribe_lessons --course-id 1  # all lessons in a course
"""
import os
import re
import subprocess
import tempfile

from django.core.management.base import BaseCommand

from courses.models import Lesson


class Command(BaseCommand):
    help = 'Transcribe lesson videos using faster-whisper.'

    def add_arguments(self, parser):
        parser.add_argument('--lesson-id', type=int, help='Transcribe a specific lesson')
        parser.add_argument('--course-id', type=int, help='Transcribe all lessons in a course')
        parser.add_argument('--model', type=str, default='large-v3', help='Whisper model (default: large-v3)')
        parser.add_argument('--force', action='store_true', help='Overwrite existing transcripts')

    def handle(self, *args, **options):
        qs = Lesson.objects.filter(video_url__gt='')

        if options['lesson_id']:
            qs = qs.filter(pk=options['lesson_id'])
        elif options['course_id']:
            qs = qs.filter(chapter__course_id=options['course_id'])

        if not options['force']:
            qs = qs.filter(transcript='')

        lessons = list(qs.select_related('chapter__course').order_by('chapter__course_id', 'chapter__order', 'order'))
        self.stdout.write(f'{len(lessons)} lessons to transcribe')

        if not lessons:
            return

        # Load whisper model once
        from faster_whisper import WhisperModel
        self.stdout.write(f'Loading whisper model: {options["model"]}...')
        model = WhisperModel(options['model'], device='auto', compute_type='auto')
        self.stdout.write(self.style.SUCCESS('Model loaded'))

        for i, lesson in enumerate(lessons, 1):
            self.stdout.write(f'\n[{i}/{len(lessons)}] {lesson.chapter.course.title} > {lesson.title}')
            self.stdout.write(f'  URL: {lesson.video_url}')

            try:
                audio_path = self._download_and_extract_audio(lesson.video_url)
                if not audio_path:
                    self.stdout.write(self.style.WARNING('  SKIP: audio extraction failed'))
                    continue

                transcript = self._transcribe(model, audio_path)
                lesson.transcript = transcript
                lesson.save(update_fields=['transcript'])
                self.stdout.write(self.style.SUCCESS(f'  OK: {len(transcript)} chars'))

                # Cleanup
                os.unlink(audio_path)

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  ERROR: {e}'))

        self.stdout.write(self.style.SUCCESS('\nDone!'))

    def _download_and_extract_audio(self, video_url):
        """Download video and extract audio as mp3."""
        tmpdir = tempfile.mkdtemp()
        audio_path = os.path.join(tmpdir, 'audio.mp3')

        # Google Drive preview URL → direct download URL
        if 'drive.google.com' in video_url:
            file_id = self._extract_gdrive_id(video_url)
            if not file_id:
                return None
            # Use gdown for Google Drive
            import gdown
            video_path = os.path.join(tmpdir, 'video.mp4')
            self.stdout.write(f'  Downloading from Google Drive: {file_id}...')
            gdown.download(id=file_id, output=video_path, quiet=True)
            if not os.path.exists(video_path) or os.path.getsize(video_path) < 1000:
                return None
        elif 'supabase.co' in video_url:
            # Direct URL download
            video_path = os.path.join(tmpdir, 'video.mp4')
            self.stdout.write(f'  Downloading from Supabase...')
            subprocess.run(['curl', '-sL', '-o', video_path, video_url], check=True)
        else:
            video_path = video_url

        # Extract audio with ffmpeg
        self.stdout.write('  Extracting audio...')
        result = subprocess.run(
            ['ffmpeg', '-i', video_path, '-vn', '-acodec', 'libmp3lame',
             '-ar', '16000', '-ac', '1', '-q:a', '6', audio_path, '-y'],
            capture_output=True, text=True,
        )
        if result.returncode != 0:
            self.stdout.write(self.style.WARNING(f'  ffmpeg error: {result.stderr[:200]}'))
            return None

        # Cleanup video
        if os.path.exists(video_path) and 'drive.google.com' in video_url:
            os.unlink(video_path)

        return audio_path

    def _extract_gdrive_id(self, url):
        """Extract Google Drive file ID from URL."""
        m = re.search(r'/d/([a-zA-Z0-9_-]+)', url)
        return m.group(1) if m else None

    def _transcribe(self, model, audio_path):
        """Transcribe audio file using faster-whisper."""
        self.stdout.write('  Transcribing...')
        segments, info = model.transcribe(
            audio_path,
            language='ja',
            beam_size=5,
            vad_filter=True,
        )

        texts = []
        for segment in segments:
            texts.append(segment.text.strip())

        transcript = '\n'.join(texts)
        return transcript
