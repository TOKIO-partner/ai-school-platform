"use client";

import Link from "next/link";
import { Award, Cpu, CheckCircle, Zap, Play, BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { useMyEnrollments, useMyStats } from "@/lib/queries/use-enrollments";

const gradients = [
  "from-sky-100 to-sky-500",
  "from-indigo-100 to-indigo-500",
  "from-pink-100 to-pink-500",
  "from-emerald-100 to-emerald-500",
  "from-amber-100 to-amber-500",
];

export default function DashboardPage() {
  const { data: enrollmentsData, isLoading: enrollLoading } = useMyEnrollments();
  const { data: stats, isLoading: statsLoading } = useMyStats();

  const enrollments = enrollmentsData?.results ?? [];

  if (enrollLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-8 shadow-sm mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100/50 to-blue-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, Creator.</h2>
          <p className="text-slate-500 mb-6 max-w-2xl">
            前回のセッションでは「レスポンシブデザイン」を学習しました。AIコーチがあなたの進捗に基づいて、次のカリキュラムを最適化しました。
          </p>
          <div className="flex gap-4">
            <Link
              href="/learning"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              学習を再開する
            </Link>
            <Link
              href="/portfolio"
              className="px-6 py-3 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
            >
              ポートフォリオを見る
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-cyan-700 bg-cyan-50 px-2 py-1 rounded">LV.12</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">獲得スキルポイント</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            {stats?.skill_points_total?.toLocaleString() ?? "—"} <span className="text-sm text-slate-400 font-normal">pts</span>
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-fuchsia-50 text-fuchsia-600 group-hover:bg-fuchsia-500 group-hover:text-white transition-colors">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-fuchsia-700 bg-fuchsia-50 px-2 py-1 rounded">AI Analysis</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">現在の学習集中度</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            High <span className="text-sm text-slate-400 font-normal">top 5%</span>
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded">Weekly</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">今週の完了レッスン</h3>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            {stats?.weekly_completed_lessons ?? "—"} <span className="text-sm text-slate-400 font-normal">lessons</span>
          </p>
        </div>
      </div>

      {/* Recommended Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500 fill-current" />
            Recommended for You
          </h3>
          <Link href="/courses" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
            すべて見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment, idx) => {
            const course = enrollment.course;
            const progress = Number(enrollment.progress_percent ?? 0);
            const gradient = gradients[idx % gradients.length];
            const completedLessons = Math.round((progress / 100) * course.lesson_count);

            return (
              <div key={enrollment.id} className="group relative rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="h-40 w-full relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <Link
                    href={`/courses/${course.id}`}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg"
                  >
                    <Play className="w-5 h-5 text-white ml-1 fill-current" />
                  </Link>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-cyan-600 transition-colors">
                    {course.title}
                  </h4>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {completedLessons}/{course.lesson_count} レッスン
                    </span>
                    <span className="flex items-center gap-1 text-cyan-600 font-medium">
                      <Cpu className="w-3 h-3" /> AI分析あり
                    </span>
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
