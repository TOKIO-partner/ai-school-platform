"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, BookOpen, Users, Layers } from "lucide-react";
import {
  useAdminCourses,
  useUpdateCourse,
  useDeleteCourse,
} from "@/lib/queries/use-admin-courses";
import type { AdminCourse } from "@/types";

// ---------------------------------------------------------------------------
// Status / Category mappings
// ---------------------------------------------------------------------------

const STATUS_MAP: Record<string, string> = {
  published: "公開中",
  draft: "下書き",
  hidden: "非公開",
};

const STATUS_COLORS: Record<string, string> = {
  published: "bg-green-50 text-green-600",
  draft: "bg-slate-100 text-slate-500",
  hidden: "bg-red-50 text-red-600",
};

const CATEGORY_LABELS: Record<string, string> = {
  design: "Design",
  dev: "Dev",
  ai: "AI",
  business: "Business",
};

const CATEGORY_COLORS: Record<string, string> = {
  design: "bg-cyan-50 text-cyan-600",
  dev: "bg-violet-50 text-violet-600",
  ai: "bg-emerald-50 text-emerald-600",
  business: "bg-amber-50 text-amber-600",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

const categoryOptions = [
  { value: "all", label: "All" },
  { value: "design", label: "Design" },
  { value: "dev", label: "Dev" },
  { value: "ai", label: "AI" },
  { value: "business", label: "Business" },
];

const statusOptions = [
  { value: "all", label: "全て" },
  { value: "published", label: "公開中" },
  { value: "draft", label: "下書き" },
  { value: "hidden", label: "非公開" },
];

// ---------------------------------------------------------------------------
// Course Card (inline — uses API data directly)
// ---------------------------------------------------------------------------

function CourseCard({
  course,
  onEdit,
  onTogglePublish,
  onDelete,
}: {
  course: AdminCourse;
  onEdit: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {course.thumbnail ? (
        <div className="h-32 bg-slate-100 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500">
          <BookOpen className="w-12 h-12 text-white/80" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[course.status] ?? "bg-slate-100 text-slate-500"}`}
          >
            {STATUS_MAP[course.status] ?? course.status}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[course.category] ?? "bg-slate-100 text-slate-500"}`}
          >
            {CATEGORY_LABELS[course.category] ?? course.category}
          </span>
        </div>
        <h4 className="font-bold text-slate-800 mb-3 line-clamp-2">
          {course.title}
        </h4>
        <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
          <span className="text-xs text-slate-400">
            {DIFFICULTY_LABELS[course.difficulty] ?? course.difficulty}
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {course.enrolled_count}名
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {course.lesson_count}レッスン
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          講師: {course.instructor_name}
        </p>
        <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
          >
            編集
          </button>
          <button
            onClick={onTogglePublish}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {course.status === "published" ? "非公開" : "公開"}
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminCoursesPage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const queryParams = useMemo(() => {
    const p: Record<string, string> = {};
    if (categoryFilter !== "all") p.category = categoryFilter;
    if (statusFilter !== "all") p.status = statusFilter;
    return Object.keys(p).length ? p : undefined;
  }, [categoryFilter, statusFilter]);

  const { data: courses, isLoading } = useAdminCourses(queryParams);
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const handleTogglePublish = (course: AdminCourse) => {
    const newStatus = course.status === "published" ? "hidden" : "published";
    updateCourse.mutate({ id: course.id, status: newStatus });
  };

  const handleDelete = (course: AdminCourse) => {
    if (!confirm(`「${course.title}」を削除しますか？`)) return;
    deleteCourse.mutate(course.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">コース管理</h2>
          <p className="text-slate-500 text-sm">{courses?.length ?? 0}コース</p>
        </div>
        <button
          onClick={() => router.push("/admin/courses/new")}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
        >
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
        {courses?.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={() => router.push(`/admin/courses/${course.id}`)}
            onTogglePublish={() => handleTogglePublish(course)}
            onDelete={() => handleDelete(course)}
          />
        ))}
      </div>

      {courses?.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>コースがありません</p>
        </div>
      )}
    </div>
  );
}
