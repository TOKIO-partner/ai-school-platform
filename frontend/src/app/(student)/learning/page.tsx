"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Check, Play, Lock, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useCourse } from "@/lib/queries/use-courses";
import { useMyEnrollments } from "@/lib/queries/use-enrollments";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SidePanelTab = "ai-chat" | "assignment";

interface ChatMessage {
  id: string;
  role: "ai" | "user";
  label?: string;
  content: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  video_url: string;
  status: "completed" | "in-progress" | "locked";
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const sampleVideos = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
];

const initialChatMessages: ChatMessage[] = [
  {
    id: "1",
    role: "ai",
    label: "AI Coach",
    content:
      "こんにちは！AIコーチの「アイ」です。前回の課題、配色のバランスがとても良くなりましたね。今日はFlexboxの復習から始めましょうか？",
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** CSS-art AI Tuber character overlay shown on the video player */
function AiTuberOverlay() {
  return (
    <div className="absolute bottom-4 right-4 w-32 h-32 md:w-48 md:h-48 pointer-events-none z-10">
      <div className="relative w-full h-full filter drop-shadow-xl">
        {/* CSS Art: AI Tuber Character (Female) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-40 flex items-end justify-center">
          {/* Hair (Back) */}
          <div className="absolute top-4 w-28 h-32 bg-indigo-500 rounded-full" />
          <div className="absolute top-10 -left-2 w-8 h-24 bg-indigo-500 rounded-full rotate-12" />
          <div className="absolute top-10 -right-2 w-8 h-24 bg-indigo-500 rounded-full -rotate-12" />

          {/* Body */}
          <div className="absolute bottom-0 w-24 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-t-3xl z-10" />
          <div className="absolute bottom-0 w-16 h-12 bg-white/20 rounded-t-xl z-20" />

          {/* Neck */}
          <div className="absolute bottom-14 w-8 h-8 bg-orange-200 z-10" />

          {/* Face */}
          <div className="absolute top-8 w-20 h-24 bg-orange-100 rounded-3xl z-20 shadow-sm flex flex-col items-center justify-center">
            {/* Bangs */}
            <div className="absolute -top-2 w-22 h-10 bg-indigo-500 rounded-t-full rounded-b-lg z-30" />

            {/* Eyes */}
            <div className="flex gap-4 mt-2 z-30">
              <div className="w-3 h-4 bg-slate-800 rounded-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              <div className="w-3 h-4 bg-slate-800 rounded-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            {/* Cheeks */}
            <div className="flex gap-8 mt-1 z-20 absolute top-12">
              <div className="w-3 h-2 bg-pink-300/50 rounded-full blur-sm" />
              <div className="w-3 h-2 bg-pink-300/50 rounded-full blur-sm" />
            </div>

            {/* Mouth */}
            <div className="w-2 h-1 bg-pink-400 rounded-full mt-2 animate-pulse z-30" />
          </div>

          {/* Headphones */}
          <div className="absolute top-12 -left-2 w-4 h-10 bg-cyan-400 rounded-lg z-30 border-2 border-white" />
          <div className="absolute top-12 -right-2 w-4 h-10 bg-cyan-400 rounded-lg z-30 border-2 border-white" />
          <div className="absolute top-6 left-0 right-0 h-8 border-t-4 border-cyan-400 rounded-t-full z-20" />
        </div>

        {/* Speech Bubble */}
        <div className="absolute top-0 right-0 bg-white/95 backdrop-blur-md border-2 border-cyan-200 p-3 rounded-2xl rounded-bl-none text-xs text-slate-700 max-w-[150px] animate-fade-in-up shadow-lg font-bold flex flex-col gap-1 z-40">
          <span className="text-[10px] text-fuchsia-500">AI Coach Eye</span>
          <span>
            ここは重要ポイントです！
            <br />
            メモしておきましょう
          </span>
        </div>
      </div>
    </div>
  );
}

/** HTML5 video player with native controls */
function VideoPlayer({
  lesson,
  aiTuberEnabled,
}: {
  lesson: Lesson;
  aiTuberEnabled: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [lesson.video_url]);

  return (
    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-200 ring-4 ring-slate-100">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        autoPlay={false}
        preload="metadata"
        key={lesson.id}
      >
        <source src={lesson.video_url} type="video/mp4" />
        お使いのブラウザは動画再生に対応していません。
      </video>

      {/* AI Tuber Overlay */}
      {aiTuberEnabled && <AiTuberOverlay />}
    </div>
  );
}

/** Lesson navigation panel below the video */
function LessonNav({
  chapters,
  courseTitle,
  currentLessonId,
  onSelectLesson,
  aiTuberEnabled,
  onToggleAiTuber,
}: {
  chapters: Chapter[];
  courseTitle: string;
  currentLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
  aiTuberEnabled: boolean;
  onToggleAiTuber: () => void;
}) {
  // Auto-expand chapter containing current lesson
  const currentChapterId = chapters.find((ch) =>
    ch.lessons.some((l) => l.id === currentLessonId)
  )?.id;

  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(currentChapterId ? [currentChapterId] : [])
  );

  // Re-expand when current chapter changes (e.g. after data loads)
  useEffect(() => {
    if (currentChapterId) {
      setExpandedChapters((prev) => new Set([...prev, currentChapterId]));
    }
  }, [currentChapterId]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const currentLesson = chapters.flatMap((ch) => ch.lessons).find((l) => l.id === currentLessonId);

  return (
    <div className="mt-4 bg-white border border-slate-200 rounded-2xl flex-1 overflow-y-auto shadow-sm">
      {/* Current lesson header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-start">
        <div>
          <h1 className="text-lg font-bold text-slate-800">
            {currentLesson?.title}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{courseTitle}</p>
        </div>
        <button
          onClick={onToggleAiTuber}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors shrink-0 ${
            aiTuberEnabled
              ? "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600"
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
        >
          AI Tuber: {aiTuberEnabled ? "ON" : "OFF"}
        </button>
      </div>

      {/* Chapter/Lesson list */}
      <div className="divide-y divide-slate-100">
        {chapters.map((chapter) => {
          const isExpanded = expandedChapters.has(chapter.id);
          const completedCount = chapter.lessons.filter((l) => l.status === "completed").length;

          return (
            <div key={chapter.id}>
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="text-sm font-semibold text-slate-700 flex-1">
                  {chapter.title}
                </span>
                <span className="text-xs text-slate-400">
                  {completedCount}/{chapter.lessons.length}
                </span>
              </button>

              {isExpanded && (
                <div className="pb-1">
                  {chapter.lessons.map((lesson) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const isLocked = lesson.status === "locked";

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !isLocked && onSelectLesson(lesson)}
                        disabled={isLocked}
                        className={`w-full flex items-center gap-3 px-4 pl-10 py-2.5 text-left transition-colors ${
                          isCurrent
                            ? "bg-cyan-50 border-l-2 border-cyan-500"
                            : isLocked
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-slate-50 cursor-pointer"
                        }`}
                      >
                        {/* Status icon */}
                        <span className="shrink-0">
                          {lesson.status === "completed" ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : lesson.status === "in-progress" || isCurrent ? (
                            <Play className="w-4 h-4 text-cyan-500 fill-cyan-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-300" />
                          )}
                        </span>
                        <span
                          className={`text-sm flex-1 ${
                            isCurrent
                              ? "font-semibold text-cyan-700"
                              : isLocked
                                ? "text-slate-400"
                                : "text-slate-600"
                          }`}
                        >
                          {lesson.title}
                        </span>
                        <span className="text-xs text-slate-400 shrink-0">
                          {lesson.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** AI Chat tab content */
function AiChatPanel({
  messages,
  inputValue,
  onInputChange,
  onSend,
}: {
  messages: ChatMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "ai" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.role === "ai"
                  ? "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
                  : "bg-cyan-500 text-white rounded-tr-sm"
              }`}
            >
              {msg.label && (
                <span className="block text-xs text-fuchsia-500 font-bold mb-1">
                  {msg.label}
                </span>
              )}
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative">
          <input
            type="text"
            placeholder="AIに質問する..."
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                onSend();
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-3 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
          />
          <button
            onClick={onSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-cyan-500 hover:bg-cyan-50 rounded-md transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

/** Assignment submission tab content */
function AssignmentPanel() {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h4 className="font-bold text-slate-800 text-sm mb-2">
          課題: カラーパレットの生成
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed mb-3">
          AIツールを使って、指定されたテーマに合うカラーパレットを3パターン生成し、それぞれの選定理由をまとめてください。
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 font-medium">
            未提出
          </span>
          <span>締切: 2026/03/20</span>
        </div>
      </div>

      <div className="bg-white border border-dashed border-slate-300 rounded-xl p-6 text-center">
        <div className="text-slate-400 mb-2">
          <svg
            className="w-8 h-8 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>
        <p className="text-sm text-slate-500 font-medium mb-1">
          ファイルをドラッグ＆ドロップ
        </p>
        <p className="text-xs text-slate-400">
          または
          <button className="text-cyan-500 hover:underline ml-1">
            ファイルを選択
          </button>
        </p>
      </div>

      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
        課題を提出する
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Data mapping helpers
// ---------------------------------------------------------------------------

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<SidePanelTab>("ai-chat");
  const [aiTuberEnabled, setAiTuberEnabled] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialChatMessages);
  const [chatInput, setChatInput] = useState("");

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useMyEnrollments();
  const firstEnrollment = enrollmentsData?.results?.[0];
  const enrollmentCourseId = firstEnrollment?.course?.id;

  const { data: courseData, isLoading: courseLoading } = useCourse(
    enrollmentCourseId ?? 0
  );

  const isLoading = enrollmentsLoading || (!!enrollmentCourseId && courseLoading);

  // Derive chapters from API data
  const { chapters, courseTitle, defaultLesson } = (() => {
    if (!courseData || !firstEnrollment) {
      return { chapters: [] as Chapter[], courseTitle: "", defaultLesson: null as Lesson | null };
    }

    const progressPercent = Number(firstEnrollment.progress_percent ?? 0);
    const apiChapters = courseData.chapters ?? [];
    const allApiLessons = apiChapters.flatMap((ch) => ch.lessons ?? []);
    const totalLessons = allApiLessons.length;
    const completedCount = Math.round((progressPercent / 100) * totalLessons);

    let lessonIndex = 0;
    const mappedChapters: Chapter[] = apiChapters.map((ch) => ({
      id: String(ch.id),
      title: ch.title,
      lessons: (ch.lessons ?? []).map((l): Lesson => {
        const idx = lessonIndex++;
        let status: Lesson["status"];
        if (idx < completedCount) {
          status = "completed";
        } else if (idx === completedCount) {
          status = "in-progress";
        } else {
          status = "locked";
        }
        const videoUrl = l.video_url || sampleVideos[idx % sampleVideos.length];
        const duration = l.duration_label || formatDuration(l.duration_seconds ?? 0);
        return {
          id: String(l.id),
          title: l.title,
          duration,
          video_url: videoUrl,
          status,
        };
      }),
    }));

    const flat = mappedChapters.flatMap((ch) => ch.lessons);
    const def =
      flat.find((l) => l.status === "in-progress") ?? flat[0] ?? null;

    return {
      chapters: mappedChapters,
      courseTitle: courseData.title,
      defaultLesson: def,
    };
  })();

  // Set initial lesson once data arrives
  useEffect(() => {
    if (!currentLesson && defaultLesson) {
      setCurrentLesson(defaultLesson);
    }
  }, [defaultLesson, currentLesson]);

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        label: "AI Coach",
        content:
          "良い質問ですね！それについて詳しく説明しましょう。今回のレッスンのポイントと合わせて考えてみてください。",
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  const sidePanelTabs: { key: SidePanelTab; label: string }[] = [
    { key: "ai-chat", label: "AI Chat" },
    { key: "assignment", label: "課題提出" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          <span className="text-sm font-medium">コース情報を読み込み中...</span>
        </div>
      </div>
    );
  }

  // No enrollments state
  if (!currentLesson || chapters.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <p className="text-sm font-medium">受講中のコースがありません。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Main Content (Video + Lesson Nav) */}
      <div className="flex-1 flex flex-col min-h-0">
        <VideoPlayer lesson={currentLesson} aiTuberEnabled={aiTuberEnabled} />
        <LessonNav
          chapters={chapters}
          courseTitle={courseTitle}
          currentLessonId={currentLesson.id}
          onSelectLesson={setCurrentLesson}
          aiTuberEnabled={aiTuberEnabled}
          onToggleAiTuber={() => setAiTuberEnabled((prev) => !prev)}
        />
      </div>

      {/* Side Panel (AI Support) */}
      <div className="w-full lg:w-96 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100">
          {sidePanelTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-slate-800 border-b-2 border-cyan-500 bg-cyan-50/30"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "ai-chat" ? (
          <AiChatPanel
            messages={chatMessages}
            inputValue={chatInput}
            onInputChange={setChatInput}
            onSend={handleSendMessage}
          />
        ) : (
          <AssignmentPanel />
        )}
      </div>
    </div>
  );
}
