"use client";

import { useState } from "react";
import { Code, Play, Settings, Send } from "lucide-react";

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

interface LessonInfo {
  title: string;
  breadcrumb: string;
  summary: string;
  currentTime: string;
  totalTime: string;
  progressPercent: number;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const lessonInfo: LessonInfo = {
  title: "Lesson 4: AIを活用したカラーパレット生成",
  breadcrumb: "Webデザイン基礎コース > Chapter 2",
  summary:
    "このレッスンでは、生成AIを用いてプロジェクトの雰囲気に合った配色を自動生成し、Figmaやコーディングに適用するフローを学びます。",
  currentTime: "05:20",
  totalTime: "15:00",
  progressPercent: 33,
};

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

/** Mock video player with controls overlay */
function VideoPlayer() {
  return (
    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-200 group ring-4 ring-slate-100">
      {/* Mock Video Content */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Code className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Video Player Loading...</p>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-1 bg-white/30 rounded mb-4 cursor-pointer backdrop-blur">
          <div
            className="h-full bg-cyan-400 relative"
            style={{ width: `${lessonInfo.progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
          </div>
        </div>
        <div className="flex justify-between text-white">
          <div className="flex gap-4 items-center">
            <Play className="w-5 h-5 fill-current" />
            <span className="text-sm font-medium">
              {lessonInfo.currentTime} / {lessonInfo.totalTime}
            </span>
          </div>
          <Settings className="w-5 h-5" />
        </div>
      </div>

      {/* AI Tuber Overlay */}
      <AiTuberOverlay />
    </div>
  );
}

/** Lesson description panel below the video */
function LessonDescription({
  aiTuberEnabled,
  onToggleAiTuber,
}: {
  aiTuberEnabled: boolean;
  onToggleAiTuber: () => void;
}) {
  return (
    <div className="mt-4 p-6 bg-white border border-slate-200 rounded-2xl flex-1 overflow-y-auto shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {lessonInfo.title}
          </h1>
          <p className="text-slate-500 text-sm">{lessonInfo.breadcrumb}</p>
        </div>
        <button
          onClick={onToggleAiTuber}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
            aiTuberEnabled
              ? "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600"
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
        >
          AI Tuber: {aiTuberEnabled ? "ON" : "OFF"}
        </button>
      </div>
      <div className="prose prose-slate max-w-none">
        <h3 className="text-lg font-bold text-cyan-600">概要</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {lessonInfo.summary}
        </p>
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
// Page Component
// ---------------------------------------------------------------------------

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<SidePanelTab>("ai-chat");
  const [aiTuberEnabled, setAiTuberEnabled] = useState(true);
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialChatMessages);
  const [chatInput, setChatInput] = useState("");

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

    // Simulate AI response after a short delay
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Main Content (Video) */}
      <div className="flex-1 flex flex-col min-h-0">
        <VideoPlayer />
        <LessonDescription
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
