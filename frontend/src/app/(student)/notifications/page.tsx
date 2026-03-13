"use client";

import { useState, useCallback } from "react";
import {
  Bell,
  CheckCheck,
  MessageCircle,
  Calendar,
  CheckCircle,
  Gift,
  FileText,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NotificationCategory = "すべて" | "システム" | "講師" | "イベント";

type NotificationTag =
  | "システム通知"
  | "講師メッセージ"
  | "イベント告知"
  | "課題フィードバック";

interface Notification {
  id: number;
  title: string;
  body: string;
  tag: NotificationTag;
  time: string;
  isRead: boolean;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
  tagColorClass: string;
  tagBgClass: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const filterTabs: NotificationCategory[] = [
  "すべて",
  "システム",
  "講師",
  "イベント",
];

const tagToCategoryMap: Record<NotificationTag, NotificationCategory> = {
  システム通知: "システム",
  講師メッセージ: "講師",
  イベント告知: "イベント",
  課題フィードバック: "すべて",
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "システムメンテナンスのお知らせ",
    body: "3月15日 AM2:00〜AM5:00 にシステムメンテナンスを実施いたします。メンテナンス中はサービスをご利用いただけません。",
    tag: "システム通知",
    time: "5分前",
    isRead: false,
    icon: Bell,
    iconColorClass: "text-cyan-600",
    iconBgClass: "bg-cyan-50",
    tagColorClass: "text-cyan-600",
    tagBgClass: "bg-cyan-50",
  },
  {
    id: 2,
    title: "田中先生からメッセージが届いています",
    body: "「Webデザイン基礎」の課題について、フィードバックをお送りしました。ご確認の上、修正をお願いいたします。",
    tag: "講師メッセージ",
    time: "30分前",
    isRead: false,
    icon: MessageCircle,
    iconColorClass: "text-fuchsia-600",
    iconBgClass: "bg-fuchsia-50",
    tagColorClass: "text-fuchsia-600",
    tagBgClass: "bg-fuchsia-50",
  },
  {
    id: 3,
    title: "AIデザインワークショップ開催のお知らせ",
    body: "3月20日(土) 14:00〜16:00 にオンラインワークショップを開催します。AIツールを使った実践的なデザイン手法を学びましょう。",
    tag: "イベント告知",
    time: "2時間前",
    isRead: false,
    icon: Calendar,
    iconColorClass: "text-purple-600",
    iconBgClass: "bg-purple-50",
    tagColorClass: "text-purple-600",
    tagBgClass: "bg-purple-50",
  },
  {
    id: 4,
    title: "課題「レスポンシブレイアウト」が承認されました",
    body: "提出された課題が講師により承認されました。スキルポイント +50pt を獲得しました。おめでとうございます！",
    tag: "課題フィードバック",
    time: "昨日",
    isRead: true,
    icon: CheckCircle,
    iconColorClass: "text-green-600",
    iconBgClass: "bg-green-50",
    tagColorClass: "text-green-600",
    tagBgClass: "bg-green-50",
  },
  {
    id: 5,
    title: "新しいコースが追加されました",
    body: "「AI活用 プロンプトエンジニアリング入門」コースが新たに公開されました。今すぐ確認してみましょう。",
    tag: "システム通知",
    time: "2日前",
    isRead: true,
    icon: Gift,
    iconColorClass: "text-cyan-600",
    iconBgClass: "bg-cyan-50",
    tagColorClass: "text-cyan-600",
    tagBgClass: "bg-cyan-50",
  },
  {
    id: 6,
    title: "鈴木先生からのアドバイス",
    body: "Next.jsコースの進捗が順調です。次のステップとして、APIルートの実装に挑戦してみてください。",
    tag: "講師メッセージ",
    time: "3日前",
    isRead: true,
    icon: MessageCircle,
    iconColorClass: "text-fuchsia-600",
    iconBgClass: "bg-fuchsia-50",
    tagColorClass: "text-fuchsia-600",
    tagBgClass: "bg-fuchsia-50",
  },
  {
    id: 7,
    title: "もくもく会 #23 開催レポート",
    body: "先日開催されたもくもく会のレポートが公開されました。参加者の作品ギャラリーもご覧いただけます。",
    tag: "イベント告知",
    time: "5日前",
    isRead: true,
    icon: Calendar,
    iconColorClass: "text-purple-600",
    iconBgClass: "bg-purple-50",
    tagColorClass: "text-purple-600",
    tagBgClass: "bg-purple-50",
  },
  {
    id: 8,
    title: "課題「Flexboxレイアウト」にコメントがつきました",
    body: "講師からのコメント:「全体的によくできていますが、レスポンシブ対応の部分をもう少し改善してみましょう。」",
    tag: "課題フィードバック",
    time: "1週間前",
    isRead: true,
    icon: FileText,
    iconColorClass: "text-amber-600",
    iconBgClass: "bg-amber-50",
    tagColorClass: "text-amber-600",
    tagBgClass: "bg-amber-50",
  },
];

// ---------------------------------------------------------------------------
// Helper: filter notifications by category
// ---------------------------------------------------------------------------

function filterByCategory(
  notifications: Notification[],
  category: NotificationCategory
): Notification[] {
  if (category === "すべて") return notifications;
  return notifications.filter((n) => {
    // "課題フィードバック" doesn't map to a specific tab, so it only shows in "すべて"
    return tagToCategoryMap[n.tag] === category;
  });
}

// ---------------------------------------------------------------------------
// Notification Item Component
// ---------------------------------------------------------------------------

function NotificationItem({
  notification,
  onToggleRead,
}: {
  notification: Notification;
  onToggleRead: (id: number) => void;
}) {
  const Icon = notification.icon;
  const isUnread = !notification.isRead;

  return (
    <div
      onClick={() => onToggleRead(notification.id)}
      className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        isUnread ? "border-l-4 border-l-cyan-500" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-full ${notification.iconBgClass} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-5 h-5 ${notification.iconColorClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={`text-sm ${
                isUnread
                  ? "font-bold text-slate-800"
                  : "font-medium text-slate-600"
              }`}
            >
              {notification.title}
            </h3>
            <span className="text-xs text-slate-400 shrink-0 ml-4">
              {notification.time}
            </span>
          </div>
          <p
            className={`text-sm leading-relaxed ${
              isUnread ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {notification.body}
          </p>
          <span
            className={`inline-block mt-2 text-xs ${notification.tagColorClass} ${notification.tagBgClass} px-2 py-0.5 rounded font-medium`}
          >
            {notification.tag}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [activeFilter, setActiveFilter] =
    useState<NotificationCategory>("すべて");

  const handleToggleRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const filtered = filterByCategory(notifications, activeFilter);
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">お知らせ</h2>
        <button
          onClick={handleMarkAllAsRead}
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
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-sm text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-400">
              このカテゴリにはお知らせがありません
            </p>
          </div>
        ) : (
          filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onToggleRead={handleToggleRead}
            />
          ))
        )}
      </div>
    </div>
  );
}
