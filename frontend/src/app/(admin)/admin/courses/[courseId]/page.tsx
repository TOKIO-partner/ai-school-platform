"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
  Plus,
  Trash2,
  GripVertical,
  ArrowLeft,
  Film,
  X,
} from "lucide-react";
import { FileUploadZone } from "@/components/shared/file-upload-zone";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import {
  useAdminCourse,
  useUpdateCourse,
  useCreateChapter,
  useUpdateChapter,
  useDeleteChapter,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
  useMediaUpload,
} from "@/lib/queries/use-admin-courses";
import type { Chapter, Lesson } from "@/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

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

const STATUS_OPTIONS = [
  { value: "draft", label: "下書き" },
  { value: "published", label: "公開中" },
  { value: "hidden", label: "非公開" },
];

const LESSON_TYPE_OPTIONS = [
  { value: "video", label: "動画" },
  { value: "article", label: "記事" },
  { value: "quiz", label: "クイズ" },
  { value: "exercise", label: "演習" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CourseEditPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);

  const { data: course, isLoading } = useAdminCourse(courseId);
  const updateCourse = useUpdateCourse();
  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter();
  const deleteChapter = useDeleteChapter();
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const mediaUpload = useMediaUpload();

  // Course form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("design");
  const [difficulty, setDifficulty] = useState("beginner");
  const [status, setStatus] = useState("draft");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [durationHours, setDurationHours] = useState("0");
  const [tags, setTags] = useState("");

  // Chapter/Lesson tree state
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<{
    chapterId: number;
    lesson: Lesson;
  } | null>(null);

  // Lesson edit state
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonType, setLessonType] = useState("video");
  const [lessonDuration, setLessonDuration] = useState("0");

  // Initialize form from course data
  useEffect(() => {
    if (!course) return;
    setTitle(course.title);
    setSlug(course.slug);
    setCategory(course.category);
    setDifficulty(course.difficulty);
    setStatus(course.status);
    setDescription(course.description);
    setOverview(course.overview ?? "");
    setThumbnail(course.thumbnail ?? "");
    setDurationHours(String(course.duration_hours));
    setTags(course.tags?.join(", ") ?? "");
    if (course.chapters?.length) {
      setExpandedChapters(new Set(course.chapters.map((ch) => ch.id)));
    }
  }, [course]);

  // Load lesson data when selected
  useEffect(() => {
    if (!selectedLesson) return;
    const l = selectedLesson.lesson;
    setLessonTitle(l.title);
    setLessonDescription(l.description);
    setLessonVideoUrl(l.video_url);
    setLessonType(l.lesson_type);
    setLessonDuration(String(l.duration_seconds));
  }, [selectedLesson]);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  const handleSaveCourse = () => {
    updateCourse.mutate({
      id: courseId,
      title,
      slug,
      category,
      difficulty,
      status: status as "draft" | "published" | "hidden",
      description,
      overview,
      thumbnail,
      duration_hours: Number(durationHours),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  const handleAddChapter = () => {
    const order = (course?.chapters?.length ?? 0) + 1;
    createChapter.mutate({
      courseId,
      title: `新しいチャプター ${order}`,
      order,
    });
  };

  const handleDeleteChapter = (chapterId: number) => {
    if (!confirm("このチャプターを削除しますか？")) return;
    deleteChapter.mutate({ courseId, id: chapterId });
  };

  const handleAddLesson = (chapterId: number, lessonCount: number) => {
    createLesson.mutate({
      courseId,
      chapterId,
      title: `新しいレッスン ${lessonCount + 1}`,
      order: lessonCount + 1,
      lesson_type: "video" as const,
    });
  };

  const handleSaveLesson = () => {
    if (!selectedLesson) return;
    updateLesson.mutate({
      courseId,
      chapterId: selectedLesson.chapterId,
      id: selectedLesson.lesson.id,
      title: lessonTitle,
      description: lessonDescription,
      video_url: lessonVideoUrl,
      lesson_type: lessonType as "video" | "article" | "quiz" | "exercise",
      duration_seconds: Number(lessonDuration),
    });
  };

  const handleDeleteLesson = () => {
    if (!selectedLesson) return;
    if (!confirm("このレッスンを削除しますか？")) return;
    deleteLesson.mutate({
      courseId,
      chapterId: selectedLesson.chapterId,
      id: selectedLesson.lesson.id,
    });
    setSelectedLesson(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16 text-slate-400">
        コースが見つかりません
      </div>
    );
  }

  return (
    <div className="flex -m-4 md:-m-8 h-[calc(100vh-5rem)]">
      {/* Left Panel: Chapter/Lesson Tree */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0">
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={() => router.push("/admin/courses")}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            コース一覧
          </button>
          <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-xs text-slate-400">コース構成</p>
        </div>

        <div className="flex-1 p-3 space-y-1">
          {course.chapters?.map((chapter: Chapter) => (
            <div key={chapter.id}>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {expandedChapters.has(chapter.id) ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                  {expandedChapters.has(chapter.id) ? (
                    <FolderOpen className="w-4 h-4 text-cyan-500" />
                  ) : (
                    <Folder className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="truncate">{chapter.title}</span>
                </button>
                <button
                  onClick={() => handleDeleteChapter(chapter.id)}
                  className="p-1 text-slate-300 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {expandedChapters.has(chapter.id) && (
                <div className="ml-4 space-y-0.5">
                  {chapter.lessons.map((lesson: Lesson) => {
                    const isSelected =
                      selectedLesson?.lesson.id === lesson.id;
                    return (
                      <div
                        key={lesson.id}
                        onClick={() =>
                          setSelectedLesson({
                            chapterId: chapter.id,
                            lesson,
                          })
                        }
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors group ${
                          isSelected
                            ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border border-cyan-100"
                            : "text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <GripVertical
                          className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 ${
                            isSelected ? "text-cyan-300" : "text-slate-300"
                          }`}
                        />
                        <span
                          className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium ${
                            isSelected
                              ? "bg-cyan-500 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {lesson.order}
                        </span>
                        <span
                          className={`flex-1 truncate ${isSelected ? "font-medium" : ""}`}
                        >
                          {lesson.title}
                        </span>
                      </div>
                    );
                  })}
                  <button
                    onClick={() =>
                      handleAddLesson(chapter.id, chapter.lessons.length)
                    }
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-cyan-600 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    レッスン追加
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleAddChapter}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-sm font-medium text-slate-400 hover:text-cyan-600 hover:border-cyan-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            チャプターを追加
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl space-y-6">
          {selectedLesson ? (
            /* ─── Lesson Edit Form ─── */
            <>
              <Breadcrumb
                items={[
                  { label: "コース管理", href: "/admin/courses" },
                  { label: course.title },
                  { label: selectedLesson.lesson.title },
                ]}
              />
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    レッスンタイトル
                  </label>
                  <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-lg font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    説明
                  </label>
                  <textarea
                    rows={3}
                    value={lessonDescription}
                    onChange={(e) => setLessonDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">
                      レッスンタイプ
                    </label>
                    <select
                      value={lessonType}
                      onChange={(e) => setLessonType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
                    >
                      {LESSON_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">
                      再生時間（秒）
                    </label>
                    <input
                      type="number"
                      value={lessonDuration}
                      onChange={(e) => setLessonDuration(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    動画
                  </label>
                  {lessonVideoUrl ? (
                    <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                        <Film className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {lessonVideoUrl.split("/").pop() || "動画ファイル"}
                        </p>
                      </div>
                      <button
                        onClick={() => setLessonVideoUrl("")}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null}
                  <FileUploadZone
                    accept="video/mp4,video/mov,video/webm"
                    label={mediaUpload.isPending ? "アップロード中..." : "ドラッグ&ドロップまたはクリック"}
                    description="MP4, MOV, WebM (最大2GB)"
                    onFileSelect={(files) => {
                      const file = files[0];
                      if (!file) return;
                      mediaUpload.mutate(file, {
                        onSuccess: (data) => setLessonVideoUrl(data.url),
                      });
                    }}
                  />
                  <div className="space-y-1">
                    <label className="block text-xs text-slate-400">
                      または動画URLを直接入力
                    </label>
                    <input
                      type="url"
                      value={lessonVideoUrl}
                      onChange={(e) => setLessonVideoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={handleDeleteLesson}
                  className="px-5 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  削除
                </button>
                <button
                  onClick={handleSaveLesson}
                  disabled={updateLesson.isPending}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {updateLesson.isPending ? "保存中..." : "保存"}
                </button>
              </div>
            </>
          ) : (
            /* ─── Course Edit Form ─── */
            <>
              <Breadcrumb
                items={[
                  { label: "コース管理", href: "/admin/courses" },
                  { label: course.title },
                ]}
              />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <label className="block text-sm font-bold text-slate-700">
                      コースタイトル
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">
                      ステータス
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
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
                  <div className="space-y-2">
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
                  <label className="block text-sm font-bold text-slate-700">
                    説明
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    概要
                  </label>
                  <textarea
                    rows={4}
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm resize-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 pb-8">
                <button
                  onClick={handleSaveCourse}
                  disabled={updateCourse.isPending}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {updateCourse.isPending ? "保存中..." : "コースを保存"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
