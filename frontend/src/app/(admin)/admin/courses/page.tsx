"use client";

import { useState, useMemo } from "react";
import { Plus, Palette, Code, Brain, Lightbulb, Image, BarChart3 } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { AdminCourseCard } from "@/components/shared/admin-course-card";

type CourseStatus = "公開中" | "下書き" | "非公開";

interface CourseData {
  id: number;
  title: string;
  icon: LucideIcon;
  iconGradient: string;
  status: CourseStatus;
  category: string;
  categoryKey: string;
  categoryColor: string;
  level: string;
  enrollmentCount: number;
  rating: number;
}

const courses: CourseData[] = [
  {
    id: 1,
    title: "AI活用Webデザイン基礎",
    icon: Palette,
    iconGradient: "from-cyan-400 to-blue-500",
    status: "公開中",
    category: "Design",
    categoryKey: "design",
    categoryColor: "bg-cyan-50 text-cyan-600",
    level: "初級",
    enrollmentCount: 256,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Next.js 14 & React実践",
    icon: Code,
    iconGradient: "from-violet-400 to-purple-500",
    status: "公開中",
    category: "Dev",
    categoryKey: "dev",
    categoryColor: "bg-violet-50 text-violet-600",
    level: "中級",
    enrollmentCount: 189,
    rating: 4.6,
  },
  {
    id: 3,
    title: "プロンプトエンジニアリング入門",
    icon: Brain,
    iconGradient: "from-fuchsia-400 to-pink-500",
    status: "公開中",
    category: "AI",
    categoryKey: "ai",
    categoryColor: "bg-emerald-50 text-emerald-600",
    level: "初級",
    enrollmentCount: 210,
    rating: 4.5,
  },
  {
    id: 4,
    title: "ビジネスAI活用戦略",
    icon: Lightbulb,
    iconGradient: "from-amber-400 to-orange-500",
    status: "下書き",
    category: "Business",
    categoryKey: "business",
    categoryColor: "bg-amber-50 text-amber-600",
    level: "中級",
    enrollmentCount: 45,
    rating: 4.2,
  },
  {
    id: 5,
    title: "画像生成AI マスター",
    icon: Image,
    iconGradient: "from-emerald-400 to-green-500",
    status: "公開中",
    category: "AI",
    categoryKey: "ai",
    categoryColor: "bg-emerald-50 text-emerald-600",
    level: "中級",
    enrollmentCount: 178,
    rating: 4.7,
  },
  {
    id: 6,
    title: "データ分析基礎",
    icon: BarChart3,
    iconGradient: "from-rose-400 to-red-500",
    status: "非公開",
    category: "Dev",
    categoryKey: "dev",
    categoryColor: "bg-violet-50 text-violet-600",
    level: "初級",
    enrollmentCount: 128,
    rating: 4.0,
  },
];

const categoryOptions = [
  { value: "all", label: "All" },
  { value: "design", label: "Design" },
  { value: "dev", label: "Dev" },
  { value: "ai", label: "AI" },
  { value: "business", label: "Business" },
];

const statusOptions: { value: string; label: string }[] = [
  { value: "all", label: "全て" },
  { value: "公開中", label: "公開中" },
  { value: "下書き", label: "下書き" },
  { value: "非公開", label: "非公開" },
];

export default function AdminCoursesPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchCategory =
        categoryFilter === "all" || course.categoryKey === categoryFilter;
      const matchStatus =
        statusFilter === "all" || course.status === statusFilter;
      return matchCategory && matchStatus;
    });
  }, [categoryFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">コース管理</h2>
          <p className="text-slate-500 text-sm">{filteredCourses.length}コース</p>
        </div>
        <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新規コース作成
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">カテゴリ:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-cyan-500 shadow-sm"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">ステータス:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-cyan-500 shadow-sm"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <AdminCourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            icon={course.icon}
            iconGradient={course.iconGradient}
            status={course.status}
            category={course.category}
            categoryColor={course.categoryColor}
            level={course.level}
            enrollmentCount={course.enrollmentCount}
            rating={course.rating}
            onEdit={() => console.log("Edit course:", course.id)}
            onDuplicate={() => console.log("Duplicate course:", course.id)}
            onTogglePublish={() => console.log("Toggle publish:", course.id)}
            onDelete={() => console.log("Delete course:", course.id)}
          />
        ))}
      </div>
    </div>
  );
}
