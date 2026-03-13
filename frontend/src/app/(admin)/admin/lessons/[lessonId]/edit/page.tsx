"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
  GripVertical,
  Plus,
  Film,
  FileText,
  Image,
  Trash2,
  Eye,
  Save,
  X,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { FileUploadZone } from "@/components/shared/file-upload-zone";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Lesson {
  id: number;
  title: string;
  duration: string;
}

interface Chapter {
  id: number;
  title: string;
  expanded: boolean;
  lessons: Lesson[];
}

interface AIComment {
  id: number;
  time: string;
  text: string;
}

interface MaterialFile {
  id: number;
  name: string;
  size: string;
  type: "pdf" | "image";
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const initialChapters: Chapter[] = [
  {
    id: 1,
    title: "Chapter 1: デザイン基礎",
    expanded: true,
    lessons: [
      { id: 1, title: "デザインとは何か", duration: "12:30" },
      { id: 2, title: "色彩理論の基礎", duration: "18:45" },
      { id: 3, title: "タイポグラフィ入門", duration: "15:20" },
    ],
  },
  {
    id: 2,
    title: "Chapter 2: AI活用",
    expanded: true,
    lessons: [
      { id: 4, title: "AIツールの概要", duration: "20:00" },
      { id: 5, title: "画像生成AI入門", duration: "22:15" },
      { id: 6, title: "プロンプトエンジニアリング", duration: "25:30" },
    ],
  },
  {
    id: 3,
    title: "Chapter 3: 実践演習",
    expanded: false,
    lessons: [],
  },
];

const initialComments: AIComment[] = [
  { id: 1, time: "02:30", text: "ここからAIツールの種類について解説していきます!" },
  { id: 2, time: "08:15", text: "Midjourneyのプロンプト例、メモしておくと便利ですよ!" },
  { id: 3, time: "15:40", text: "実務では複数のAIツールを組み合わせるのがポイントです!" },
];

const initialMaterials: MaterialFile[] = [
  { id: 1, name: "AIツール比較資料.pdf", size: "2.1 MB", type: "pdf" },
  { id: 2, name: "ワークフロー図解.png", size: "856 KB", type: "image" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LessonEditPage() {
  const [chapters, setChapters] = useState(initialChapters);
  const [selectedLessonId, setSelectedLessonId] = useState(4);
  const [lessonTitle, setLessonTitle] = useState("AIツールの概要");
  const [lessonDescription, setLessonDescription] = useState(
    "Webデザインで活用できる主要なAIツール（Midjourney、DALL-E、Stable Diffusion等）の特徴と使い分けを学びます。各ツールの強みと制限を理解し、デザインワークフローへの統合方法を習得します。"
  );
  const [comments, setComments] = useState(initialComments);
  const [materials, setMaterials] = useState(initialMaterials);
  const [newCommentTime, setNewCommentTime] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  // Assignment state
  const [assignmentTitle, setAssignmentTitle] = useState("AIツールを使ったバナーデザイン制作");
  const [assignmentDesc, setAssignmentDesc] = useState(
    "本レッスンで紹介したAIツール（Midjourney、DALL-E、Stable Diffusionのいずれか）を使用して、架空のWebサービスのバナーデザインを3パターン制作してください。"
  );
  const [submissionFormat, setSubmissionFormat] = useState("file");
  const [evaluationCriteria, setEvaluationCriteria] = useState(
    "1. AIツールの適切な活用（プロンプトの工夫） - 30点\n2. デザインの完成度（構図、配色、タイポグラフィ） - 40点\n3. バリエーションの多様性 - 20点\n4. 制作プロセスの説明 - 10点"
  );

  const toggleChapter = (chapterId: number) => {
    setChapters((prev) =>
      prev.map((ch) => (ch.id === chapterId ? { ...ch, expanded: !ch.expanded } : ch))
    );
  };

  const addComment = () => {
    if (!newCommentTime || !newCommentText) return;
    setComments((prev) => [...prev, { id: Date.now(), time: newCommentTime, text: newCommentText }]);
    setNewCommentTime("");
    setNewCommentText("");
  };

  const removeComment = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const removeMaterial = (id: number) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="flex -m-4 md:-m-8 h-[calc(100vh-5rem)]">
      {/* Left Panel: Chapter/Lesson Tree */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm mb-1">AI活用 Webデザイン基礎</h3>
          <p className="text-xs text-slate-400">コース構成</p>
        </div>

        <div className="flex-1 p-3 space-y-1">
          {chapters.map((chapter) => (
            <div key={chapter.id}>
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {chapter.expanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
                {chapter.expanded ? (
                  <FolderOpen className="w-4 h-4 text-cyan-500" />
                ) : (
                  <Folder className="w-4 h-4 text-slate-400" />
                )}
                <span>{chapter.title}</span>
              </button>

              {chapter.expanded && (
                <div className="ml-4 space-y-0.5">
                  {chapter.lessons.map((lesson) => {
                    const isSelected = lesson.id === selectedLessonId;
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setSelectedLessonId(lesson.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors group ${
                          isSelected
                            ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border border-cyan-100"
                            : "text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <GripVertical
                          className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 cursor-grab ${
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
                          {lesson.id}
                        </span>
                        <span className={`flex-1 truncate ${isSelected ? "font-medium" : ""}`}>
                          {lesson.title}
                        </span>
                        <span className={`text-xs ${isSelected ? "text-cyan-500" : "text-slate-400"}`}>
                          {lesson.duration}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-100">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-sm font-medium text-slate-400 hover:text-cyan-600 hover:border-cyan-300 transition-colors">
            <Plus className="w-4 h-4" />
            チャプターを追加
          </button>
        </div>
      </div>

      {/* Right Panel: Lesson Edit Form */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "コース管理", href: "/admin/courses" },
              { label: "AI活用 Webデザイン基礎" },
              { label: "Lesson 4" },
            ]}
          />

          {/* Lesson Title */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">レッスンタイトル</label>
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-lg font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">説明</label>
            <textarea
              rows={3}
              value={lessonDescription}
              onChange={(e) => setLessonDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm transition-all resize-none"
              placeholder="レッスンの概要を入力してください..."
            />
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">動画アップロード</label>
            <FileUploadZone
              accept="video/mp4,video/mov,video/webm"
              label="ドラッグ&ドロップまたはクリックしてアップロード"
              description="MP4, MOV, WebM (最大2GB)"
            />
            {/* Uploaded file indicator */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                <Film className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">lesson04_ai_tools_overview.mp4</p>
                <p className="text-xs text-slate-400">245 MB | 20:00</p>
              </div>
              <button className="text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Teaching Materials */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-700">教材ファイル</label>
              <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
                <Plus className="w-4 h-4" />
                ファイルを追加
              </button>
            </div>
            <div className="space-y-2">
              {materials.map((file) => (
                <div key={file.id} className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      file.type === "pdf" ? "bg-red-50" : "bg-green-50"
                    }`}
                  >
                    {file.type === "pdf" ? (
                      <FileText className="w-4 h-4 text-red-500" />
                    ) : (
                      <Image className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                    <p className="text-xs text-slate-400">{file.size}</p>
                  </div>
                  <button
                    onClick={() => removeMaterial(file.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Tuber Comments */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">AI Tuberコメント設定</label>
            <p className="text-xs text-slate-400">動画の再生タイミングに合わせてAI Tuberが自動コメントを表示します。</p>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="space-y-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-xl group">
                    <span className="px-2.5 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-bold font-mono whitespace-nowrap">
                      {comment.time}
                    </span>
                    <p className="flex-1 text-sm text-slate-600 truncate">{comment.text}</p>
                    <button
                      onClick={() => removeComment(comment.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add new comment */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="00:00"
                  value={newCommentTime}
                  onChange={(e) => setNewCommentTime(e.target.value)}
                  className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center font-mono text-slate-700 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  placeholder="コメントを入力..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={addComment}
                  className="px-3 py-2 bg-cyan-50 text-cyan-600 hover:bg-cyan-100 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Assignment Settings */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">課題設定</label>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">課題タイトル</label>
                <input
                  type="text"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">説明</label>
                <textarea
                  rows={3}
                  value={assignmentDesc}
                  onChange={(e) => setAssignmentDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                  placeholder="課題の詳しい説明を入力..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">提出形式</label>
                <select
                  value={submissionFormat}
                  onChange={(e) => setSubmissionFormat(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-cyan-500 shadow-sm"
                >
                  <option value="file">ファイルアップロード</option>
                  <option value="url">URL提出</option>
                  <option value="text">テキスト入力</option>
                  <option value="figma">Figmaリンク</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">評価基準</label>
                <textarea
                  rows={4}
                  value={evaluationCriteria}
                  onChange={(e) => setEvaluationCriteria(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                  placeholder="評価のポイントを記載..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 pb-8">
            <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
              <Eye className="w-4 h-4" />
              プレビュー
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
              <Save className="w-4 h-4" />
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
