"use client";

import {
  TrendingUp,
  Repeat,
  UserMinus,
  User,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Download,
  Search,
} from "lucide-react";
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
// Revenue chart data (6 months)
// ---------------------------------------------------------------------------

const revenueData = [
  { month: "10月", revenue: 180 },
  { month: "11月", revenue: 195 },
  { month: "12月", revenue: 210 },
  { month: "1月", revenue: 220 },
  { month: "2月", revenue: 230 },
  { month: "3月", revenue: 240 },
];

// ---------------------------------------------------------------------------
// Plan breakdown data
// ---------------------------------------------------------------------------

const planBreakdown = [
  { name: "Proプラン", percent: 45, color: "bg-cyan-500" },
  { name: "Businessプラン", percent: 30, color: "bg-blue-500" },
  { name: "Starterプラン", percent: 15, color: "bg-purple-500" },
  { name: "Freeプラン", percent: 10, color: "bg-amber-500" },
];

// ---------------------------------------------------------------------------
// Payment history data
// ---------------------------------------------------------------------------

type PaymentStatus = "成功" | "失敗" | "返金";

interface Payment {
  date: string;
  userName: string;
  amount: string;
  plan: string;
  method: string;
  status: PaymentStatus;
}

const payments: Payment[] = [
  {
    date: "2026/03/12 14:30",
    userName: "佐藤健太",
    amount: "¥4,980",
    plan: "Pro月額",
    method: "クレジットカード",
    status: "成功",
  },
  {
    date: "2026/03/12 10:15",
    userName: "鈴木美咲",
    amount: "¥980",
    plan: "Starter月額",
    method: "クレジットカード",
    status: "成功",
  },
  {
    date: "2026/03/11 16:00",
    userName: "(株)テックイノベーション",
    amount: "¥49,800",
    plan: "Business年額",
    method: "請求書",
    status: "成功",
  },
  {
    date: "2026/03/11 11:30",
    userName: "高橋優子",
    amount: "¥4,980",
    plan: "Pro月額",
    method: "クレジットカード",
    status: "成功",
  },
  {
    date: "2026/03/10 15:00",
    userName: "中村大輔",
    amount: "¥4,980",
    plan: "Pro月額",
    method: "クレジットカード",
    status: "失敗",
  },
  {
    date: "2026/03/10 09:00",
    userName: "田中翔",
    amount: "¥980",
    plan: "Starter月額",
    method: "PayPay",
    status: "成功",
  },
  {
    date: "2026/03/09 14:00",
    userName: "伊藤花子",
    amount: "¥4,980",
    plan: "Pro月額",
    method: "クレジットカード",
    status: "返金",
  },
  {
    date: "2026/03/09 10:00",
    userName: "渡辺誠",
    amount: "¥4,980",
    plan: "Pro月額",
    method: "クレジットカード",
    status: "成功",
  },
];

const statusStyles: Record<PaymentStatus, string> = {
  成功: "bg-green-50 text-green-600 border-green-200",
  失敗: "bg-red-50 text-red-600 border-red-200",
  返金: "bg-amber-50 text-amber-600 border-amber-200",
};

// ---------------------------------------------------------------------------
// Refund requests
// ---------------------------------------------------------------------------

const refundRequests = [
  {
    name: "田中花子",
    initials: "田",
    plan: "Pro月額",
    amount: "¥4,980",
    reason: "サービスに不満",
    date: "2026/03/11",
    gradient: "from-blue-400 to-cyan-400",
  },
  {
    name: "木村太一",
    initials: "木",
    plan: "Pro月額",
    amount: "¥4,980",
    reason: "誤って課金",
    date: "2026/03/10",
    gradient: "from-amber-400 to-orange-400",
  },
  {
    name: "松本さやか",
    initials: "松",
    plan: "Starter月額",
    amount: "¥980",
    reason: "解約忘れ",
    date: "2026/03/09",
    gradient: "from-fuchsia-400 to-pink-400",
  },
];

// ---------------------------------------------------------------------------
// KPI card config
// ---------------------------------------------------------------------------

const kpiCards = [
  {
    label: "月間売上",
    value: "¥2,400,000",
    badge: "+8% 前月比",
    badgeColor: "text-green-500",
    icon: TrendingUp,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    label: "MRR",
    value: "¥2,100,000",
    badge: "月間経常収益",
    badgeColor: "text-slate-400",
    icon: Repeat,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "解約率",
    value: "3.2%",
    badge: "-0.5% 前月比",
    badgeColor: "text-green-500",
    icon: UserMinus,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    label: "ARPU",
    value: "¥22,500",
    badge: "ユーザーあたり平均単価",
    badgeColor: "text-slate-400",
    icon: User,
    iconBg: "bg-fuchsia-50",
    iconColor: "text-fuchsia-600",
  },
];

// ---------------------------------------------------------------------------
// Custom tooltip
// ---------------------------------------------------------------------------

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-lg px-4 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-bold text-slate-800">¥{payload[0].value}万</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminBillingPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            売上・決済管理
          </h2>
          <p className="text-slate-500 text-sm">
            売上推移、決済履歴、返金リクエストの管理
          </p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> CSVエクスポート
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-xs font-medium">
                  {card.label}
                </p>
                <div
                  className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className={`text-xs ${card.badgeColor} font-medium mt-1`}>
                {card.badge}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Monthly Revenue */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">月次売上推移</h3>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:border-cyan-500">
              <option>直近6ヶ月</option>
              <option>直近12ヶ月</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={32}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={(v: number) => `${v}万`}
              />
              <Tooltip
                content={<RevenueTooltip />}
                cursor={{ fill: "rgba(6,182,212,0.05)" }}
              />
              <defs>
                <linearGradient
                  id="billingRevenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <Bar
                dataKey="revenue"
                fill="url(#billingRevenueGradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Plan Breakdown (CSS pie chart) */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6">プラン別比率</h3>
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40">
              {/* Conic gradient pie chart */}
              <div
                className="w-full h-full rounded-full"
                style={{
                  background:
                    "conic-gradient(#06b6d4 0% 45%, #3b82f6 45% 75%, #a855f7 75% 90%, #f59e0b 90% 100%)",
                }}
              />
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-800">107</p>
                  <p className="text-xs text-slate-500">契約数</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {planBreakdown.map((plan) => (
              <div
                key={plan.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${plan.color}`} />
                  <span className="text-slate-600">{plan.name}</span>
                </div>
                <span className="font-medium text-slate-800">
                  {plan.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">決済履歴</h3>
          <div className="flex items-center gap-3">
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:border-cyan-500">
              <option>すべてのステータス</option>
              <option>成功</option>
              <option>失敗</option>
              <option>返金済</option>
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ユーザー名で検索..."
                className="bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-3">日時</th>
                <th className="px-6 py-3">ユーザー名</th>
                <th className="px-6 py-3">金額</th>
                <th className="px-6 py-3">プラン</th>
                <th className="px-6 py-3">決済方法</th>
                <th className="px-6 py-3">ステータス</th>
                <th className="px-6 py-3">詳細</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-500">{payment.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {payment.userName}
                  </td>
                  <td className="px-6 py-4 font-medium">{payment.amount}</td>
                  <td className="px-6 py-4">{payment.plan}</td>
                  <td className="px-6 py-4">{payment.method}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[payment.status]}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-cyan-600 hover:text-cyan-800 font-medium text-sm">
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center">
          <p className="text-sm text-slate-500">全 156 件中 1-8 件を表示</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              前へ
            </button>
            <button className="px-3 py-1.5 text-sm bg-cyan-500 text-white rounded-lg shadow-sm">
              1
            </button>
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
              2
            </button>
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
              3
            </button>
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 flex items-center gap-1">
              次へ
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Refund Requests */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">返金リクエスト</h3>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
            3件 保留中
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {refundRequests.map((req, i) => (
            <div
              key={i}
              className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-tr ${req.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                >
                  {req.initials}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{req.name}</p>
                  <p className="text-xs text-slate-500">
                    {req.plan} - {req.amount} / 申請日: {req.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-500 max-w-xs truncate hidden md:block">
                  「{req.reason}」
                </p>
                <button className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors shadow-sm flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  承認
                </button>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">
                  <X className="w-3.5 h-3.5" />
                  却下
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
