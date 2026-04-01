"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Play, BarChart2, Monitor, BookOpen, Loader2 } from "lucide-react";
import { useCourses } from "@/lib/queries/use-courses";
import { useMyEnrollments } from "@/lib/queries/use-enrollments";

type Category = "all" | "design" | "dev" | "ai" | "business";

const categories: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Design", value: "design" },
  { label: "Dev", value: "dev" },
  { label: "AI", value: "ai" },
  { label: "Business", value: "business" },
];

const categoryGradients: Record<string, string> = {
  design: "linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 100%)",
  dev: "linear-gradient(135deg, #e0e7ff 0%, #4f46e5 100%)",
  ai: "linear-gradient(135deg, #fce7f3 0%, #db2777 100%)",
  business: "linear-gradient(135deg, #ecfdf5 0%, #059669 100%)",
};

const difficultyLabel: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: coursesData, isLoading } = useCourses({
    category: activeCategory === "all" ? undefined : activeCategory,
    search: searchQuery || undefined,
  });
  const { data: enrollmentsData } = useMyEnrollments();

  const courses = coursesData?.results ?? [];
  const enrollments = enrollmentsData?.results ?? [];

  // Build a map of courseId -> progress for enrolled courses
  const progressMap = new Map(
    enrollments.map((e) => [e.course.id, Number(e.progress_percent)]),
  );

  return (
    <div className="space-y-8">
      {/* Header with Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">コースライブラリ</h2>
          <p className="text-slate-500 text-sm">
            あなたのキャリアを加速させる{courses.length}のコース
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="スキルやトピックを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm w-64 focus:outline-none focus:border-cyan-500 shadow-sm"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-500">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.value
                ? "bg-slate-800 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const progress = progressMap.get(course.id) ?? null;
            const gradient = categoryGradients[course.category] || categoryGradients.design;

            return (
              <div
                key={course.id}
                className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full"
              >
                {/* Card Thumbnail */}
                <div
                  className="h-48 w-full relative shrink-0"
                  style={{ background: gradient }}
                >
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 rounded bg-white/90 backdrop-blur text-xs font-bold text-slate-800 shadow-sm">
                      {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                    </span>
                    {progress !== null && (
                      <span className="px-2 py-1 rounded bg-cyan-500 text-xs font-bold text-white shadow-sm">
                        受講中 {progress}%
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <Link
                    href={`/courses/${course.id}`}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/30 backdrop-blur border border-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg text-white"
                  >
                    <Play className="w-6 h-6 fill-current" />
                  </Link>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-4">
                    <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-cyan-600 transition-colors mb-1">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <BarChart2 className="w-3 h-3" /> {difficultyLabel[course.difficulty] ?? course.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Monitor className="w-3 h-3" /> {course.duration_hours}h
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {course.lesson_count} レッスン
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-sm font-bold text-cyan-600 hover:text-cyan-700"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
