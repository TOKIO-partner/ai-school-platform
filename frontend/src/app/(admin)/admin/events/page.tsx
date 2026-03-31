"use client";

import { Plus, Calendar, User, Users, Pencil, Copy, Trash2 } from "lucide-react";

type EventType = "ワークショップ" | "シンポジウム" | "ウェビナー";
type EventStatus = "公開中" | "下書き";

interface EventData {
  id: number;
  title: string;
  type: EventType;
  status: EventStatus;
  date: string;
  instructor: string;
  attendees: number;
  capacity: number;
  percentage: number;
}

const typeBadgeStyles: Record<EventType, string> = {
  ワークショップ: "bg-blue-50 text-blue-600 border-blue-200",
  シンポジウム: "bg-purple-50 text-purple-600 border-purple-200",
  ウェビナー: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const progressBarStyles: Record<EventType, string> = {
  ワークショップ: "from-blue-400 to-cyan-400",
  シンポジウム: "from-purple-400 to-fuchsia-400",
  ウェビナー: "from-emerald-400 to-green-400",
};

const statusBadgeStyles: Record<EventStatus, string> = {
  公開中: "bg-green-50 text-green-600 border-green-200",
  下書き: "bg-slate-100 text-slate-500 border-slate-200",
};

const events: EventData[] = [
  {
    id: 1,
    title: "ChatGPTプロンプトワークショップ",
    type: "ワークショップ",
    status: "公開中",
    date: "2026/03/20 14:00-16:00",
    instructor: "高橋雄太",
    attendees: 18,
    capacity: 30,
    percentage: 60,
  },
  {
    id: 2,
    title: "画像生成AI最新動向シンポジウム",
    type: "シンポジウム",
    status: "公開中",
    date: "2026/03/25 13:00-17:00",
    instructor: "中村あかり",
    attendees: 12,
    capacity: 20,
    percentage: 60,
  },
  {
    id: 3,
    title: "AI時代のキャリアウェビナー",
    type: "ウェビナー",
    status: "公開中",
    date: "2026/04/01 19:00-20:30",
    instructor: "山本健太郎",
    attendees: 45,
    capacity: 100,
    percentage: 45,
  },
  {
    id: 4,
    title: "Python基礎ハンズオン",
    type: "ワークショップ",
    status: "下書き",
    date: "2026/04/05 10:00-12:00",
    instructor: "鈴木大輔",
    attendees: 0,
    capacity: 25,
    percentage: 0,
  },
];

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">イベント一覧</h2>
          <p className="text-slate-500 text-sm">
            全 <span className="font-bold text-slate-700">{events.length}</span> 件のイベント
          </p>
        </div>
        <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          イベントを作成
        </button>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Type + Status Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${typeBadgeStyles[event.type]}`}
              >
                {event.type}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadgeStyles[event.status]}`}
              >
                {event.status}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-slate-800 text-lg leading-tight mb-4">
              {event.title}
            </h3>

            {/* Event Details */}
            <div className="space-y-2 text-sm text-slate-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span>講師: {event.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span>
                  参加者: <span className="font-bold text-slate-800">{event.attendees}</span> / {event.capacity}名
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>参加率</span>
                <span className="font-medium">{event.percentage}%</span>
              </div>
              <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${
                    event.percentage > 0
                      ? progressBarStyles[event.type]
                      : "from-slate-300 to-slate-400"
                  }`}
                  style={{ width: `${event.percentage}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
              <button className="flex-1 px-3 py-2 text-xs font-medium text-cyan-600 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Pencil className="w-3 h-3" />
                編集
              </button>
              <button className="flex-1 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Copy className="w-3 h-3" />
                複製
              </button>
              <button className="flex-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Trash2 className="w-3 h-3" />
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
