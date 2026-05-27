"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { useCreateCourse } from "@/lib/queries/use-admin-courses";

const CATEGORY_OPTIONS = [
  { value: "design", label: "Design" },
  { value: "dev", label: "Development" },
  { value: "ai", label: "AI" },
  { value: "business", label: "Business" },
];

const DIFFICULTY_OPTIONS = [
  { value: "beginner", label: "初級" },
  { value: "intermediate", label: "中級" },
  { value: "advanced", label: "上級" },
];

export default function NewCoursePage() {
  const router = useRouter();
  const createCourse = useCreateCourse();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("design");
  const [difficulty, setDifficulty] = useState("beginner");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [durationHours, setDurationHours] = useState("0");
  const [tags, setTags] = useState("");

  const handleCreate = () => {
    if (!title || !slug) return;
    createCourse.mutate(
      {
        title,
        slug,
        category,
        difficulty,
        status: "draft" as const,
        description,
        overview,
        thumbnail,
        duration_hours: Number(durationHours),
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      },
      {
        onSuccess: (data) => {
          router.push(`/admin/courses/${data.id}`);
        },
      },
    );
  };

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Breadcrumb
        items={[
          { label: "コース管理", href: "/admin/courses" },
          { label: "新規コース作成" },
        ]}
      />

      <h2 className="text-2xl font-bold text-slate-800">新規コース作成</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-bold text-slate-700">
              コースタイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="例: AI活用 Webデザイン基礎"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-lg font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              スラッグ
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ai-web-design-basics"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              カテゴリ
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              難易度
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              所要時間（時間）
            </label>
            <input
              type="number"
              step="0.5"
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-bold text-slate-700">
              タグ（カンマ区切り）
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="AI, Web, デザイン"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            サムネイルURL
          </label>
          <input
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">説明</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="コースの概要を入力..."
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm resize-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">概要</label>
          <textarea
            rows={4}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="詳細な概要..."
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 pb-8">
        <button
          onClick={() => router.push("/admin/courses")}
          className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
        >
          キャンセル
        </button>
        <button
          onClick={handleCreate}
          disabled={createCourse.isPending || !title || !slug}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {createCourse.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          作成
        </button>
      </div>
    </div>
  );
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
