"use client";

import Link from "next/link";
import {
  Clock,
  GraduationCap,
  CheckCircle,
  Award,
  Radar,
  BarChart3,
  Trophy,
  LogIn,
  Cpu,
  Send,
  MessageCircle,
  Flame,
  BookOpen,
  ChevronRight,
  Palette,
  Code2,
  Figma,
  TrendingUp,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ResponsiveContainer,
} from "recharts";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatCard {
  id: string;
  icon: LucideIcon;
  iconBg: string;
  iconHoverBg: string;
  label: string;
  value: string;
  unit: string;
  badgeText: string;
  badgeColor: string;
}

interface SkillData {
  subject: string;
  value: number;
  fullMark: number;
}

interface WeeklyStudyDay {
  day: string;
  heightPercent: number;
  isWeekend: boolean;
}

interface Badge {
  id: string;
  icon: LucideIcon;
  gradient: string;
  shadowColor: string;
  title: string;
  description: string;
  achieved: boolean;
  statusLabel: string;
}

interface EnrolledCourse {
  id: string;
  icon: LucideIcon;
  backgroundStyle: string;
  title: string;
  progressPercent: number;
  progressColor: string;
  barGradient: string;
  completedLessons: number;
  totalLessons: number;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const statCards: StatCard[] = [
  {
    id: "total-hours",
    icon: Clock,
    iconBg: "bg-cyan-50 text-cyan-600",
    iconHoverBg: "group-hover:bg-cyan-500 group-hover:text-white",
    label: "総学習時間",
    value: "48",
    unit: "h",
    badgeText: "Total",
    badgeColor: "text-cyan-700 bg-cyan-50",
  },
  {
    id: "completed-courses",
    icon: GraduationCap,
    iconBg: "bg-fuchsia-50 text-fuchsia-600",
    iconHoverBg: "group-hover:bg-fuchsia-500 group-hover:text-white",
    label: "完了コース",
    value: "3",
    unit: "courses",
    badgeText: "Completed",
    badgeColor: "text-fuchsia-700 bg-fuchsia-50",
  },
  {
    id: "completed-lessons",
    icon: CheckCircle,
    iconBg: "bg-blue-50 text-blue-600",
    iconHoverBg: "group-hover:bg-blue-500 group-hover:text-white",
    label: "完了レッスン",
    value: "42",
    unit: "lessons",
    badgeText: "Lessons",
    badgeColor: "text-blue-700 bg-blue-50",
  },
  {
    id: "skill-points",
    icon: Award,
    iconBg: "bg-amber-50 text-amber-600",
    iconHoverBg: "group-hover:bg-amber-500 group-hover:text-white",
    label: "スキルポイント",
    value: "1,250",
    unit: "pts",
    badgeText: "LV.12",
    badgeColor: "text-amber-700 bg-amber-50",
  },
];

const skillRadarData: SkillData[] = [
  { subject: "HTML/CSS", value: 92, fullMark: 100 },
  { subject: "JavaScript", value: 78, fullMark: 100 },
  { subject: "React", value: 72, fullMark: 100 },
  { subject: "Design", value: 55, fullMark: 100 },
  { subject: "AI活用", value: 65, fullMark: 100 },
  { subject: "UX", value: 70, fullMark: 100 },
];

const weeklyStudyData: WeeklyStudyDay[] = [
  { day: "月", heightPercent: 40, isWeekend: false },
  { day: "火", heightPercent: 70, isWeekend: false },
  { day: "水", heightPercent: 55, isWeekend: false },
  { day: "木", heightPercent: 90, isWeekend: false },
  { day: "金", heightPercent: 65, isWeekend: false },
  { day: "土", heightPercent: 100, isWeekend: true },
  { day: "日", heightPercent: 80, isWeekend: true },
];

const badges: Badge[] = [
  {
    id: "first-login",
    icon: LogIn,
    gradient: "from-amber-400 to-orange-500",
    shadowColor: "shadow-amber-500/20",
    title: "初回ログイン",
    description: "プラットフォームへの初めてのログインを達成",
    achieved: true,
    statusLabel: "達成",
  },
  {
    id: "10-lessons",
    icon: CheckCircle,
    gradient: "from-cyan-400 to-blue-500",
    shadowColor: "shadow-cyan-500/20",
    title: "10レッスン達成",
    description: "累計10レッスンを完了しました",
    achieved: true,
    statusLabel: "達成",
  },
  {
    id: "ai-master",
    icon: Cpu,
    gradient: "from-fuchsia-400 to-purple-500",
    shadowColor: "shadow-fuchsia-500/20",
    title: "AI活用マスター",
    description: "AI関連のコースをすべて完了しました",
    achieved: true,
    statusLabel: "達成",
  },
  {
    id: "10-submissions",
    icon: Send,
    gradient: "from-emerald-400 to-teal-500",
    shadowColor: "shadow-emerald-500/20",
    title: "課題提出10回",
    description: "課題を累計10回提出しました",
    achieved: true,
    statusLabel: "達成",
  },
  {
    id: "community-post",
    icon: MessageCircle,
    gradient: "from-indigo-400 to-violet-500",
    shadowColor: "shadow-indigo-500/20",
    title: "コミュニティ投稿",
    description: "コミュニティに初めて投稿しました",
    achieved: true,
    statusLabel: "達成",
  },
  {
    id: "30-day-streak",
    icon: Flame,
    gradient: "from-slate-300 to-slate-400",
    shadowColor: "shadow-slate-500/10",
    title: "30日連続学習",
    description: "30日間連続でログイン・学習を達成",
    achieved: false,
    statusLabel: "22/30日",
  },
];

const enrolledCourses: EnrolledCourse[] = [
  {
    id: "web-design",
    icon: Palette,
    backgroundStyle: "linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 100%)",
    title: "AI活用 Webデザイン基礎",
    progressPercent: 75,
    progressColor: "text-cyan-600",
    barGradient: "from-cyan-400 to-blue-500",
    completedLessons: 15,
    totalLessons: 20,
  },
  {
    id: "nextjs-react",
    icon: Code2,
    backgroundStyle: "linear-gradient(135deg, #e0e7ff 0%, #4f46e5 100%)",
    title: "Next.js 14 & React 実践",
    progressPercent: 33,
    progressColor: "text-indigo-600",
    barGradient: "from-indigo-400 to-violet-500",
    completedLessons: 4,
    totalLessons: 12,
  },
  {
    id: "ui-ux",
    icon: Figma,
    backgroundStyle: "linear-gradient(135deg, #fce7f3 0%, #db2777 100%)",
    title: "UI/UXデザイン概論",
    progressPercent: 12,
    progressColor: "text-fuchsia-600",
    barGradient: "from-fuchsia-400 to-pink-500",
    completedLessons: 1,
    totalLessons: 8,
  },
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function ProgressPage() {
  return (
    <>
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2 rounded-lg ${stat.iconBg} ${stat.iconHoverBg} transition-colors`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-xs font-mono ${stat.badgeColor} px-2 py-1 rounded`}
                >
                  {stat.badgeText}
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {stat.value}
                <span className="text-sm text-slate-400 font-normal ml-1">
                  {stat.unit}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Skills Radar Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Radar className="w-5 h-5 text-cyan-500" />
              スキルレーダー
            </h3>
            <span className="text-xs text-slate-400">最終更新: 今日</span>
          </div>
          <div className="flex items-center justify-center py-4">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="75%"
                data={skillRadarData}
              >
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <RechartsRadar
                  name="スキル"
                  dataKey="value"
                  stroke="#06b6d4"
                  fill="rgba(6,182,212,0.15)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#06b6d4", strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {skillRadarData.map((skill) => (
              <div
                key={skill.subject}
                className="text-center p-2 rounded-lg bg-slate-50"
              >
                <p className="text-xs text-slate-500">{skill.subject}</p>
                <p className="text-sm font-bold text-slate-700">
                  {skill.value}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Study Time Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-fuchsia-500" />
              学習時間推移
            </h3>
            <span className="text-xs text-slate-400">過去7日間</span>
          </div>
          <div className="flex items-end justify-between gap-3 h-48 px-2">
            {weeklyStudyData.map((day) => (
              <div
                key={day.day}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    day.isWeekend
                      ? "bg-gradient-to-t from-fuchsia-400 to-fuchsia-300 hover:from-fuchsia-500 hover:to-fuchsia-400"
                      : "bg-gradient-to-t from-cyan-400 to-cyan-300 hover:from-cyan-500 hover:to-cyan-400"
                  }`}
                  style={{ height: `${day.heightPercent}%` }}
                />
                <span className="text-xs text-slate-500 font-medium">
                  {day.day}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500">今週の合計</p>
              <p className="text-lg font-bold text-slate-800">12.5h</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">先週比</p>
              <p className="text-lg font-bold text-emerald-500 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +18%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500 fill-current" />
            達成バッジ
          </h3>
          <span className="text-sm text-slate-400">
            {badges.filter((b) => b.achieved).length} / 24 獲得済み
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const BadgeIcon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group ${
                  !badge.achieved ? "opacity-60" : ""
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center shadow-lg ${badge.shadowColor} shrink-0`}
                >
                  <BadgeIcon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-bold ${
                      badge.achieved
                        ? "text-slate-800 group-hover:text-cyan-600 transition-colors"
                        : "text-slate-600"
                    }`}
                  >
                    {badge.title}
                  </h4>
                  <p
                    className={`text-xs mt-0.5 ${
                      badge.achieved ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {badge.description}
                  </p>
                </div>
                <div className="shrink-0">
                  {badge.achieved ? (
                    <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                      {badge.statusLabel}
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      {badge.statusLabel}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enrolled Courses Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            受講中コース
          </h3>
          <Link
            href="/courses"
            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
          >
            すべて見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {enrolledCourses.map((course) => {
            const CourseIcon = course.icon;
            return (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-5">
                  <div
                    className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: course.backgroundStyle }}
                  >
                    <CourseIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-800 group-hover:text-cyan-600 transition-colors">
                        {course.title}
                      </h4>
                      <span
                        className={`text-sm font-bold ${course.progressColor}`}
                      >
                        {course.progressPercent}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">
                      {course.completedLessons} / {course.totalLessons}{" "}
                      レッスン完了
                    </p>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${course.barGradient} rounded-full transition-all`}
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
