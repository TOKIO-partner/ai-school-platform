"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Download,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UserRole = "個人" | "法人" | "講師";
type UserStatus = "Active" | "Warning" | "Inactive";
type UserPlan = "Free" | "Pro" | "Business";

interface User {
  id: number;
  name: string;
  initial: string;
  avatarGradient: string;
  email: string;
  role: UserRole;
  organization: string;
  plan: UserPlan;
  registeredAt: string;
  lastLogin: string;
  status: UserStatus;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const users: User[] = [
  {
    id: 1,
    name: "佐藤 健太",
    initial: "佐",
    avatarGradient: "from-blue-400 to-cyan-400",
    email: "k.sato@example.com",
    role: "個人",
    organization: "-",
    plan: "Pro",
    registeredAt: "2025/08/15",
    lastLogin: "2026/03/12",
    status: "Active",
  },
  {
    id: 2,
    name: "鈴木 美咲",
    initial: "鈴",
    avatarGradient: "from-fuchsia-400 to-pink-400",
    email: "m.suzuki@example.com",
    role: "個人",
    organization: "-",
    plan: "Free",
    registeredAt: "2026/03/12",
    lastLogin: "2026/03/12",
    status: "Active",
  },
  {
    id: 3,
    name: "山田 太郎",
    initial: "山",
    avatarGradient: "from-amber-400 to-orange-400",
    email: "t.yamada@techinnovation.co.jp",
    role: "法人",
    organization: "(株)テックイノベーション",
    plan: "Business",
    registeredAt: "2025/04/01",
    lastLogin: "2026/03/11",
    status: "Active",
  },
  {
    id: 4,
    name: "高橋 優子",
    initial: "高",
    avatarGradient: "from-emerald-400 to-green-400",
    email: "y.takahashi@example.com",
    role: "講師",
    organization: "-",
    plan: "Pro",
    registeredAt: "2025/01/10",
    lastLogin: "2026/03/10",
    status: "Warning",
  },
  {
    id: 5,
    name: "中村 大輔",
    initial: "中",
    avatarGradient: "from-violet-400 to-purple-400",
    email: "d.nakamura@example.com",
    role: "個人",
    organization: "-",
    plan: "Free",
    registeredAt: "2025/11/20",
    lastLogin: "2026/01/15",
    status: "Inactive",
  },
];

const TOTAL_USERS = 156;
const TOTAL_INDIVIDUAL = 120;
const TOTAL_CORPORATE = 24;
const TOTAL_INSTRUCTOR = 12;
const TOTAL_PAGES = 32;
const PER_PAGE = 5;

// ---------------------------------------------------------------------------
// Style helpers
// ---------------------------------------------------------------------------

const roleBadgeClass: Record<UserRole, string> = {
  個人: "bg-blue-50 text-blue-600",
  法人: "bg-fuchsia-50 text-fuchsia-600",
  講師: "bg-emerald-50 text-emerald-600",
};

const planBadgeClass: Record<UserPlan, string> = {
  Free: "bg-slate-100 text-slate-600",
  Pro: "bg-purple-50 text-purple-600",
  Business: "bg-amber-50 text-amber-600",
};

const statusConfig: Record<
  UserStatus,
  { dotClass: string; textClass: string }
> = {
  Active: {
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-600",
  },
  Warning: {
    dotClass: "bg-amber-500",
    textClass: "text-amber-600",
  },
  Inactive: {
    dotClass: "bg-slate-400",
    textClass: "text-slate-400",
  },
};

// ---------------------------------------------------------------------------
// Filter options
// ---------------------------------------------------------------------------

const roleFilterOptions: Array<{ label: string; value: string }> = [
  { label: "全員", value: "" },
  { label: "個人", value: "個人" },
  { label: "法人", value: "法人" },
  { label: "講師", value: "講師" },
];

const statusFilterOptions: Array<{ label: string; value: string }> = [
  { label: "全ステータス", value: "" },
  { label: "Active", value: "Active" },
  { label: "Warning", value: "Warning" },
  { label: "Inactive", value: "Inactive" },
];

const planFilterOptions: Array<{ label: string; value: string }> = [
  { label: "全プラン", value: "" },
  { label: "Free", value: "Free" },
  { label: "Pro", value: "Pro" },
  { label: "Business", value: "Business" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function UsersPage() {
  // Filter state
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Checkbox state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (roleFilter && user.role !== roleFilter) return false;
      if (statusFilter && user.status !== statusFilter) return false;
      if (planFilter && user.plan !== planFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !user.name.toLowerCase().includes(q) &&
          !user.email.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [roleFilter, statusFilter, planFilter, searchQuery]);

  // Select-all checkbox
  const allSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((u) => selectedIds.has(u.id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredUsers.map((u) => u.id)));
    }
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // CSV export handler
  function handleCsvExport() {
    const headers = [
      "名前",
      "メールアドレス",
      "ロール",
      "所属",
      "プラン",
      "登録日",
      "最終ログイン",
      "ステータス",
    ];
    const rows = filteredUsers.map((u) => [
      u.name,
      u.email,
      u.role,
      u.organization,
      u.plan,
      u.registeredAt,
      u.lastLogin,
      u.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Pagination helpers
  function renderPaginationButtons() {
    const pages: (number | "ellipsis")[] = [];
    if (TOTAL_PAGES <= 5) {
      for (let i = 1; i <= TOTAL_PAGES; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, "ellipsis", TOTAL_PAGES);
    }

    return pages.map((page, idx) => {
      if (page === "ellipsis") {
        return (
          <span
            key={`ellipsis-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm"
          >
            ...
          </span>
        );
      }
      const isActive = page === currentPage;
      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={
            isActive
              ? "w-9 h-9 flex items-center justify-center rounded-lg bg-cyan-500 text-white text-sm font-medium shadow-sm"
              : "w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 text-sm transition-colors"
          }
        >
          {page}
        </button>
      );
    });
  }

  return (
    <>
      {/* Summary & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-slate-500">総ユーザー数</p>
            <p className="text-2xl font-bold text-slate-800">
              {TOTAL_USERS}
              <span className="text-sm font-normal text-slate-400 ml-1">
                人
              </span>
            </p>
          </div>
          <div className="h-10 w-px bg-slate-200"></div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">
                {TOTAL_INDIVIDUAL}
              </p>
              <p className="text-[10px] text-slate-400">個人</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-fuchsia-600">
                {TOTAL_CORPORATE}
              </p>
              <p className="text-[10px] text-slate-400">法人</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-600">
                {TOTAL_INSTRUCTOR}
              </p>
              <p className="text-[10px] text-slate-400">講師</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCsvExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>CSV出力</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-sm text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all shadow-sm">
            <UserPlus className="w-4 h-4" />
            <span>ユーザー追加</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 focus:outline-none focus:border-cyan-500"
          >
            {roleFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 focus:outline-none focus:border-cyan-500"
          >
            {statusFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 focus:outline-none focus:border-cyan-500"
          >
            {planFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="名前・メールで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="w-12 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                </th>
                <th className="text-left px-4 py-4 font-medium text-slate-500">
                  ユーザー
                </th>
                <th className="text-left px-4 py-4 font-medium text-slate-500">
                  メールアドレス
                </th>
                <th className="text-left px-4 py-4 font-medium text-slate-500">
                  ロール
                </th>
                <th className="text-left px-4 py-4 font-medium text-slate-500">
                  所属
                </th>
                <th className="text-left px-4 py-4 font-medium text-slate-500">
                  プラン
                </th>
                <th className="text-left px-4 py-4 font-medium text-slate-500">
                  登録日
                </th>
                <th className="text-left px-4 py-4 font-medium text-slate-500">
                  最終ログイン
                </th>
                <th className="text-left px-4 py-4 font-medium text-slate-500">
                  ステータス
                </th>
                <th className="text-left px-4 py-4 font-medium text-slate-500">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const status = statusConfig[user.status];
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(user.id)}
                        onChange={() => toggleSelect(user.id)}
                        className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-tr ${user.avatarGradient} flex items-center justify-center text-white font-bold text-xs shadow-sm`}
                        >
                          {user.initial}
                        </div>
                        <span className="font-medium text-slate-700">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500">{user.email}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs font-medium ${roleBadgeClass[user.role]} px-2.5 py-1 rounded-full`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {user.organization}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs font-medium ${planBadgeClass[user.plan]} px-2.5 py-1 rounded-full`}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {user.registeredAt}
                    </td>
                    <td className="px-4 py-4 text-slate-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-medium ${status.textClass}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`}
                        ></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="px-2.5 py-1.5 text-xs text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors font-medium"
                        >
                          詳細
                        </Link>
                        <button className="px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                          編集
                        </button>
                        <button className="px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          停止
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-12 text-center text-slate-400 text-sm"
                  >
                    条件に一致するユーザーが見つかりません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            {(currentPage - 1) * PER_PAGE + 1}-
            {Math.min(currentPage * PER_PAGE, TOTAL_USERS)} / {TOTAL_USERS}件
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {renderPaginationButtons()}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))
              }
              disabled={currentPage === TOTAL_PAGES}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
