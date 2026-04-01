"""Seed data management command. Idempotent via get_or_create."""
from datetime import timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone

from accounts.models import Organization
from courses.models import Course, Chapter, Lesson
from enrollments.models import Enrollment, LessonProgress, SkillPoint, Badge, UserBadge
from billing.models import Subscription, Payment, RefundRequest

User = get_user_model()

SAMPLE_VIDEO = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
PASSWORD = 'testpass123'


class Command(BaseCommand):
    help = 'Seed database with test data for all roles.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')
        org = self._create_org()
        users = self._create_users(org)
        courses = self._create_courses(users['instructor_suzuki'])
        self._create_enrollments(users, courses)
        self._create_skill_points(users['student_sato'])
        self._create_badges(users['student_sato'])
        self._create_billing(users)
        self.stdout.write(self.style.SUCCESS('Seed data created successfully.'))

    def _create_org(self):
        org, _ = Organization.objects.get_or_create(
            name='(株)テックイノベーション',
            defaults={'plan': 'business', 'max_seats': 50},
        )
        return org

    def _create_users(self, org):
        user_defs = [
            {'username': 'admin', 'email': 'admin@example.com',
             'first_name': '太郎', 'last_name': '管理', 'role': 'admin', 'plan': 'pro'},
            {'username': 'instructor_suzuki', 'email': 'suzuki@example.com',
             'first_name': '先生', 'last_name': '鈴木', 'role': 'instructor', 'plan': 'pro'},
            {'username': 'corp_admin_yamada', 'email': 'yamada@example.com',
             'first_name': '花子', 'last_name': '山田', 'role': 'corp_admin', 'plan': 'business'},
            {'username': 'student_sato', 'email': 'sato@example.com',
             'first_name': '学', 'last_name': '佐藤', 'role': 'student', 'plan': 'pro'},
            {'username': 'student_tanaka', 'email': 'tanaka@example.com',
             'first_name': '美咲', 'last_name': '田中', 'role': 'student', 'plan': 'free'},
            {'username': 'student_nakamura', 'email': 'nakamura@example.com',
             'first_name': '健太', 'last_name': '中村', 'role': 'student', 'plan': 'free'},
        ]
        users = {}
        for d in user_defs:
            user, created = User.objects.get_or_create(
                username=d['username'],
                defaults={
                    'email': d['email'],
                    'first_name': d['first_name'],
                    'last_name': d['last_name'],
                    'role': d['role'],
                    'plan': d['plan'],
                },
            )
            if created:
                user.set_password(PASSWORD)
                user.save()
            if d['username'] == 'corp_admin_yamada':
                user.organization = org
                user.save()
            users[d['username']] = user
        return users

    def _create_courses(self, instructor):
        courses = {}

        # Course 1: AI活用 Webデザイン基礎
        c1, _ = Course.objects.get_or_create(
            slug='ai-web-design-basics',
            defaults={
                'title': 'AI活用 Webデザイン基礎',
                'category': 'design',
                'difficulty': 'beginner',
                'description': 'AIツールを活用したWebデザインの基礎を学びます。Figma、Canva AI、画像生成AIの実践的な使い方を習得します。',
                'overview': 'このコースでは、最新のAIツールを活用しながらWebデザインの基本原則を学びます。',
                'instructor': instructor,
                'status': 'published',
                'duration_hours': Decimal('24.5'),
                'tags': ['AI', 'Webデザイン', 'Figma', '初心者向け'],
                'thumbnail': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
            },
        )
        self._create_chapters_lessons(c1, [
            ('デザインの基本原則', [
                'デザインとは何か', 'カラー理論入門', 'タイポグラフィの基礎',
                'レイアウトの原則', 'ビジュアルヒエラルキー', '実践:バナーデザイン',
                'デザインの心理学',
            ]),
            ('AIツール実践', [
                'Figma入門', 'Canva AIの活用', '画像生成AI入門',
                'AIでロゴデザイン', 'プロトタイピング', 'デザインシステム基礎',
                'AIカラーパレット生成',
            ]),
            ('Webデザイン実践', [
                'レスポンシブデザイン', 'UIコンポーネント設計', 'アクセシビリティ',
                'パフォーマンス最適化', 'ポートフォリオ制作', 'デザインレビュー',
            ]),
        ])
        courses['ai_web_design'] = c1

        # Course 2: Next.js 14 & React 実践
        c2, _ = Course.objects.get_or_create(
            slug='nextjs-react-practice',
            defaults={
                'title': 'Next.js 14 & React 実践',
                'category': 'dev',
                'difficulty': 'intermediate',
                'description': 'Next.js 14とReactを使ったモダンWebアプリケーション開発を実践的に学びます。',
                'overview': 'App Router、Server Components、Server Actionsなど最新機能を網羅。',
                'instructor': instructor,
                'status': 'published',
                'duration_hours': Decimal('18.0'),
                'tags': ['Next.js', 'React', 'TypeScript', 'フルスタック'],
                'thumbnail': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
            },
        )
        self._create_chapters_lessons(c2, [
            ('React基礎復習', [
                'コンポーネント設計', 'State管理', 'Hooks活用',
                'カスタムHooks',
            ]),
            ('Next.js App Router', [
                'プロジェクトセットアップ', 'ルーティング', 'Server Components',
                'データフェッチング',
            ]),
            ('実践プロジェクト', [
                'API設計', 'データベース連携', '認証実装',
                'デプロイメント',
            ]),
        ])
        courses['nextjs_react'] = c2

        # Course 3: UI/UXデザイン概論
        c3, _ = Course.objects.get_or_create(
            slug='uiux-design-intro',
            defaults={
                'title': 'UI/UXデザイン概論',
                'category': 'design',
                'difficulty': 'beginner',
                'description': 'ユーザー体験設計の基礎からUIデザインの実践まで、体系的に学ぶ入門コースです。',
                'overview': 'UXリサーチ、ペルソナ設計、ワイヤーフレーム、プロトタイプの基礎を学びます。',
                'instructor': instructor,
                'status': 'published',
                'duration_hours': Decimal('12.0'),
                'tags': ['UI', 'UX', 'デザイン思考', '入門'],
                'thumbnail': 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800',
            },
        )
        self._create_chapters_lessons(c3, [
            ('UXデザイン入門', [
                'UXとは何か', 'ユーザーリサーチ手法', 'ペルソナ設計',
                'カスタマージャーニー',
            ]),
            ('UIデザイン実践', [
                'ワイヤーフレーム', 'モックアップ制作', 'インタラクションデザイン',
                'ユーザビリティテスト',
            ]),
        ])
        courses['uiux_design'] = c3

        return courses

    def _create_chapters_lessons(self, course, chapter_data):
        for ch_order, (ch_title, lesson_titles) in enumerate(chapter_data, 1):
            chapter, _ = Chapter.objects.get_or_create(
                course=course,
                order=ch_order,
                defaults={
                    'title': ch_title,
                    'duration_label': f'{len(lesson_titles) * 12}分',
                },
            )
            for ls_order, ls_title in enumerate(lesson_titles, 1):
                Lesson.objects.get_or_create(
                    chapter=chapter,
                    order=ls_order,
                    defaults={
                        'title': ls_title,
                        'description': f'{ls_title}について学びます。',
                        'video_url': SAMPLE_VIDEO,
                        'duration_seconds': 720,
                        'duration_label': '12:00',
                        'lesson_type': 'video',
                    },
                )

    def _create_enrollments(self, users, courses):
        sato = users['student_sato']
        tanaka = users['student_tanaka']

        # student_sato: 3 enrollments
        e1, _ = Enrollment.objects.get_or_create(
            user=sato, course=courses['ai_web_design'],
            defaults={'progress_percent': Decimal('75.00')},
        )
        e2, _ = Enrollment.objects.get_or_create(
            user=sato, course=courses['nextjs_react'],
            defaults={'progress_percent': Decimal('30.00')},
        )
        e3, _ = Enrollment.objects.get_or_create(
            user=sato, course=courses['uiux_design'],
            defaults={'progress_percent': Decimal('0.00')},
        )

        # Mark lessons complete for e1 (15/20)
        lessons_c1 = list(
            Lesson.objects.filter(chapter__course=courses['ai_web_design']).order_by('chapter__order', 'order')
        )
        for lesson in lessons_c1[:15]:
            LessonProgress.objects.get_or_create(
                enrollment=e1, lesson=lesson,
                defaults={'is_completed': True, 'watch_time_seconds': 720},
            )

        # Mark lessons complete for e2 (4/12)
        lessons_c2 = list(
            Lesson.objects.filter(chapter__course=courses['nextjs_react']).order_by('chapter__order', 'order')
        )
        for lesson in lessons_c2[:4]:
            LessonProgress.objects.get_or_create(
                enrollment=e2, lesson=lesson,
                defaults={'is_completed': True, 'watch_time_seconds': 720},
            )

        # student_tanaka: 1 enrollment
        Enrollment.objects.get_or_create(
            user=tanaka, course=courses['ai_web_design'],
            defaults={'progress_percent': Decimal('10.00')},
        )

    def _create_skill_points(self, user):
        skills = [
            ('HTML/CSS', 92, 5),
            ('JavaScript', 78, 4),
            ('React', 72, 4),
            ('Design', 55, 3),
            ('AI活用', 65, 3),
            ('UX', 70, 4),
        ]
        for category, points, level in skills:
            SkillPoint.objects.get_or_create(
                user=user, category=category,
                defaults={'points': points, 'level': level},
            )

    def _create_badges(self, user):
        badge_defs = [
            ('初回ログイン', '初めてログインしました', 'login'),
            ('10レッスン達成', '10レッスンを完了しました', 'lessons'),
            ('AI活用マスター', 'AI関連コースを修了しました', 'ai'),
            ('課題提出10回', '課題を10回提出しました', 'assignment'),
            ('コミュニティ投稿', 'コミュニティに初投稿しました', 'community'),
            ('30日連続学習', '30日間連続で学習しました', 'streak'),
        ]
        earned_names = {'初回ログイン', '10レッスン達成', 'AI活用マスター', '課題提出10回', 'コミュニティ投稿'}

        for name, desc, icon in badge_defs:
            badge, _ = Badge.objects.get_or_create(
                name=name, defaults={'description': desc, 'icon': icon},
            )
            if name in earned_names:
                UserBadge.objects.get_or_create(user=user, badge=badge)

    def _create_billing(self, users):
        now = timezone.now()

        # Subscriptions for pro/business users
        for username in ['admin', 'instructor_suzuki', 'student_sato']:
            Subscription.objects.get_or_create(
                user=users[username],
                defaults={
                    'plan': 'pro',
                    'status': 'active',
                    'current_period_end': now + timedelta(days=30),
                },
            )
        Subscription.objects.get_or_create(
            user=users['corp_admin_yamada'],
            defaults={
                'plan': 'business',
                'status': 'active',
                'current_period_end': now + timedelta(days=30),
            },
        )

        # Payment history (8 records) - skip if already seeded
        if Payment.objects.exists():
            self.stdout.write('  Payments already exist, skipping...')
            return

        payment_data = [
            (users['student_sato'], 2980, 'pro', 'credit_card', 'success', 30),
            (users['student_sato'], 2980, 'pro', 'credit_card', 'success', 60),
            (users['student_sato'], 2980, 'pro', 'credit_card', 'success', 90),
            (users['corp_admin_yamada'], 9800, 'business', 'credit_card', 'success', 30),
            (users['corp_admin_yamada'], 9800, 'business', 'credit_card', 'success', 60),
            (users['instructor_suzuki'], 2980, 'pro', 'credit_card', 'success', 45),
            (users['student_tanaka'], 2980, 'pro', 'credit_card', 'failed', 15),
            (users['admin'], 2980, 'pro', 'credit_card', 'refunded', 75),
        ]
        payments = []
        for user, amount, plan, method, pay_status, days_ago in payment_data:
            p = Payment.objects.create(
                user=user,
                amount=Decimal(str(amount)),
                plan=plan,
                method=method,
                status=pay_status,
            )
            # Override created_at
            Payment.objects.filter(pk=p.pk).update(
                created_at=now - timedelta(days=days_ago)
            )
            payments.append(p)

        # Refund requests (3 pending)
        RefundRequest.objects.create(
            payment=payments[7], reason='サービスに満足できませんでした。', status='pending',
        )
        RefundRequest.objects.create(
            payment=payments[6], reason='決済エラーが発生しました。', status='pending',
        )
        RefundRequest.objects.create(
            payment=payments[4], reason='プラン変更に伴う返金希望です。', status='pending',
        )
