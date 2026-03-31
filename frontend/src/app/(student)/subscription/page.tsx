"use client";

import {
  CheckCircle,
  Calendar,
  CreditCard,
  Layers,
  Receipt,
  Check,
  X,
  Download,
  RefreshCw,
  XCircle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PlanFeature {
  label: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  priceSuffix: string;
  features: PlanFeature[];
  isCurrent: boolean;
  action: {
    label: string;
    variant: "downgrade" | "current" | "contact";
  };
}

interface BillingRecord {
  id: number;
  date: string;
  amount: string;
  status: string;
  statusColor: "green";
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const currentPlan = {
  name: "Proプラン",
  price: "¥25,000",
  priceSuffix: "/月（税込）",
  status: "Active" as const,
  nextBillingDate: "2024年4月15日",
  paymentMethod: "Visa **** 4242",
};

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basicプラン",
    price: "¥15,000",
    priceSuffix: "/月",
    features: [
      { label: "基本コースアクセス", included: true },
      { label: "AIチャット月50回", included: true },
      { label: "コミュニティ参加", included: true },
      { label: "課題添削", included: false },
      { label: "ポートフォリオ機能", included: false },
    ],
    isCurrent: false,
    action: { label: "ダウングレード", variant: "downgrade" },
  },
  {
    id: "pro",
    name: "Proプラン",
    price: "¥25,000",
    priceSuffix: "/月",
    features: [
      { label: "全コースアクセス", included: true },
      { label: "AIチャット無制限", included: true },
      { label: "コミュニティ参加", included: true },
      { label: "課題添削", included: true },
      { label: "ポートフォリオ機能", included: true },
    ],
    isCurrent: true,
    action: { label: "現在のプラン", variant: "current" },
  },
  {
    id: "enterprise",
    name: "Enterpriseプラン",
    price: "¥80,000~",
    priceSuffix: "/月",
    features: [
      { label: "法人向けフルアクセス", included: true },
      { label: "管理コンソール", included: true },
      { label: "カスタムレポート", included: true },
      { label: "専任サポート", included: true },
      { label: "SLA保証", included: true },
    ],
    isCurrent: false,
    action: { label: "お問い合わせ", variant: "contact" },
  },
];

const billingHistory: BillingRecord[] = [
  { id: 1, date: "2024年3月15日", amount: "¥25,000", status: "支払い済み", statusColor: "green" },
  { id: 2, date: "2024年2月15日", amount: "¥25,000", status: "支払い済み", statusColor: "green" },
  { id: 3, date: "2024年1月15日", amount: "¥25,000", status: "支払い済み", statusColor: "green" },
  { id: 4, date: "2023年12月15日", amount: "¥25,000", status: "支払い済み", statusColor: "green" },
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function SubscriptionPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">サブスクリプション管理</h2>

      {/* Current Plan Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 shadow-sm mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100/50 to-blue-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-800">現在のプラン</h3>
              <span className="text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 rounded-full shadow-sm">
                {currentPlan.name}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <CheckCircle className="w-4 h-4" />
              {currentPlan.status}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-bold text-slate-800">{currentPlan.price}</span>
            <span className="text-slate-500 text-sm">{currentPlan.priceSuffix}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-600" />
              次回請求日: {currentPlan.nextBillingDate}
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-cyan-600" />
              {currentPlan.paymentMethod}
            </span>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-cyan-600" />
        プラン比較
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={
              plan.isCurrent
                ? "rounded-2xl bg-white border-2 border-cyan-500 p-6 shadow-lg relative"
                : "rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            }
          >
            {plan.isCurrent && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1 rounded-full shadow-md">
                  現在のプラン
                </span>
              </div>
            )}
            <div className={plan.isCurrent ? "mb-4 mt-2" : "mb-4"}>
              <h4 className="text-lg font-bold text-slate-800 mb-1">{plan.name}</h4>
              <div className="flex items-baseline gap-1">
                <span
                  className={
                    plan.isCurrent
                      ? "text-3xl font-bold text-cyan-600"
                      : "text-3xl font-bold text-slate-800"
                  }
                >
                  {plan.price}
                </span>
                <span className="text-slate-500 text-sm">{plan.priceSuffix}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li
                  key={feature.label}
                  className={
                    feature.included
                      ? "flex items-center gap-2 text-sm text-slate-600"
                      : "flex items-center gap-2 text-sm text-slate-400"
                  }
                >
                  {feature.included ? (
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  {feature.label}
                </li>
              ))}
            </ul>
            {plan.action.variant === "downgrade" && (
              <button className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                {plan.action.label}
              </button>
            )}
            {plan.action.variant === "current" && (
              <button
                className="w-full py-2.5 rounded-lg bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed"
                disabled
              >
                {plan.action.label}
              </button>
            )}
            {plan.action.variant === "contact" && (
              <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                {plan.action.label}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payment History */}
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Receipt className="w-5 h-5 text-cyan-600" />
        お支払い履歴
      </h3>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">
                日付
              </th>
              <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">
                金額
              </th>
              <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">
                ステータス
              </th>
              <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">
                請求書
              </th>
            </tr>
          </thead>
          <tbody>
            {billingHistory.map((record, index) => (
              <tr
                key={record.id}
                className={
                  index < billingHistory.length - 1
                    ? "border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    : "hover:bg-slate-50 transition-colors"
                }
              >
                <td className="px-6 py-4 text-sm text-slate-700">{record.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{record.amount}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1 ml-auto">
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          プランを変更する
        </button>
        <button className="px-6 py-3 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          解約する
        </button>
      </div>
    </>
  );
}
