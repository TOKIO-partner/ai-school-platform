"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  UserPlus,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAdminUsers } from "@/lib/queries/use-admin";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UserRole = "個人" | "法人" | "講師" | "管理者";
type UserStatus = "Active" | "Warning" | "Inactive";
type UserPlan = "Free" | "Pro" | "Business";

// ---------------------------------------------------------------------------
// Style helpers
// ---------------------------------------------------------------------------

const roleBadgeClass: Record<UserRole, string> = {
  個人: "bg-blue-50 text-blue-600",
  法人: "bg-fuchsia-50 text-fuchsia-600",
  講師: "bg-emerald-50 text-emerald-600",
  管理者: "bg-slate-100 text-slate-600",
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

const avatarGradients = [
  "from-blue-400 to-cyan-400",
  "from-fuchsia-400 to-pink-400",
  "from-amber-400 to-orange-400",
  "from-emerald-400 to-green-400",
  "from-violet-400 to-purple-400",
  "from-rose-400 to-red-400",
  "from-teal-400 to-cyan-400",
  "from-indigo-400 to-blue-400",
];

// ---------------------------------------------------------------------------
// Filter options
// ---------------------------------------------------------------------------

const roleFilterOptions: Array<{ label: string; value: string }> = [
  { label: "全員", value: "" },
  { label: "個人", value: "student" },
  { label: "法人", value: "corp_admin" },
  { label: "講師", value: "instructor" },
];

const statusFilterOptions: Array<{ label: string; value: string }> = [
  { label: "全ステータス", value: "" },
  { label: "Active", value: "Active" },
  { label: "Warning", value: "Warning" },
  { label: "Inactive", value: "Inactive" },
];

const planFilterOptions: Array<{ label: string; value: string }> = [
  { label: "全プラン", value: "" },
  { label: "Free", value: "free" },
  { label: "Pro", value: "pro" },
  { label: "Business", value: "business" },
];

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

const PER_PAGE = 5;

function mapApiRoleToDisplay(role: string): UserRole {
  switch (role) {
    case "student":
      return "個人";
    case "instructor":
      return "講師";
    case "corp_admin":
      return "法人";
    case "admin":
      return "管理者";
    default:
      return "個人";
  }
}

function mapApiPlanToDisplay(plan: string): UserPlan {
  switch (plan) {
    case "pro":
      return "Pro";
    case "business":
      return "Business";
    default:
      return "Free";
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function UsersPage() {
  // Filter state (values are API values)
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Checkbox state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Derive is_active param from status filter
  const isActiveParam =
    statusFilter === "Active"
      ? "true"
      : statusFilter === "Inactive"
        ? "false"
        : undefined;

  // API query
  const { data, isLoading } = useAdminUsers({
    role: roleFilter || undefined,
    plan: planFilter || undefined,
    is_active: isActiveParam,
    search: searchQuery || undefined,
    page: currentPage,
  });

  const apiUsers = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  // Map API users to display shape
  const displayUsers = apiUsers.map((user, idx) => {
    const displayRole = mapApiRoleToDisplay(user.role);
    const displayPlan = mapApiPlanToDisplay(user.plan);
    const displayStatus = (user.is_active ? "Active" : "Inactive") as UserStatus;
    return {
      id: user.id,
      name: `${user.last_name} ${user.first_name}`.trim() || user.username,
      initial: user.last_name?.[0] || user.username?.[0] || "?",
      avatarGradient: avatarGradients[idx % avatarGradients.length],
      email: user.email,
      role: displayRole,
      organization: user.organization_name || "-",
      plan: displayPlan,
      registeredAt: formatDate(user.date_joined),
      lastLogin: formatDate(user.last_login),
      status: displayStatus,
    };
  });

  // Apply client-side Warning filter (not supported by API)
  const filteredUsers =
    statusFilter === "Warning"
      ? displayUsers.filter((u) => u.status === "Warning")
      : displayUsers;

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

  // Reset to page 1 when filters change
  function handleRoleFilter(value: string) {
    setRoleFilter(value);
    setCurrentPage(1);
  }

  function handleStatusFilter(value: string) {
    setStatusFilter(value);
    setCurrentPage(1);
  }

  function handlePlanFilter(value: string) {
    setPlanFilter(value);
    setCurrentPage(1);
  }

  function handleSearch(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
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
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, "ellipsis", totalPages);
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
              {totalCount}
              <span className="text-sm font-normal text-slate-400 ml-1">
                人
              </span>
            </p>
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
            onChange={(e) => handleRoleFilter(e.target.value)}
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
            onChange={(e) => handleStatusFilter(e.target.value)}
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
            onChange={(e) => handlePlanFilter(e.target.value)}
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
              onChange={(e) => handleSearch(e.target.value)}
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
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">読み込み中...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
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
                        <td className="px-4 py-4 text-slate-500">
                          {user.email}
                        </td>
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
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            {totalCount === 0
              ? "0件"
              : `${(currentPage - 1) * PER_PAGE + 1}-${Math.min(currentPage * PER_PAGE, totalCount)} / ${totalCount}件`}
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
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
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
