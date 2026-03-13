"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { UserAvatar } from "@/components/shared/user-avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Edit3,
  Ban,
  Brain,
  MessageCircle,
  Image,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────
type TabKey =
  | "learning"
  | "assignments"
  | "ai-log"
  | "login-history"
  | "billing-history";

interface Tab {
  key: TabKey;
  label: string;
}

interface Course {
  name: string;
  chapters: number;
  completed: number;
  instructor: string;
  progress: number;
  hours: number;
  icon: React.ReactNode;
  gradient: string;
  progressGradient: string;
  percentColor: string;
}

interface Assignment {
  course: string;
  name: string;
  date: string;
  score: string;
  status: string;
  statusVariant: "success" | "warning";
}

interface AiLogEntry {
  datetime: string;
  feature: string;
  model: string;
  modelVariant: "info" | "purple";
  tokens: string;
}

interface LoginEntry {
  datetime: string;
  ip: string;
  device: string;
  result: string;
  resultVariant: "success" | "danger";
}

interface BillingEntry {
  date: string;
  description: string;
  amount: string;
  method: string;
  status: string;
}

// ─── Mock Data ──────────────────────────────────────────
const tabs: Tab[] = [
  { key: "learning", label: "学習状況" },
  { key: "assignments", label: "課題提出" },
  { key: "ai-log", label: "AI利用ログ" },
  { key: "login-history", label: "ログイン履歴" },
  { key: "billing-history", label: "決済履歴" },
];

const courses: Course[] = [
  {
    name: "AI基礎コース",
    chapters: 12,
    completed: 9,
    instructor: "高橋 優子",
    progress: 75,
    hours: 22.3,
    icon: <Brain className="w-5 h-5 text-white" />,
    gradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
    progressGradient: "bg-gradient-to-r from-cyan-400 to-blue-500",
    percentColor: "text-cyan-600",
  },
  {
    name: "プロンプトエンジニアリング実践",
    chapters: 8,
    completed: 4,
    instructor: "山本 直樹",
    progress: 50,
    hours: 15.8,
    icon: <MessageCircle className="w-5 h-5 text-white" />,
    gradient: "bg-gradient-to-br from-fuchsia-400 to-purple-500",
    progressGradient: "bg-gradient-to-r from-fuchsia-400 to-purple-500",
    percentColor: "text-fuchsia-600",
  },
  {
    name: "画像生成AI活用講座",
    chapters: 10,
    completed: 2,
    instructor: "佐々木 恵",
    progress: 20,
    hours: 10.4,
    icon: <Image className="w-5 h-5 text-white" />,
    gradient: "bg-gradient-to-br from-amber-400 to-orange-500",
    progressGradient: "bg-gradient-to-r from-amber-400 to-orange-500",
    percentColor: "text-amber-600",
  },
];

const assignments: Assignment[] = [
  {
    course: "AI基礎コース",
    name: "第3章 演習問題",
    date: "2026/03/12",
    score: "92点",
    status: "採点済",
    statusVariant: "success",
  },
  {
    course: "AI基礎コース",
    name: "第2章 レポート",
    date: "2026/03/05",
    score: "88点",
    status: "採点済",
    statusVariant: "success",
  },
  {
    course: "プロンプトエンジニアリング",
    name: "実践課題1",
    date: "2026/03/01",
    score: "95点",
    status: "採点済",
    statusVariant: "success",
  },
  {
    course: "画像生成AI活用",
    name: "初回作品提出",
    date: "2026/02/28",
    score: "-",
    status: "採点待ち",
    statusVariant: "warning",
  },
];

const aiLogs: AiLogEntry[] = [
  {
    datetime: "2026/03/12 14:32",
    feature: "チャットアシスタント",
    model: "GPT-4o",
    modelVariant: "info",
    tokens: "1,245",
  },
  {
    datetime: "2026/03/12 13:15",
    feature: "コードレビュー",
    model: "GPT-4o",
    modelVariant: "info",
    tokens: "2,890",
  },
  {
    datetime: "2026/03/12 10:45",
    feature: "課題添削",
    model: "Claude 3.5",
    modelVariant: "purple",
    tokens: "3,412",
  },
  {
    datetime: "2026/03/11 16:20",
    feature: "チャットアシスタント",
    model: "GPT-4o",
    modelVariant: "info",
    tokens: "980",
  },
];

const loginHistory: LoginEntry[] = [
  {
    datetime: "2026/03/12 09:15",
    ip: "203.140.xx.xx",
    device: "Chrome / macOS",
    result: "成功",
    resultVariant: "success",
  },
  {
    datetime: "2026/03/11 08:45",
    ip: "203.140.xx.xx",
    device: "Safari / iPhone",
    result: "成功",
    resultVariant: "success",
  },
  {
    datetime: "2026/03/10 22:10",
    ip: "118.243.xx.xx",
    device: "Chrome / Windows",
    result: "失敗",
    resultVariant: "danger",
  },
  {
    datetime: "2026/03/10 14:30",
    ip: "203.140.xx.xx",
    device: "Chrome / macOS",
    result: "成功",
    resultVariant: "success",
  },
];

const billingHistory: BillingEntry[] = [
  {
    date: "2026/03/01",
    description: "Proプラン 月額",
    amount: "\u00a54,980",
    method: "クレジットカード",
    status: "完了",
  },
  {
    date: "2026/02/01",
    description: "Proプラン 月額",
    amount: "\u00a54,980",
    method: "クレジットカード",
    status: "完了",
  },
  {
    date: "2026/01/01",
    description: "Proプラン 月額",
    amount: "\u00a54,980",
    method: "クレジットカード",
    status: "完了",
  },
  {
    date: "2025/12/01",
    description: "Proプラン アップグレード",
    amount: "\u00a54,980",
    method: "クレジットカード",
    status: "完了",
  },
];

// ─── Page Component ─────────────────────────────────────
export default function UserDetailPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("learning");

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "ユーザー管理", href: "/admin/users" },
          { label: "佐藤 健太" },
        ]}
      />

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* User info */}
          <div className="flex items-center gap-5">
            <UserAvatar
              initials="佐"
              gradient="from-blue-400 to-cyan-400"
              className="w-20 h-20 rounded-2xl text-2xl shadow-lg shadow-cyan-500/20"
            />
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                佐藤 健太
              </h2>
              <p className="text-sm text-slate-500 mb-2">
                k.sato@example.com
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge variant="info">Student</StatusBadge>
                <StatusBadge variant="purple">Pro</StatusBadge>
                <StatusBadge variant="success" dot>
                  Active
                </StatusBadge>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="md:ml-auto flex flex-wrap gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">2025/08/15</p>
              <p className="text-xs text-slate-400">登録日</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">2026/03/12</p>
              <p className="text-xs text-slate-400">最終ログイン</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:ml-4">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Edit3 className="w-4 h-4" />
              編集
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 hover:bg-red-100 transition-colors shadow-sm">
              <Ban className="w-4 h-4" />
              停止
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Tab Buttons */}
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "text-cyan-600 border-b-2 border-cyan-500"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Learning Tab ─────────────────────────────── */}
        {activeTab === "learning" && (
          <div className="p-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">受講コース数</p>
                <p className="text-2xl font-bold text-slate-800">
                  3
                  <span className="text-sm font-normal text-slate-400 ml-1">
                    コース
                  </span>
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">総学習時間</p>
                <p className="text-2xl font-bold text-slate-800">
                  48.5
                  <span className="text-sm font-normal text-slate-400 ml-1">
                    時間
                  </span>
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">スキルポイント</p>
                <p className="text-2xl font-bold text-slate-800">
                  1,280
                  <span className="text-sm font-normal text-slate-400 ml-1">
                    pt
                  </span>
                </p>
              </div>
            </div>

            {/* Enrolled Courses */}
            <h4 className="font-bold text-slate-700 mb-4">受講中のコース</h4>
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.name}
                  className="border border-slate-100 rounded-xl p-5 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${course.gradient} flex items-center justify-center`}
                      >
                        {course.icon}
                      </div>
                      <div>
                        <p className="font-medium text-slate-700">
                          {course.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          全{course.chapters}章 / 講師: {course.instructor}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-bold ${course.percentColor}`}
                    >
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`${course.progressGradient} h-2 rounded-full transition-all`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">
                      {course.completed}/{course.chapters} 章完了
                    </span>
                    <span className="text-xs text-slate-400">
                      学習時間: {course.hours}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Assignments Tab ──────────────────────────── */}
        {activeTab === "assignments" && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      コース
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      課題名
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      提出日
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      スコア
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      ステータス
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {assignments.map((a, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-700">{a.course}</td>
                      <td className="px-4 py-3 text-slate-700">{a.name}</td>
                      <td className="px-4 py-3 text-slate-500">{a.date}</td>
                      <td className="px-4 py-3">
                        {a.score === "-" ? (
                          <span className="text-slate-400">-</span>
                        ) : (
                          <span className="font-bold text-cyan-600">
                            {a.score}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge variant={a.statusVariant}>
                          {a.status}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── AI Log Tab ───────────────────────────────── */}
        {activeTab === "ai-log" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                今月のAI利用:{" "}
                <span className="font-bold text-slate-700">87回</span>
              </p>
              <p className="text-sm text-slate-500">
                利用上限:{" "}
                <span className="font-bold text-slate-700">200回/月</span>
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      日時
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      機能
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      モデル
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      トークン数
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {aiLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-500">
                        {log.datetime}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {log.feature}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge variant={log.modelVariant}>
                          {log.model}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {log.tokens}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Login History Tab ────────────────────────── */}
        {activeTab === "login-history" && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      日時
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      IPアドレス
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      デバイス
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      結果
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loginHistory.map((entry, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-500">
                        {entry.datetime}
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-mono text-xs">
                        {entry.ip}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {entry.device}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge variant={entry.resultVariant}>
                          {entry.result}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Billing History Tab ──────────────────────── */}
        {activeTab === "billing-history" && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      日付
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      内容
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      金額
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      決済方法
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">
                      ステータス
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {billingHistory.map((entry, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-500">
                        {entry.date}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {entry.description}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-700">
                        {entry.amount}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {entry.method}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge variant="success">{entry.status}</StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
