"use client";

import { Users, CreditCard, TrendingUp, Cpu } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ---------------------------------------------------------------------------
// Chart data
// ---------------------------------------------------------------------------

const revenueData = [
  { month: "1月", revenue: 150 },
  { month: "2月", revenue: 175 },
  { month: "3月", revenue: 138 },
  { month: "4月", revenue: 200 },
  { month: "5月", revenue: 188 },
  { month: "6月", revenue: 225 },
  { month: "7月", revenue: 213 },
  { month: "8月", revenue: 163 },
  { month: "9月", revenue: 195 },
  { month: "10月", revenue: 220 },
  { month: "11月", revenue: 230 },
  { month: "12月", revenue: 240 },
];

const userGrowthData = [
  { month: "1月", individual: 60, corporate: 20 },
  { month: "2月", individual: 72, corporate: 24 },
  { month: "3月", individual: 78, corporate: 26 },
  { month: "4月", individual: 84, corporate: 30 },
  { month: "5月", individual: 90, corporate: 32 },
  { month: "6月", individual: 96, corporate: 38 },
  { month: "7月", individual: 100, corporate: 40 },
  { month: "8月", individual: 104, corporate: 42 },
  { month: "9月", individual: 108, corporate: 48 },
  { month: "10月", individual: 112, corporate: 52 },
  { month: "11月", individual: 116, corporate: 56 },
  { month: "12月", individual: 120, corporate: 60 },
];

// ---------------------------------------------------------------------------
// Activity data
// ---------------------------------------------------------------------------

const activities = [
  { name: "田中 翔", action: "が課題を提出しました", detail: "AI基礎コース - 第3章 演習問題", time: "2分前", gradient: "from-blue-400 to-cyan-400", initial: "田" },
  { name: "鈴木 美咲", action: "新規登録:", detail: "個人プラン - Freeプラン", time: "1時間前", gradient: "from-fuchsia-400 to-pink-400", initial: "鈴", prefix: true },
  { name: "山田 太郎", action: "がProプランにアップグレード", detail: "月額プラン ¥4,980/月", time: "3時間前", gradient: "from-amber-400 to-orange-400", initial: "山" },
  { name: "株式会社テックイノベーション", action: "法人登録:", detail: "Businessプラン - 10アカウント", time: "5時間前", gradient: "from-emerald-400 to-green-400", initial: "株", prefix: true },
  { name: "高橋 優子", action: "がコースを完了しました", detail: "プロンプトエンジニアリング実践 - 修了証発行", time: "昨日", gradient: "from-violet-400 to-purple-400", initial: "高" },
];

// ---------------------------------------------------------------------------
// Custom tooltip
// ---------------------------------------------------------------------------

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-lg px-4 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-bold text-slate-800">¥{payload[0].value}万</p>
    </div>
  );
}

function UserTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-lg px-4 py-2">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs">
          <span className="font-medium text-slate-700">{p.name === "individual" ? "個人" : "法人"}:</span>{" "}
          <span className="font-bold">{p.value}人</span>
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminDashboardPage() {
  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">+12</span>
          </div>
          <p className="text-sm text-slate-500 mb-1">総ユーザー数</p>
          <p className="text-3xl font-bold text-slate-800">156</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">+8%</span>
          </div>
          <p className="text-sm text-slate-500 mb-1">月間売上</p>
          <p className="text-3xl font-bold text-slate-800">&yen;2,400,000</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">平均受講率</p>
          <p className="text-3xl font-bold text-slate-800">72%</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">AI利用回数</p>
          <p className="text-3xl font-bold text-slate-800">3,200</p>
        </div>
      </div>

      {/* Charts with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">売上推移（月次）</h3>
            <select className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none">
              <option>2026年</option>
              <option>2025年</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `${v}万`} />
              <Tooltip content={<RevenueTooltip />} cursor={{ fill: "rgba(6,182,212,0.05)" }} />
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">ユーザー数推移</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />個人</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" />法人</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={userGrowthData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip content={<UserTooltip />} cursor={{ fill: "rgba(6,182,212,0.05)" }} />
              <Bar dataKey="individual" stackId="a" fill="#22d3ee" radius={[0, 0, 0, 0]} />
              <Bar dataKey="corporate" stackId="a" fill="#d946ef" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">最近のアクティビティ</h3>
          <a href="#" className="text-xs text-cyan-600 hover:text-cyan-700 font-medium">すべて表示</a>
        </div>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${activity.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                {activity.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">
                  {activity.prefix ? (
                    <>{activity.action} <span className="font-bold">{activity.name}</span></>
                  ) : (
                    <><span className="font-bold">{activity.name}</span>{activity.action}</>
                  )}
                </p>
                <p className="text-xs text-slate-400">{activity.detail}</p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
