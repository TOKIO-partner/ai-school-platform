"use client";

import { useState } from "react";
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  UserX,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReportStatus = "未対応" | "対応中" | "解決済み";
type ReportReason = "誹謗中傷" | "スパム" | "不適切コンテンツ" | "ハラスメント";
type TabId = "reports" | "all" | "restricted";

interface Report {
  id: number;
  reporter: { name: string; initials: string; gradient: string };
  target: { name: string; initials: string; gradient: string };
  content: string;
  reason: ReportReason;
  date: string;
  status: ReportStatus;
}

interface Post {
  id: number;
  author: { name: string; initials: string; gradient: string };
  content: string;
  date: string;
  likes: number;
  comments: number;
}

interface RestrictedUser {
  id: number;
  user: { name: string; initials: string; gradient: string };
  restrictionType: string;
  date: string;
  duration: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const reports: Report[] = [
  {
    id: 1,
    reporter: { name: "田中翔", initials: "田", gradient: "from-cyan-400 to-blue-500" },
    target: { name: "匿名ユーザーA", initials: "匿", gradient: "from-fuchsia-400 to-purple-500" },
    content: "他のユーザーを中傷する...",
    reason: "誹謗中傷",
    date: "2026/03/12 15:30",
    status: "未対応",
  },
  {
    id: 2,
    reporter: { name: "鈴木美咲", initials: "鈴", gradient: "from-green-400 to-emerald-500" },
    target: { name: "マーケットBot", initials: "M", gradient: "from-orange-400 to-red-500" },
    content: "無関係な広告リンクを...",
    reason: "スパム",
    date: "2026/03/12 12:00",
    status: "対応中",
  },
  {
    id: 3,
    reporter: { name: "山田太郎", initials: "山", gradient: "from-violet-400 to-indigo-500" },
    target: { name: "ユーザーB", initials: "B", gradient: "from-pink-400 to-rose-500" },
    content: "不適切な画像が含まれ...",
    reason: "不適切コンテンツ",
    date: "2026/03/11 18:45",
    status: "解決済み",
  },
  {
    id: 4,
    reporter: { name: "高橋優子", initials: "高", gradient: "from-amber-400 to-yellow-500" },
    target: { name: "ユーザーC", initials: "C", gradient: "from-fuchsia-400 to-purple-500" },
    content: "繰り返し嫌がらせの...",
    reason: "ハラスメント",
    date: "2026/03/11 10:20",
    status: "未対応",
  },
];

const posts: Post[] = [
  {
    id: 1,
    author: { name: "田中翔", initials: "田", gradient: "from-cyan-400 to-blue-500" },
    content: "AIプロンプトの書き方について質問があります...",
    date: "2026/03/12 16:00",
    likes: 12,
    comments: 5,
  },
  {
    id: 2,
    author: { name: "鈴木美咲", initials: "鈴", gradient: "from-green-400 to-emerald-500" },
    content: "今日のライブ講義とても勉強になりました！...",
    date: "2026/03/12 14:30",
    likes: 24,
    comments: 8,
  },
  {
    id: 3,
    author: { name: "山田太郎", initials: "山", gradient: "from-violet-400 to-indigo-500" },
    content: "課題の提出方法がわからないのですが...",
    date: "2026/03/12 11:15",
    likes: 3,
    comments: 12,
  },
  {
    id: 4,
    author: { name: "高橋優子", initials: "高", gradient: "from-amber-400 to-yellow-500" },
    content: "コース修了しました！証明書を共有します...",
    date: "2026/03/11 20:00",
    likes: 45,
    comments: 15,
  },
  {
    id: 5,
    author: { name: "佐藤健一", initials: "佐", gradient: "from-fuchsia-400 to-pink-500" },
    content: "おすすめのAIツールをまとめてみました...",
    date: "2026/03/11 18:00",
    likes: 38,
    comments: 10,
  },
];

const restrictedUsers: RestrictedUser[] = [
  {
    id: 1,
    user: { name: "匿名ユーザーA", initials: "匿", gradient: "from-fuchsia-400 to-purple-500" },
    restrictionType: "投稿制限",
    date: "2026/03/12",
    duration: "7日間",
  },
  {
    id: 2,
    user: { name: "マーケットBot", initials: "M", gradient: "from-orange-400 to-red-500" },
    restrictionType: "ミュート",
    date: "2026/03/11",
    duration: "30日間",
  },
  {
    id: 3,
    user: { name: "ユーザーC", initials: "C", gradient: "from-fuchsia-400 to-purple-500" },
    restrictionType: "一時停止",
    date: "2026/03/10",
    duration: "14日間",
  },
];

// ---------------------------------------------------------------------------
// Badge helpers
// ---------------------------------------------------------------------------

const reasonBadgeColors: Record<ReportReason, string> = {
  "誹謗中傷": "bg-red-50 text-red-600 border-red-200",
  "スパム": "bg-orange-50 text-orange-600 border-orange-200",
  "不適切コンテンツ": "bg-purple-50 text-purple-600 border-purple-200",
  "ハラスメント": "bg-red-50 text-red-600 border-red-200",
};

const statusBadgeColors: Record<ReportStatus, string> = {
  "未対応": "bg-red-50 text-red-600 border-red-200",
  "対応中": "bg-yellow-50 text-yellow-600 border-yellow-200",
  "解決済み": "bg-green-50 text-green-600 border-green-200",
};

// ---------------------------------------------------------------------------
// Tabs config
// ---------------------------------------------------------------------------

const tabs: { id: TabId; label: string; badge?: number }[] = [
  { id: "reports", label: "通報キュー", badge: 3 },
  { id: "all", label: "全投稿" },
  { id: "restricted", label: "制限ユーザー" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminCommunityPage() {
  const [activeTab, setActiveTab] = useState<TabId>("reports");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReports =
    statusFilter === "all"
      ? reports
      : reports.filter((r) => r.status === statusFilter);

  return (
    <>
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Posts */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">総投稿数</p>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">1,234</p>
        </div>

        {/* Reports */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">通報件数</p>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">18</p>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">対応済み</p>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">12</p>
        </div>

        {/* Restricted Users */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500 font-medium">制限ユーザー</p>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <UserX className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">3</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-1 pb-3 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-cyan-600 border-b-2 border-cyan-500 font-bold"
                  : "text-slate-500 hover:text-slate-700 border-b-2 border-transparent hover:border-slate-300"
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-600 font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content: 通報キュー */}
      {activeTab === "reports" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Table header bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              通報一覧
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">すべてのステータス</option>
                <option value="未対応">未対応</option>
                <option value="対応中">対応中</option>
                <option value="解決済み">解決済み</option>
              </select>
            </div>
          </div>

          {/* Report Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-3">通報者</th>
                  <th className="px-6 py-3">対象ユーザー</th>
                  <th className="px-6 py-3">投稿内容</th>
                  <th className="px-6 py-3">通報理由</th>
                  <th className="px-6 py-3">日時</th>
                  <th className="px-6 py-3">ステータス</th>
                  <th className="px-6 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    {/* Reporter */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          initials={report.reporter.initials}
                          gradient={report.reporter.gradient}
                          size="sm"
                        />
                        <span className="font-medium text-slate-800">
                          {report.reporter.name}
                        </span>
                      </div>
                    </td>

                    {/* Target User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          initials={report.target.initials}
                          gradient={report.target.gradient}
                          size="sm"
                        />
                        <span className="font-medium text-slate-800">
                          {report.target.name}
                        </span>
                      </div>
                    </td>

                    {/* Content excerpt */}
                    <td className="px-6 py-4 max-w-[200px]">
                      <p className="truncate text-slate-600">{report.content}</p>
                    </td>

                    {/* Reason badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${reasonBadgeColors[report.reason]}`}
                      >
                        {report.reason}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {report.date}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadgeColors[report.status]}`}
                      >
                        {report.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button className="px-2 py-1 text-xs font-medium text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                          確認
                        </button>
                        <button className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          削除
                        </button>
                        <button className="px-2 py-1 text-xs font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          警告
                        </button>
                        <button className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                          ミュート
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: 全投稿 */}
      {activeTab === "all" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-500" />
              全投稿一覧
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-3">投稿者</th>
                  <th className="px-6 py-3">投稿内容</th>
                  <th className="px-6 py-3">日時</th>
                  <th className="px-6 py-3">いいね</th>
                  <th className="px-6 py-3">コメント</th>
                  <th className="px-6 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          initials={post.author.initials}
                          gradient={post.author.gradient}
                          size="sm"
                        />
                        <span className="font-medium text-slate-800">
                          {post.author.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[300px]">
                      <p className="truncate text-slate-600">{post.content}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {post.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-500">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{post.likes}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-500">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{post.comments}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button className="px-2 py-1 text-xs font-medium text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                          確認
                        </button>
                        <button className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: 制限ユーザー */}
      {activeTab === "restricted" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <UserX className="w-4 h-4 text-amber-500" />
              制限中ユーザー一覧
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-3">ユーザー</th>
                  <th className="px-6 py-3">制限種別</th>
                  <th className="px-6 py-3">制限日</th>
                  <th className="px-6 py-3">期間</th>
                  <th className="px-6 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {restrictedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          initials={user.user.initials}
                          gradient={user.user.gradient}
                          size="sm"
                        />
                        <span className="font-medium text-slate-800">
                          {user.user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
                        {user.restrictionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {user.date}
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-sm font-medium">
                      {user.duration}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button className="px-2 py-1 text-xs font-medium text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                          詳細
                        </button>
                        <button className="px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          解除
                        </button>
                        <button className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          永久BAN
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
