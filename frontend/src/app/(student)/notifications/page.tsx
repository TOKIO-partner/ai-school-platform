"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  MessageCircle,
  Calendar,
  CheckCircle,
  Gift,
} from "lucide-react";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/lib/queries/use-notifications";
import type { Notification } from "@/types";

// ---------------------------------------------------------------------------
// Type → presentation mapping
// ---------------------------------------------------------------------------

type NotificationCategory = "すべて" | "システム" | "講師" | "イベント";

const filterTabs: NotificationCategory[] = ["すべて", "システム", "講師", "イベント"];

const typeMeta: Record<
  Notification["type"],
  {
    label: string;
    category: NotificationCategory | null;
    icon: React.ElementType;
    color: string;
    bg: string;
  }
> = {
  system: { label: "システム通知", category: "システム", icon: Bell, color: "text-cyan-600", bg: "bg-cyan-50" },
  course: { label: "コース通知", category: "システム", icon: Gift, color: "text-cyan-600", bg: "bg-cyan-50" },
  instructor: { label: "講師メッセージ", category: "講師", icon: MessageCircle, color: "text-fuchsia-600", bg: "bg-fuchsia-50" },
  event: { label: "イベント告知", category: "イベント", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
  feedback: { label: "課題フィードバック", category: null, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
};

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "たった今";
  if (min < 60) return `${min}分前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}時間前`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}日前`;
  return `${Math.floor(day / 7)}週間前`;
}

function filterByCategory(
  notifications: Notification[],
  category: NotificationCategory
): Notification[] {
  if (category === "すべて") return notifications;
  return notifications.filter((n) => typeMeta[n.type]?.category === category);
}

// ---------------------------------------------------------------------------
// Notification Item
// ---------------------------------------------------------------------------

function NotificationItem({
  notification,
  onOpen,
}: {
  notification: Notification;
  onOpen: (n: Notification) => void;
}) {
  const meta = typeMeta[notification.type] ?? typeMeta.system;
  const Icon = meta.icon;
  const isUnread = !notification.is_read;

  return (
    <div
      onClick={() => onOpen(notification)}
      className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        isUnread ? "border-l-4 border-l-cyan-500" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full ${meta.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${meta.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-sm ${isUnread ? "font-bold text-slate-800" : "font-medium text-slate-600"}`}>
              {notification.title}
            </h3>
            <span className="text-xs text-slate-400 shrink-0 ml-4">
              {timeAgo(notification.created_at)}
            </span>
          </div>
          <p className={`text-sm leading-relaxed ${isUnread ? "text-slate-500" : "text-slate-400"}`}>
            {notification.message}
          </p>
          <span className={`inline-block mt-2 text-xs ${meta.color} ${meta.bg} px-2 py-0.5 rounded font-medium`}>
            {meta.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NotificationsPage() {
  const router = useRouter();
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [activeFilter, setActiveFilter] = useState<NotificationCategory>("すべて");

  const list = notifications ?? [];
  const filtered = filterByCategory(list, activeFilter);
  const hasUnread = list.some((n) => !n.is_read);

  function handleOpen(n: Notification) {
    if (!n.is_read) markRead.mutate(n.id);
    if (n.link) router.push(n.link);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">お知らせ</h2>
        <button
          onClick={() => markAllRead.mutate()}
          disabled={!hasUnread}
          className="px-4 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCheck className="w-4 h-4" />
          すべて既読にする
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={
              activeFilter === tab
                ? "px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md transition-all"
                : "px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-sm text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-pulse" />
            <p className="text-sm text-slate-400">読み込み中...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-sm text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-400">このカテゴリにはお知らせがありません</p>
          </div>
        ) : (
          filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onOpen={handleOpen}
            />
          ))
        )}
      </div>
    </div>
  );
}
