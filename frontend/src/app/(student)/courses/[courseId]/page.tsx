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
  HelpCircle,
  Code,
  Target,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCourse } from "@/lib/queries/use-courses";
import { useMyEnrollments } from "@/lib/queries/use-enrollments";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LessonStatus = "completed" | "in-progress" | "locked";
type LessonType = "video" | "article" | "quiz" | "exercise";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  status: LessonStatus;
  type: LessonType;
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

interface StudyMilestone {
  chapter: number;
  title: string;
  targetDate: string;
  status: "completed" | "current" | "upcoming";
}

interface StudyPlan {
  weeklyGoalHours: number;
  currentWeekHours: number;
  estimatedCompletionDate: string;
  milestones: StudyMilestone[];
}

// ---------------------------------------------------------------------------
// Static mock data (reviews and study plan have no API endpoints)
// ---------------------------------------------------------------------------

const staticReviews: Review[] = [
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
];

const staticStudyPlan: StudyPlan = {
  weeklyGoalHours: 5,
  currentWeekHours: 3.5,
  estimatedCompletionDate: "2026年4月15日",
  milestones: [
    { chapter: 1, title: "デザインの基礎原則", targetDate: "2026年2月28日", status: "completed" },
    { chapter: 2, title: "Figmaを使った実践デザイン", targetDate: "2026年3月20日", status: "current" },
    { chapter: 3, title: "AIツールとデザインワークフロー", targetDate: "2026年4月15日", status: "upcoming" },
  ],
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

function getChapterProgress(chapter: Chapter) {
  const completed = chapter.lessons.filter((l) => l.status === "completed").length;
  const total = chapter.lessons.length;
  return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

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

function LessonStatusIcon({ status }: { status: LessonStatus }) {
  switch (status) {
    case "completed":
      return (
        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <Check className="w-3 h-3" />
        </div>
      );
    case "in-progress":
      return (
        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-500 flex items-center justify-center shrink-0 ring-2 ring-cyan-200 animate-pulse">
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

function LessonTypeIcon({ type }: { type: LessonType }) {
  switch (type) {
    case "video":
      return <Play className="w-3 h-3 text-slate-400" />;
    case "article":
      return <FileText className="w-3 h-3 text-slate-400" />;
    case "quiz":
      return <HelpCircle className="w-3 h-3 text-slate-400" />;
    case "exercise":
      return <Code className="w-3 h-3 text-slate-400" />;
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

function CircularProgress({ percent, size = 100, strokeWidth = 8 }: { percent: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700"
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Tab Content Components
// ---------------------------------------------------------------------------

function CurriculumTab({ chapters }: { chapters: Chapter[] }) {
  return (
    <div className="space-y-4">
      {chapters.map((chapter) => {
        const progress = getChapterProgress(chapter);
        const isComplete = progress.percent === 100;

        return (
          <details
            key={chapter.number}
            className="group border border-slate-200 rounded-xl overflow-hidden"
            open={chapter.defaultOpen}
          >
            <summary className="flex items-center justify-between px-5 py-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors select-none">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0">
                  {chapter.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 text-sm truncate">
                      {chapter.title}
                    </h4>
                    {isComplete && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        完了
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-slate-500">
                      {chapter.lessonCount}レッスン / {chapter.duration}
                    </p>
                    <span className="text-xs text-slate-400">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                  {/* Chapter mini progress bar */}
                  <div className="h-1 w-full max-w-[200px] bg-slate-200 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete
                          ? "bg-emerald-500"
                          : "bg-gradient-to-r from-cyan-400 to-blue-500"
                      }`}
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180 shrink-0 ml-2" />
            </summary>
            <div className="divide-y divide-slate-100">
              {chapter.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-3 px-5 py-3 transition-colors cursor-pointer ${
                    lesson.status === "in-progress"
                      ? "bg-cyan-50/50 border-l-2 border-l-cyan-500"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <LessonStatusIcon status={lesson.status} />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <LessonTypeIcon type={lesson.type} />
                  </div>
                  <span
                    className={`text-sm flex-1 ${
                      lesson.status === "locked"
                        ? "text-slate-400"
                        : lesson.status === "in-progress"
                          ? "text-slate-800 font-semibold"
                          : "text-slate-700"
                    }`}
                  >
                    {lesson.title}
                  </span>
                  {lesson.status === "in-progress" && (
                    <span className="text-[10px] font-bold text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded-full">
                      学習中
                    </span>
                  )}
                  <span
                    className={`text-xs shrink-0 ${
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
        );
      })}
    </div>
  );
}

function StudyPlanTab({ studyPlan }: { studyPlan: StudyPlan }) {
  const weeklyPercent = Math.min(
    Math.round((studyPlan.currentWeekHours / studyPlan.weeklyGoalHours) * 100),
    100
  );

  return (
    <div className="space-y-8">
      {/* Weekly Goal */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-br from-slate-50 to-cyan-50/30 rounded-xl border border-slate-200">
        <div className="relative">
          <CircularProgress percent={weeklyPercent} size={120} strokeWidth={10} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">{studyPlan.currentWeekHours}h</span>
            <span className="text-[10px] text-slate-500">/ {studyPlan.weeklyGoalHours}h 目標</span>
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2 justify-center sm:justify-start">
            <Target className="w-5 h-5 text-cyan-500" />
            今週の学習目標
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            週 {studyPlan.weeklyGoalHours} 時間の学習で、計画通りにコースを修了できます。
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 justify-center sm:justify-start">
            <Calendar className="w-4 h-4 text-cyan-500" />
            <span>修了予定日: <span className="font-bold text-slate-800">{studyPlan.estimatedCompletionDate}</span></span>
          </div>
        </div>
      </div>

      {/* Milestone Timeline */}
      <div>
        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-500" />
          マイルストーン
        </h4>
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200" />

          <div className="space-y-6">
            {studyPlan.milestones.map((milestone) => (
              <div key={milestone.chapter} className="relative flex items-start gap-4">
                {/* Dot */}
                <div className="absolute -left-8 top-0.5">
                  {milestone.status === "completed" ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : milestone.status === "current" ? (
                    <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center shadow-sm ring-4 ring-cyan-100 animate-pulse">
                      <Play className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className={`flex-1 p-4 rounded-lg border transition-colors ${
                  milestone.status === "current"
                    ? "bg-cyan-50/50 border-cyan-200"
                    : milestone.status === "completed"
                      ? "bg-white border-slate-200"
                      : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Chapter {milestone.chapter}</span>
                      <h5 className={`font-bold text-sm ${
                        milestone.status === "upcoming" ? "text-slate-400" : "text-slate-800"
                      }`}>
                        {milestone.title}
                      </h5>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">目標日</span>
                      <p className="text-sm font-medium text-slate-600">{milestone.targetDate}</p>
                    </div>
                  </div>
                  {milestone.status === "current" && (
                    <div className="mt-2 text-xs text-cyan-600 font-medium flex items-center gap-1">
                      <Play className="w-3 h-3" /> 学習中
                    </div>
                  )}
                  {milestone.status === "completed" && (
                    <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> 完了済み
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewsTab({ reviews, reviewCount }: { reviews: Review[]; reviewCount: number }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-slate-500">
          {reviewCount}件のレビュー
        </span>
      </div>
      <div className="space-y-5">
        {reviews.map((review, i) => (
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

  const { data: courseData, isLoading: courseLoading } = useCourse(courseId);
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useMyEnrollments();

  const isLoading = courseLoading || enrollmentsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">コースが見つかりませんでした。</p>
      </div>
    );
  }

  // Find enrollment for this course
  const enrollment = enrollmentsData?.results.find(
    (e) => e.course.id === courseData.id
  );
  const progressPercent = enrollment ? Number(enrollment.progress_percent) : 0;

  // Build UI chapters from API data with derived lesson statuses
  // Flatten all lessons across chapters to compute completed count from progress_percent
  const allLessons = (courseData.chapters ?? []).flatMap((ch) => ch.lessons);
  const totalLessonCount = allLessons.length || courseData.lesson_count;
  const completedLessonCount = Math.round((progressPercent / 100) * totalLessonCount);

  // Assign statuses: first N lessons completed, next one in-progress (if not 100%), rest locked
  let lessonIndexCounter = 0;
  const chapters: Chapter[] = (courseData.chapters ?? []).map((apiChapter, chIdx) => {
    const mappedLessons: Lesson[] = apiChapter.lessons.map((apiLesson) => {
      const globalIndex = lessonIndexCounter++;
      let status: LessonStatus;
      if (globalIndex < completedLessonCount) {
        status = "completed";
      } else if (globalIndex === completedLessonCount && progressPercent < 100 && enrollment) {
        status = "in-progress";
      } else {
        status = "locked";
      }
      return {
        id: apiLesson.id,
        title: apiLesson.title,
        duration: apiLesson.duration_label || "",
        status,
        type: apiLesson.lesson_type as LessonType,
      };
    });

    return {
      number: chIdx + 1,
      title: apiChapter.title,
      lessonCount: apiChapter.lessons.length,
      duration: apiChapter.duration_label || "",
      lessons: mappedLessons,
      defaultOpen: chIdx === 0,
    };
  });

  // Derive overview paragraphs
  const overviewParagraphs = courseData.overview
    ? courseData.overview.split("\n\n").filter(Boolean)
    : [courseData.description];

  // Format duration
  const totalDuration = `${courseData.duration_hours}時間`;

  // Format enrolled count
  const studentsCount = `${courseData.enrolled_count.toLocaleString()}人が受講中`;

  // Info items
  const infoItems: CourseInfo[] = [
    { label: "講師", value: courseData.instructor_name, icon: "user" },
    { label: "受講者数", value: `${courseData.enrolled_count.toLocaleString()}人`, icon: "users" },
    { label: "言語", value: courseData.language || "日本語", icon: "globe" },
  ];

  // Tags — ensure # prefix
  const tags = (courseData.tags ?? []).map((t) =>
    t.startsWith("#") ? t : `#${t}`
  );

  // Completed lessons count for sidebar
  const completedLessons = Math.round((progressPercent / 100) * totalLessonCount);

  // Static mock data
  const reviews = staticReviews;
  const reviewCount = reviews.length;
  const studyPlan = staticStudyPlan;

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
              {courseData.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-xs font-bold border border-white/30 flex items-center gap-1">
              <Signal className="w-3 h-3" /> {courseData.difficulty}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {courseData.title}
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mb-6">
            {courseData.description}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {totalDuration}
            </span>
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {courseData.lesson_count}レッスン
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> {studentsCount}
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current text-yellow-300" />{" "}
              4.8 ({reviewCount}件)
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Main Content */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* コース概要（タブの上に常時表示） */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500" />
              コース概要
            </h3>
            <div className="text-sm text-slate-600 leading-relaxed space-y-4">
              {overviewParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* タブ切り替え（オンクラス風） */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <Tabs defaultValue="curriculum">
              <TabsList variant="line" className="w-full justify-start px-6 pt-4 border-b border-slate-200 h-auto">
                <TabsTrigger value="curriculum" className="text-sm px-4 py-2.5 gap-2">
                  <List className="w-4 h-4" />
                  カリキュラム
                </TabsTrigger>
                <TabsTrigger value="plan" className="text-sm px-4 py-2.5 gap-2">
                  <Target className="w-4 h-4" />
                  学習計画
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-sm px-4 py-2.5 gap-2">
                  <MessageCircle className="w-4 h-4" />
                  感想・レビュー
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                    {reviewCount}
                  </span>
                </TabsTrigger>
              </TabsList>

              <div className="p-6 md:p-8">
                <TabsContent value="curriculum">
                  <CurriculumTab chapters={chapters} />
                </TabsContent>

                <TabsContent value="plan">
                  <StudyPlanTab studyPlan={studyPlan} />
                </TabsContent>

                <TabsContent value="reviews">
                  <ReviewsTab reviews={reviews} reviewCount={reviewCount} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Progress Card with Chapter Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-800 text-sm">学習進捗</h4>
              <span className="text-sm font-bold text-cyan-600">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mb-5">
              {completedLessons} / {totalLessonCount} レッスン完了
            </p>

            {/* Chapter-by-chapter mini progress */}
            <div className="space-y-3 mb-5 pt-4 border-t border-slate-100">
              <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wide">チャプター別進捗</h5>
              {chapters.map((chapter) => {
                const progress = getChapterProgress(chapter);
                return (
                  <div key={chapter.number} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 w-4 text-center shrink-0">
                      {chapter.number}
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress.percent === 100
                            ? "bg-emerald-500"
                            : progress.percent > 0
                              ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                              : ""
                        }`}
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold w-8 text-right shrink-0 ${
                      progress.percent === 100
                        ? "text-emerald-600"
                        : progress.percent > 0
                          ? "text-cyan-600"
                          : "text-slate-300"
                    }`}>
                      {progress.percent}%
                    </span>
                  </div>
                );
              })}
            </div>

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
              {infoItems.map((item, i) => (
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
              {tags.map((tag) => (
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
