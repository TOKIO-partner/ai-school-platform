"use client";

import { useState } from "react";
import { Calendar, Clock, Radio, User } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EventBadge =
  | { type: "live"; label: string }
  | { type: "tag"; label: string; textColor: string; bgColor: string };

interface EventData {
  id: number;
  title: string;
  gradient: string;
  badge: EventBadge;
  date: string;
  time: string;
  description: string;
  organizer: string;
  participantAvatars: number;
  participantCount: string;
  remainingSeats?: string;
  attended: boolean;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const events: EventData[] = [
  {
    id: 1,
    title: "AIデザインワークショップ",
    gradient: "linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 100%)",
    badge: { type: "live", label: "Live" },
    date: "明日 - 2024年3月16日",
    time: "19:00 - 21:00",
    description:
      "AIツールを活用したデザインワークフローの実践ワークショップ。Figma + MidjourneyでUIを高速プロトタイピング。",
    organizer: "講師: 山田 太郎",
    participantAvatars: 3,
    participantCount: "42名参加",
    remainingSeats: "残り8席",
    attended: false,
  },
  {
    id: 2,
    title: "もくもく会 #24",
    gradient: "linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)",
    badge: {
      type: "tag",
      label: "Meetup",
      textColor: "text-amber-800",
      bgColor: "bg-amber-200",
    },
    date: "今週土曜日 - 2024年3月18日",
    time: "14:00 - 17:00",
    description:
      "各自のプロジェクトを持ち寄って黙々と作業する会。作業後のLT発表タイムあり。初参加歓迎！",
    organizer: "主催: コミュニティ運営チーム",
    participantAvatars: 2,
    participantCount: "18名参加",
    attended: false,
  },
  {
    id: 3,
    title: "React最新動向ウェビナー",
    gradient: "linear-gradient(135deg, #e0e7ff 0%, #4f46e5 100%)",
    badge: {
      type: "tag",
      label: "Webinar",
      textColor: "text-indigo-800",
      bgColor: "bg-indigo-200",
    },
    date: "来週水曜日 - 2024年3月22日",
    time: "20:00 - 21:30",
    description:
      "React 19の新機能とServer Componentsの実践的な活用方法を解説。Q&Aセッション付き。",
    organizer: "講師: 佐藤 健一",
    participantAvatars: 4,
    participantCount: "89名参加",
    attended: false,
  },
  {
    id: 4,
    title: "ポートフォリオレビュー会",
    gradient: "linear-gradient(135deg, #fce7f3 0%, #db2777 100%)",
    badge: {
      type: "tag",
      label: "Review",
      textColor: "text-pink-800",
      bgColor: "bg-pink-200",
    },
    date: "来週金曜日 - 2024年3月24日",
    time: "19:00 - 20:30",
    description:
      "プロのデザイナー・エンジニアがあなたのポートフォリオを直接レビュー。具体的なフィードバックで実力アップ。",
    organizer: "レビュワー: メンターチーム",
    participantAvatars: 2,
    participantCount: "12名参加",
    remainingSeats: "残り3席",
    attended: false,
  },
];

// ---------------------------------------------------------------------------
// Filter tabs
// ---------------------------------------------------------------------------

type FilterTab = "upcoming" | "attended";

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "upcoming", label: "今後のイベント" },
  { key: "attended", label: "参加済み" },
];

// ---------------------------------------------------------------------------
// Participant avatar colors
// ---------------------------------------------------------------------------

const avatarColors = [
  "bg-slate-200",
  "bg-slate-300",
  "bg-slate-400",
  "bg-slate-500",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("upcoming");

  const filteredEvents = events.filter((event) =>
    activeTab === "upcoming" ? !event.attended : event.attended,
  );

  return (
    <>
      {/* Header & Filter */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">イベント一覧</h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={
              activeTab === tab.key
                ? "px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-md"
                : "px-5 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">イベントはまだありません</p>
          </div>
        )}

        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="group rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Banner */}
            <div
              className="h-40 w-full relative"
              style={{ background: event.gradient }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
              <div className="absolute top-3 left-3">
                {event.badge.type === "live" ? (
                  <span className="text-xs font-bold text-white bg-red-500 px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                    <Radio className="w-3 h-3" /> {event.badge.label}
                  </span>
                ) : (
                  <span
                    className={`text-xs font-bold ${event.badge.textColor} ${event.badge.bgColor} px-2.5 py-1 rounded-full shadow-sm`}
                  >
                    {event.badge.label}
                  </span>
                )}
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="text-white font-bold text-xl drop-shadow-lg">
                  {event.title}
                </h4>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  {event.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  {event.time}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{event.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="w-3 h-3" />
                  {event.organizer}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {Array.from({ length: event.participantAvatars }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-full ${avatarColors[i % avatarColors.length]} border-2 border-white`}
                        />
                      ),
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {event.participantCount}{" "}
                    {event.remainingSeats && (
                      <span className="text-amber-600 font-medium">
                        {event.remainingSeats}
                      </span>
                    )}
                  </span>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                  参加する
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
