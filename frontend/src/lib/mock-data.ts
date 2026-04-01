/**
 * Mock data for demo mode (when accessToken === "demo-token").
 * Extracted from page-level hardcoded data so hooks can return it.
 */
import type {
  Course,
  Enrollment,
  StudentStats,
  SkillPoint,
  UserBadge,
  AdminDashboardData,
  AdminBillingOverview,
  PaymentRecord,
  RefundRequestRecord,
  PaginatedResponse,
  User,
} from "@/types";

const SAMPLE_VIDEO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

// ─── Courses ───────────────────────────────────────────────────────────────

export const mockCourses: Course[] = [
  {
    id: 1,
    title: "AI活用 Webデザイン基礎",
    slug: "ai-web-design-basics",
    category: "design",
    difficulty: "beginner",
    description:
      "AIツールを活用したWebデザインの基礎を学びます。Figma、Canva AI、画像生成AIの実践的な使い方を習得します。",
    overview:
      "このコースでは、最新のAIツールを活用しながらWebデザインの基本原則を学びます。",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    instructor: 2,
    instructor_name: "鈴木 先生",
    status: "published",
    duration_hours: 24.5,
    tags: ["AI", "Webデザイン", "Figma", "初心者向け"],
    lesson_count: 20,
    enrolled_count: 48,
    chapters: [
      {
        id: 1, title: "デザインの基本原則", order: 1, duration_label: "84分",
        lessons: [
          { id: 1, title: "デザインとは何か", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 1, lesson_type: "video" },
          { id: 2, title: "カラー理論入門", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 2, lesson_type: "video" },
          { id: 3, title: "タイポグラフィの基礎", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 3, lesson_type: "article" },
          { id: 4, title: "レイアウトの原則", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 4, lesson_type: "video" },
          { id: 5, title: "ビジュアルヒエラルキー", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 5, lesson_type: "video" },
          { id: 6, title: "実践:バナーデザイン", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 6, lesson_type: "exercise" },
          { id: 7, title: "デザインの心理学", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 7, lesson_type: "video" },
        ],
      },
      {
        id: 2, title: "AIツール実践", order: 2, duration_label: "84分",
        lessons: [
          { id: 8, title: "Figma入門", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 1, lesson_type: "video" },
          { id: 9, title: "Canva AIの活用", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 2, lesson_type: "video" },
          { id: 10, title: "画像生成AI入門", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 3, lesson_type: "video" },
          { id: 11, title: "AIでロゴデザイン", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 4, lesson_type: "exercise" },
          { id: 12, title: "プロトタイピング", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 5, lesson_type: "video" },
          { id: 13, title: "デザインシステム基礎", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 6, lesson_type: "video" },
          { id: 14, title: "AIカラーパレット生成", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 7, lesson_type: "video" },
        ],
      },
      {
        id: 3, title: "Webデザイン実践", order: 3, duration_label: "72分",
        lessons: [
          { id: 15, title: "レスポンシブデザイン", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 1, lesson_type: "video" },
          { id: 16, title: "UIコンポーネント設計", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 2, lesson_type: "video" },
          { id: 17, title: "アクセシビリティ", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 3, lesson_type: "article" },
          { id: 18, title: "パフォーマンス最適化", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 4, lesson_type: "video" },
          { id: 19, title: "ポートフォリオ制作", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 5, lesson_type: "exercise" },
          { id: 20, title: "デザインレビュー", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 6, lesson_type: "quiz" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Next.js 14 & React 実践",
    slug: "nextjs-react-practice",
    category: "dev",
    difficulty: "intermediate",
    description:
      "Next.js 14とReactを使ったモダンWebアプリケーション開発を実践的に学びます。",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    instructor: 2,
    instructor_name: "鈴木 先生",
    status: "published",
    duration_hours: 18,
    tags: ["Next.js", "React", "TypeScript", "フルスタック"],
    lesson_count: 12,
    enrolled_count: 32,
    chapters: [
      {
        id: 4, title: "React基礎復習", order: 1, duration_label: "48分",
        lessons: [
          { id: 21, title: "コンポーネント設計", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 1, lesson_type: "video" },
          { id: 22, title: "State管理", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 2, lesson_type: "video" },
          { id: 23, title: "Hooks活用", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 3, lesson_type: "video" },
          { id: 24, title: "カスタムHooks", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 4, lesson_type: "exercise" },
        ],
      },
      {
        id: 5, title: "Next.js App Router", order: 2, duration_label: "48分",
        lessons: [
          { id: 25, title: "プロジェクトセットアップ", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 1, lesson_type: "video" },
          { id: 26, title: "ルーティング", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 2, lesson_type: "video" },
          { id: 27, title: "Server Components", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 3, lesson_type: "video" },
          { id: 28, title: "データフェッチング", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 4, lesson_type: "video" },
        ],
      },
      {
        id: 6, title: "実践プロジェクト", order: 3, duration_label: "48分",
        lessons: [
          { id: 29, title: "API設計", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 1, lesson_type: "video" },
          { id: 30, title: "データベース連携", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 2, lesson_type: "video" },
          { id: 31, title: "認証実装", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 3, lesson_type: "video" },
          { id: 32, title: "デプロイメント", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 4, lesson_type: "video" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "UI/UXデザイン概論",
    slug: "uiux-design-intro",
    category: "design",
    difficulty: "beginner",
    description:
      "ユーザー体験設計の基礎からUIデザインの実践まで、体系的に学ぶ入門コースです。",
    thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800",
    instructor: 2,
    instructor_name: "鈴木 先生",
    status: "published",
    duration_hours: 12,
    tags: ["UI", "UX", "デザイン思考", "入門"],
    lesson_count: 8,
    enrolled_count: 24,
    chapters: [
      {
        id: 7, title: "UXデザイン入門", order: 1, duration_label: "48分",
        lessons: [
          { id: 33, title: "UXとは何か", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 1, lesson_type: "video" },
          { id: 34, title: "ユーザーリサーチ手法", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 2, lesson_type: "video" },
          { id: 35, title: "ペルソナ設計", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 3, lesson_type: "video" },
          { id: 36, title: "カスタマージャーニー", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 4, lesson_type: "video" },
        ],
      },
      {
        id: 8, title: "UIデザイン実践", order: 2, duration_label: "48分",
        lessons: [
          { id: 37, title: "ワイヤーフレーム", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 1, lesson_type: "video" },
          { id: 38, title: "モックアップ制作", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 2, lesson_type: "exercise" },
          { id: 39, title: "インタラクションデザイン", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 3, lesson_type: "video" },
          { id: 40, title: "ユーザビリティテスト", description: "", video_url: SAMPLE_VIDEO, duration_seconds: 720, duration_label: "12:00", order: 4, lesson_type: "quiz" },
        ],
      },
    ],
  },
];

// ─── Enrollments ───────────────────────────────────────────────────────────

export const mockEnrollments: Enrollment[] = [
  { id: 1, course: mockCourses[0], progress_percent: 75, created_at: "2026-01-15T00:00:00Z" },
  { id: 2, course: mockCourses[1], progress_percent: 30, created_at: "2026-02-01T00:00:00Z" },
  { id: 3, course: mockCourses[2], progress_percent: 0, created_at: "2026-03-01T00:00:00Z" },
];

// ─── Stats ─────────────────────────────────────────────────────────────────

export const mockStats: StudentStats = {
  total_watch_time_seconds: 172800,
  total_watch_time_hours: 48,
  completed_courses: 3,
  completed_lessons: 42,
  skill_points_total: 1250,
  weekly_completed_lessons: 8,
};

// ─── Skills ────────────────────────────────────────────────────────────────

export const mockSkills: SkillPoint[] = [
  { category: "HTML/CSS", points: 92, level: 5 },
  { category: "JavaScript", points: 78, level: 4 },
  { category: "React", points: 72, level: 4 },
  { category: "Design", points: 55, level: 3 },
  { category: "AI活用", points: 65, level: 3 },
  { category: "UX", points: 70, level: 4 },
];

// ─── Badges ────────────────────────────────────────────────────────────────

export const mockBadges: UserBadge[] = [
  { id: 1, badge: { id: 1, name: "初回ログイン", description: "初めてログインしました", icon: "login" }, earned_at: "2026-01-15T00:00:00Z" },
  { id: 2, badge: { id: 2, name: "10レッスン達成", description: "10レッスンを完了しました", icon: "lessons" }, earned_at: "2026-02-01T00:00:00Z" },
  { id: 3, badge: { id: 3, name: "AI活用マスター", description: "AI関連コースを修了しました", icon: "ai" }, earned_at: "2026-02-15T00:00:00Z" },
  { id: 4, badge: { id: 4, name: "課題提出10回", description: "課題を10回提出しました", icon: "assignment" }, earned_at: "2026-03-01T00:00:00Z" },
  { id: 5, badge: { id: 5, name: "コミュニティ投稿", description: "コミュニティに初投稿しました", icon: "community" }, earned_at: "2026-03-10T00:00:00Z" },
];

// ─── Admin Dashboard ───────────────────────────────────────────────────────

export const mockAdminDashboard: AdminDashboardData = {
  total_users: 156,
  monthly_revenue: 2400000,
  avg_completion_rate: 72,
  ai_usage_count: 3200,
  revenue_chart: [
    { month: "2025-04", revenue: 1500000 },
    { month: "2025-05", revenue: 1750000 },
    { month: "2025-06", revenue: 1380000 },
    { month: "2025-07", revenue: 2000000 },
    { month: "2025-08", revenue: 1880000 },
    { month: "2025-09", revenue: 2250000 },
    { month: "2025-10", revenue: 2130000 },
    { month: "2025-11", revenue: 1630000 },
    { month: "2025-12", revenue: 1950000 },
    { month: "2026-01", revenue: 2200000 },
    { month: "2026-02", revenue: 2300000 },
    { month: "2026-03", revenue: 2400000 },
  ],
  user_growth_chart: [
    { month: "2025-04", individual: 60, corporate: 20 },
    { month: "2025-05", individual: 72, corporate: 24 },
    { month: "2025-06", individual: 78, corporate: 26 },
    { month: "2025-07", individual: 84, corporate: 30 },
    { month: "2025-08", individual: 90, corporate: 32 },
    { month: "2025-09", individual: 96, corporate: 38 },
    { month: "2025-10", individual: 100, corporate: 40 },
    { month: "2025-11", individual: 104, corporate: 42 },
    { month: "2025-12", individual: 108, corporate: 48 },
    { month: "2026-01", individual: 112, corporate: 48 },
    { month: "2026-02", individual: 116, corporate: 56 },
    { month: "2026-03", individual: 120, corporate: 60 },
  ],
  recent_activities: [
    { name: "田中 翔", action: "が課題を提出しました", detail: "AI基礎コース - 第3章 演習問題", time: "2分前" },
    { name: "鈴木 美咲", action: "が新規登録しました", detail: "個人プラン - Freeプラン", time: "1時間前" },
    { name: "山田 太郎", action: "がProプランにアップグレード", detail: "月額プラン ¥4,980/月", time: "3時間前" },
    { name: "(株)テックイノベーション", action: "が法人登録しました", detail: "Businessプラン - 10アカウント", time: "5時間前" },
    { name: "高橋 優子", action: "がコースを完了しました", detail: "プロンプトエンジニアリング実践 - 修了証発行", time: "昨日" },
  ],
};

// ─── Admin Billing ─────────────────────────────────────────────────────────

export const mockBillingOverview: AdminBillingOverview = {
  monthly_revenue: 2400000,
  mrr: 2100000,
  churn_rate: 3.2,
  arpu: 22500,
  monthly_chart: [
    { month: "2025-10", revenue: 1800000 },
    { month: "2025-11", revenue: 1950000 },
    { month: "2025-12", revenue: 2100000 },
    { month: "2026-01", revenue: 2200000 },
    { month: "2026-02", revenue: 2300000 },
    { month: "2026-03", revenue: 2400000 },
  ],
  plan_breakdown: [
    { plan: "pro", count: 48 },
    { plan: "business", count: 32 },
    { plan: "free", count: 27 },
  ],
};

export const mockPayments: PaginatedResponse<PaymentRecord> = {
  count: 8,
  next: null,
  previous: null,
  results: [
    { id: 1, user: 4, user_name: "佐藤 学", user_email: "sato@example.com", amount: 2980, plan: "pro", method: "credit_card", status: "success", created_at: "2026-03-01T14:30:00Z" },
    { id: 2, user: 4, user_name: "佐藤 学", user_email: "sato@example.com", amount: 2980, plan: "pro", method: "credit_card", status: "success", created_at: "2026-01-29T10:15:00Z" },
    { id: 3, user: 4, user_name: "佐藤 学", user_email: "sato@example.com", amount: 2980, plan: "pro", method: "credit_card", status: "success", created_at: "2025-12-30T16:00:00Z" },
    { id: 4, user: 3, user_name: "山田 花子", user_email: "yamada@example.com", amount: 9800, plan: "business", method: "credit_card", status: "success", created_at: "2026-03-01T11:30:00Z" },
    { id: 5, user: 3, user_name: "山田 花子", user_email: "yamada@example.com", amount: 9800, plan: "business", method: "credit_card", status: "success", created_at: "2026-01-29T15:00:00Z" },
    { id: 6, user: 2, user_name: "鈴木 先生", user_email: "suzuki@example.com", amount: 2980, plan: "pro", method: "credit_card", status: "success", created_at: "2026-02-13T09:00:00Z" },
    { id: 7, user: 5, user_name: "田中 美咲", user_email: "tanaka@example.com", amount: 2980, plan: "pro", method: "credit_card", status: "failed", created_at: "2026-03-16T14:00:00Z" },
    { id: 8, user: 1, user_name: "管理 太郎", user_email: "admin@example.com", amount: 2980, plan: "pro", method: "credit_card", status: "refunded", created_at: "2026-01-14T10:00:00Z" },
  ],
};

export const mockRefunds: PaginatedResponse<RefundRequestRecord> = {
  count: 3,
  next: null,
  previous: null,
  results: [
    { id: 1, payment: mockPayments.results[7], reason: "サービスに満足できませんでした。", status: "pending", created_at: "2026-03-10T00:00:00Z" },
    { id: 2, payment: mockPayments.results[6], reason: "決済エラーが発生しました。", status: "pending", created_at: "2026-03-16T00:00:00Z" },
    { id: 3, payment: mockPayments.results[4], reason: "プラン変更に伴う返金希望です。", status: "pending", created_at: "2026-03-05T00:00:00Z" },
  ],
};

// ─── Admin Users ───────────────────────────────────────────────────────────

export const mockAdminUsers: PaginatedResponse<User> = {
  count: 6,
  next: null,
  previous: null,
  results: [
    { id: 1, email: "admin@example.com", username: "admin", first_name: "太郎", last_name: "管理", role: "admin", plan: "pro", avatar: null, bio: "", is_active: true, organization_name: "", date_joined: "2025-01-01T00:00:00Z", last_login: "2026-03-12T10:00:00Z" },
    { id: 2, email: "suzuki@example.com", username: "instructor_suzuki", first_name: "先生", last_name: "鈴木", role: "instructor", plan: "pro", avatar: null, bio: "", is_active: true, organization_name: "", date_joined: "2025-02-01T00:00:00Z", last_login: "2026-03-11T09:00:00Z" },
    { id: 3, email: "yamada@example.com", username: "corp_admin_yamada", first_name: "花子", last_name: "山田", role: "corp_admin", plan: "business", avatar: null, bio: "", is_active: true, organization_name: "(株)テックイノベーション", date_joined: "2025-04-01T00:00:00Z", last_login: "2026-03-11T14:00:00Z" },
    { id: 4, email: "sato@example.com", username: "student_sato", first_name: "学", last_name: "佐藤", role: "student", plan: "pro", avatar: null, bio: "", is_active: true, organization_name: "", date_joined: "2025-08-15T00:00:00Z", last_login: "2026-03-12T08:00:00Z" },
    { id: 5, email: "tanaka@example.com", username: "student_tanaka", first_name: "美咲", last_name: "田中", role: "student", plan: "free", avatar: null, bio: "", is_active: true, organization_name: "", date_joined: "2026-03-01T00:00:00Z", last_login: "2026-03-12T12:00:00Z" },
    { id: 6, email: "nakamura@example.com", username: "student_nakamura", first_name: "健太", last_name: "中村", role: "student", plan: "free", avatar: null, bio: "", is_active: false, organization_name: "", date_joined: "2025-11-20T00:00:00Z", last_login: "2026-01-15T10:00:00Z" },
  ],
};
