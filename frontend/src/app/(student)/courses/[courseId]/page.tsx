"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Signal,
  Clock,
  BookOpen,
  Users,
  Star,
  FileText,
  List,
  ChevronDown,
  Check,
  Play,
  Lock,
  MessageCircle,
  User,
  Calendar,
  Globe,
  Rocket,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LessonStatus = "completed" | "in-progress" | "locked";

interface Lesson {
  title: string;
  duration: string;
  status: LessonStatus;
}

interface Chapter {
  number: number;
  title: string;
  lessonCount: number;
  duration: string;
  lessons: Lesson[];
  defaultOpen?: boolean;
}

interface Review {
  initials: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  gradient: string;
}

interface CourseInfo {
  label: string;
  value: string;
  icon: "user" | "calendar" | "users" | "globe";
}

interface CourseData {
  title: string;
  category: string;
  level: string;
  description: string;
  totalDuration: string;
  totalLessons: number;
  studentsCount: string;
  rating: number;
  reviewCount: number;
  progress: number;
  completedLessons: number;
  overview: string[];
  chapters: Chapter[];
  reviews: Review[];
  info: CourseInfo[];
  tags: string[];
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const courseData: CourseData = {
  title: "AI活用 Webデザイン基礎",
  category: "Design",
  level: "Beginner",
  description:
    "AIツールを活用しながら、Webデザインの基礎からFigmaでの実践的なデザイン制作までを体系的に学べるコースです。",
  totalDuration: "12時間",
  totalLessons: 20,
  studentsCount: "1,248人が受講中",
  rating: 4.8,
  reviewCount: 156,
  progress: 75,
  completedLessons: 15,
  overview: [
    "本コースでは、AIを活用したWebデザインの基礎を包括的に学びます。デザインの原則（カラー理論、タイポグラフィ、レイアウト）から始まり、FigmaやAdobe XDなどのツールを使った実践的なデザインワークフローまでをカバーします。",
    "特に、ChatGPTやMidjourneyなどのAIツールをデザインプロセスに組み込む方法に重点を置いています。アイデア出し、カラーパレット生成、画像素材の作成など、AIがクリエイティブワークをどのように加速させるかを実践的に学べます。",
    "コース修了後には、レスポンシブなWebサイトのデザインをゼロから作成できるスキルが身につきます。ポートフォリオに掲載できる作品を制作するプロジェクト課題も含まれています。",
  ],
  chapters: [
    {
      number: 1,
      title: "デザインの基礎原則",
      lessonCount: 6,
      duration: "3時間",
      defaultOpen: true,
      lessons: [
        { title: "デザイン思考とは何か", duration: "15:00", status: "completed" },
        { title: "カラー理論の基礎", duration: "22:00", status: "completed" },
        { title: "タイポグラフィの選び方", duration: "18:00", status: "completed" },
        { title: "レイアウトとグリッドシステム", duration: "25:00", status: "completed" },
        { title: "ビジュアルヒエラルキー", duration: "20:00", status: "completed" },
        { title: "デザイン原則の実践演習", duration: "30:00", status: "completed" },
      ],
    },
    {
      number: 2,
      title: "Figmaを使った実践デザイン",
      lessonCount: 5,
      duration: "4時間",
      lessons: [
        { title: "Figmaの基本操作", duration: "30:00", status: "completed" },
        { title: "コンポーネントとスタイル設計", duration: "35:00", status: "completed" },
        { title: "Auto Layoutの活用", duration: "40:00", status: "completed" },
        { title: "プロトタイプの作成", duration: "学習中", status: "in-progress" },
        { title: "レスポンシブデザインの実装", duration: "45:00", status: "locked" },
      ],
    },
    {
      number: 3,
      title: "AIツールとデザインワークフロー",
      lessonCount: 4,
      duration: "5時間",
      lessons: [
        { title: "AIでカラーパレットを生成する", duration: "35:00", status: "locked" },
        { title: "Midjourneyで素材画像を作成", duration: "40:00", status: "locked" },
        { title: "AIを使ったUXライティング", duration: "30:00", status: "locked" },
        {
          title: "最終プロジェクト：ポートフォリオサイト制作",
          duration: "90:00",
          status: "locked",
        },
      ],
    },
  ],
  reviews: [
    {
      initials: "KT",
      name: "木村 拓也",
      date: "2週間前",
      rating: 5,
      comment:
        "初心者でも分かりやすい内容で、AIツールの活用方法が実践的に学べました。特にFigmaのAuto Layout解説が秀逸です。実際の制作に活かせるスキルが身につきました。",
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      initials: "SM",
      name: "佐藤 美咲",
      date: "1ヶ月前",
      rating: 4,
      comment:
        "デザイン未経験からのスタートでしたが、ステップバイステップで理解できました。Midjourneyを使った素材作成のパートが特に面白かったです。もう少しUX設計の深掘りがあれば完璧でした。",
      gradient: "from-fuchsia-400 to-purple-500",
    },
    {
      initials: "YH",
      name: "山田 浩司",
      date: "1ヶ月前",
      rating: 5,
      comment:
        "エンジニアとしてデザインの基礎を学びたくて受講しました。理論と実践のバランスが良く、最終プロジェクトで実際にポートフォリオサイトを完成させることができました。",
      gradient: "from-emerald-400 to-teal-500",
    },
  ],
  info: [
    { label: "講師", value: "鈴木 健太", icon: "user" },
    { label: "最終更新日", value: "2026年2月15日", icon: "calendar" },
    { label: "受講者数", value: "1,248人", icon: "users" },
    { label: "言語", value: "日本語", icon: "globe" },
  ],
  tags: ["#Webデザイン", "#AI", "#Figma"],
};

// ---------------------------------------------------------------------------
// Helper Components
// ---------------------------------------------------------------------------

function InfoIcon({ icon }: { icon: CourseInfo["icon"] }) {
  switch (icon) {
    case "user":
      return <User className="w-4 h-4" />;
    case "calendar":
      return <Calendar className="w-4 h-4" />;
    case "users":
      return <Users className="w-4 h-4" />;
    case "globe":
      return <Globe className="w-4 h-4" />;
  }
}

function LessonIcon({ status }: { status: LessonStatus }) {
  switch (status) {
    case "completed":
      return (
        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
          <Check className="w-3 h-3" />
        </div>
      );
    case "in-progress":
      return (
        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
          <Play className="w-3 h-3" />
        </div>
      );
    case "locked":
      return (
        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
          <Lock className="w-3 h-3" />
        </div>
      );
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400 fill-current" : "text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);

  // In production, use courseId to fetch real data
  const course = courseData;

  return (
    <>
      {/* Course Hero Banner */}
      <div
        className="relative overflow-hidden rounded-2xl mb-8"
        style={{
          background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
        <div className="relative z-10 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/courses"
              className="flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              コース一覧に戻る
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold border border-white/30">
              {course.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold border border-white/30 flex items-center gap-1">
              <Signal className="w-3 h-3" /> {course.level}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {course.title}
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mb-6">
            {course.description}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {course.totalDuration}
            </span>
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {course.totalLessons}レッスン
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> {course.studentsCount}
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current text-yellow-300" />{" "}
              {course.rating} ({course.reviewCount}件)
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Main Content */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* コース概要 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500" />
              コース概要
            </h3>
            <div className="text-sm text-slate-600 leading-relaxed space-y-4">
              {course.overview.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* カリキュラム */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <List className="w-5 h-5 text-cyan-500" />
              カリキュラム
            </h3>
            <div className="space-y-4">
              {course.chapters.map((chapter) => (
                <details
                  key={chapter.number}
                  className="group border border-slate-200 rounded-xl overflow-hidden"
                  open={chapter.defaultOpen}
                >
                  <summary className="flex items-center justify-between px-5 py-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors select-none">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {chapter.number}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {chapter.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {chapter.lessonCount}レッスン / {chapter.duration}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="divide-y divide-slate-100">
                    {chapter.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lessonIndex}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <LessonIcon status={lesson.status} />
                        <span
                          className={`text-sm flex-1 ${
                            lesson.status === "locked"
                              ? "text-slate-400"
                              : lesson.status === "in-progress"
                                ? "text-slate-700 font-medium"
                                : "text-slate-700"
                          }`}
                        >
                          {lesson.title}
                        </span>
                        <span
                          className={`text-xs ${
                            lesson.status === "in-progress"
                              ? "text-cyan-600 font-medium"
                              : "text-slate-400"
                          }`}
                        >
                          {lesson.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* レビュー */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-cyan-500" />
              レビュー
              <span className="text-sm font-normal text-slate-400 ml-1">
                ({course.reviewCount}件)
              </span>
            </h3>
            <div className="space-y-5">
              {course.reviews.map((review, i) => (
                <div
                  key={i}
                  className="border border-slate-100 rounded-xl p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-tr ${review.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}
                    >
                      {review.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 text-sm">
                          {review.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {review.date}
                        </span>
                      </div>
                      <div className="mb-3">
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Progress Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-800 text-sm">学習進捗</h4>
              <span className="text-sm font-bold text-cyan-600">
                {course.progress}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mb-5">
              {course.completedLessons} / {course.totalLessons} レッスン完了
            </p>
            <Link
              href="/learning"
              className="block w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-center hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-sm"
            >
              <span className="flex items-center justify-center gap-2">
                <Play className="w-4 h-4 fill-current" />
                学習を続ける
              </span>
            </Link>
          </div>

          {/* Course Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-4">
              コース情報
            </h4>
            <div className="space-y-4">
              {course.info.map((item, i) => (
                <div key={i}>
                  {i > 0 && <div className="border-t border-slate-100 mb-4" />}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 flex items-center gap-2">
                      <InfoIcon icon={item.icon} /> {item.label}
                    </span>
                    <span className="text-sm font-medium text-slate-800">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-4">タグ</h4>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-cyan-50 text-cyan-600 px-3 py-1.5 rounded-full border border-cyan-100 hover:bg-cyan-100 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-center hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-sm flex items-center justify-center gap-2">
              <Rocket className="w-4 h-4" />
              受講を開始する
            </button>
            <p className="text-xs text-slate-400 text-center mt-3">
              Pro Planで全コース受講可能
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
