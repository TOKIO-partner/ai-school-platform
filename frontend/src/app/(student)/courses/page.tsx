"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Play, BarChart2, Monitor, BookOpen } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Category = "All" | "Design" | "Dev" | "AI" | "Business";

interface Course {
  id: number;
  title: string;
  category: Category;
  level: string;
  duration: string;
  lessons: number;
  gradient: string;
  progress: number | null; // null = not enrolled
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const categories: Category[] = ["All", "Design", "Dev", "AI", "Business"];

const courses: Course[] = [
  {
    id: 1,
    title: "AI活用 Webデザイン基礎",
    category: "Design",
    level: "Beginner",
    duration: "12h",
    lessons: 20,
    gradient: "linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 100%)",
    progress: 75,
  },
  {
    id: 2,
    title: "Next.js 14 & React 実践",
    category: "Dev",
    level: "Intermediate",
    duration: "24h",
    lessons: 12,
    gradient: "linear-gradient(135deg, #e0e7ff 0%, #4f46e5 100%)",
    progress: 30,
  },
  {
    id: 3,
    title: "UI/UXデザイン概論",
    category: "Design",
    level: "Beginner",
    duration: "8h",
    lessons: 8,
    gradient: "linear-gradient(135deg, #fce7f3 0%, #db2777 100%)",
    progress: null,
  },
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      activeCategory === "All" || course.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? "bg-slate-800 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full"
          >
            {/* Card Thumbnail */}
            <div
              className="h-48 w-full relative shrink-0"
              style={{ background: course.gradient }}
            >
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-1 rounded bg-white/90 backdrop-blur text-xs font-bold text-slate-800 shadow-sm">
                  {course.category}
                </span>
                {course.progress !== null && (
                  <span className="px-2 py-1 rounded bg-cyan-500 text-xs font-bold text-white shadow-sm">
                    受講中 {course.progress}%
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
                    <BarChart2 className="w-3 h-3" /> {course.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <Monitor className="w-3 h-3" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {course.lessons} レッスン
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
        ))}
      </div>
    </div>
  );
}
