"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Mail, Bell, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AnnouncementStatus = "予約済み" | "送信済み" | "下書き";

interface Announcement {
  id: number;
  title: string;
  subtitle: string;
  target: string;
  channels: string[];
  scheduledAt: string;
  status: AnnouncementStatus;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const announcements: Announcement[] = [
  {
    id: 1,
    title: "システムメンテナンスのお知らせ",
    subtitle: "3/15 深夜メンテナンス",
    target: "全員",
    channels: ["メール", "アプリ"],
    scheduledAt: "2026/03/13 18:00",
    status: "予約済み",
  },
  {
    id: 2,
    title: "新コース「データ分析基礎」リリース",
    subtitle: "新コース公開のお知らせ",
    target: "全員",
    channels: ["アプリ"],
    scheduledAt: "2026/03/12 10:00",
    status: "送信済み",
  },
  {
    id: 3,
    title: "プラン改定のお知らせ",
    subtitle: "4月からの料金変更について",
    target: "個人ユーザー",
    channels: ["メール", "アプリ"],
    scheduledAt: "2026/03/10 09:00",
    status: "送信済み",
  },
  {
    id: 4,
    title: "春のキャンペーン開始",
    subtitle: "Pro年額20%OFF",
    target: "全員",
    channels: ["メール"],
    scheduledAt: "2026/03/08 12:00",
    status: "送信済み",
  },
  {
    id: 5,
    title: "コミュニティガイドライン更新",
    subtitle: "ルール改定のお知らせ",
    target: "全員",
    channels: ["アプリ"],
    scheduledAt: "2026/03/05",
    status: "下書き",
  },
];

// ---------------------------------------------------------------------------
// Style helpers
// ---------------------------------------------------------------------------

const statusBadgeClass: Record<AnnouncementStatus, string> = {
  予約済み:
    "bg-yellow-50 text-yellow-600 border border-yellow-200",
  送信済み:
    "bg-green-50 text-green-600 border border-green-200",
  下書き:
    "bg-slate-100 text-slate-500 border border-slate-200",
};

const targetBadgeClass: Record<string, string> = {
  全員: "bg-blue-50 text-blue-600 border border-blue-200",
  個人ユーザー: "bg-green-50 text-green-600 border border-green-200",
  法人ユーザー: "bg-purple-50 text-purple-600 border border-purple-200",
  特定コース受講者: "bg-orange-50 text-orange-600 border border-orange-200",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AnnouncementsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const filteredAnnouncements = useMemo(() => {
    if (!statusFilter) return announcements;
    return announcements.filter((a) => a.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            お知らせ管理
          </h2>
          <p className="text-slate-500 text-sm">
            配信済み・予約中のお知らせを管理します
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          新規作成
        </button>
      </div>

      {/* Create Form (hidden by default) */}
      {showCreateForm && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Pencil className="w-4 h-4 text-cyan-500" />
              新規お知らせ作成
            </h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                タイトル
              </label>
              <input
                type="text"
                placeholder="お知らせのタイトルを入力..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                本文
              </label>
              <textarea
                rows={4}
                placeholder="お知らせの内容を入力..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Target & Channel grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Target Segment */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  配信対象
                </label>
                <div className="space-y-2">
                  {["全員", "個人ユーザー", "法人ユーザー", "特定コース受講者"].map(
                    (label) => (
                      <label
                        key={label}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-slate-700">{label}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              {/* Channel & Schedule */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  配信チャネル
                </label>
                <div className="space-y-2">
                  {["メール", "アプリ内通知"].map((label) => (
                    <label
                      key={label}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-slate-700">{label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    配信日時
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200">
                予約送信
              </button>
              <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all duration-200">
                下書き保存
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-5 py-2.5 text-slate-500 text-sm font-medium hover:text-slate-700 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-500" />
            お知らせ一覧
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-cyan-500"
            >
              <option value="">すべてのステータス</option>
              <option value="送信済み">送信済み</option>
              <option value="予約済み">予約済み</option>
              <option value="下書き">下書き</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-3">タイトル</th>
                <th className="px-6 py-3">対象</th>
                <th className="px-6 py-3">チャネル</th>
                <th className="px-6 py-3">配信日時</th>
                <th className="px-6 py-3">ステータス</th>
                <th className="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnnouncements.map((announcement, index) => (
                <tr
                  key={announcement.id}
                  className={`${
                    index < filteredAnnouncements.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  } hover:bg-slate-50 transition-colors`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-800">
                        {announcement.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {announcement.subtitle}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        targetBadgeClass[announcement.target] ??
                        "bg-blue-50 text-blue-600 border border-blue-200"
                      }`}
                    >
                      {announcement.target}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {announcement.channels.map((channel) => (
                        <span
                          key={channel}
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            channel === "メール"
                              ? "bg-cyan-50 text-cyan-600"
                              : "bg-violet-50 text-violet-600"
                          }`}
                        >
                          {channel === "メール" ? (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              メール
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Bell className="w-3 h-3" />
                              アプリ内
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                    {announcement.scheduledAt}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeClass[announcement.status]}`}
                    >
                      {announcement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="px-2 py-1 text-xs font-medium text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors flex items-center gap-1">
                        <Pencil className="w-3 h-3" />
                        編集
                      </button>
                      <button className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAnnouncements.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400 text-sm"
                  >
                    該当するお知らせがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
