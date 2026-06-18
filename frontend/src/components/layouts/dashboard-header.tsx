"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  LogOut,
  Settings,
  Clock,
  BookOpen,
  CheckCircle,
  Flame,
  Sparkles,
  MessageCircle,
  Calendar,
  Gift,
  ChevronRight,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useMyStats, useMySkills } from "@/lib/queries/use-enrollments";
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/lib/queries/use-notifications";
import {
  getDisplayName,
  getInitials,
  getRoleLabel,
  getPlanLabel,
} from "@/lib/user-display";
import type { Notification } from "@/types";

interface DashboardHeaderProps {
  title: string;
  badge?: string;
  badgeColor?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const NOTIFICATION_META: Record<
  Notification["type"],
  { icon: React.ElementType; color: string; bg: string }
> = {
  system: { icon: Bell, color: "text-cyan-600", bg: "bg-cyan-50" },
  course: { icon: Gift, color: "text-cyan-600", bg: "bg-cyan-50" },
  instructor: { icon: MessageCircle, color: "text-fuchsia-600", bg: "bg-fuchsia-50" },
  event: { icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
  feedback: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
};

function useOutsideClick(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);
  return ref;
}

// ─── Notification dropdown ────────────────────────────────────────────────────

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));
  const router = useRouter();

  const { data: notifications } = useNotifications();
  const { data: unread } = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = unread?.count ?? 0;
  const recent = (notifications ?? []).slice(0, 6);

  function handleOpen(n: Notification) {
    if (!n.is_read) markRead.mutate(n.id);
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors"
        aria-label="通知"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-fuchsia-500 rounded-full ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl ring-1 ring-slate-900/5 border border-slate-100 overflow-hidden z-50 animate-fadeIn">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">お知らせ</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold text-fuchsia-600 bg-fuchsia-50 px-1.5 py-0.5 rounded-full">
                  {unreadCount}件 未読
                </span>
              )}
            </div>
            <button
              onClick={() => markAllRead.mutate()}
              disabled={unreadCount === 0}
              className="text-xs font-medium text-cyan-600 hover:text-cyan-700 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              全既読
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recent.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">お知らせはありません</p>
              </div>
            ) : (
              recent.map((n) => {
                const meta = NOTIFICATION_META[n.type] ?? NOTIFICATION_META.system;
                const Icon = meta.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleOpen(n)}
                    className={cn(
                      "w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0",
                      !n.is_read && "bg-cyan-50/40"
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", meta.bg)}>
                      <Icon className={cn("w-4 h-4", meta.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-sm truncate", n.is_read ? "font-medium text-slate-600" : "font-bold text-slate-800")}>
                          {n.title}
                        </p>
                        {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1 px-4 py-3 text-sm font-medium text-cyan-600 hover:bg-cyan-50 border-t border-slate-100 transition-colors"
          >
            すべてのお知らせを見る
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Profile popover ──────────────────────────────────────────────────────────

function StatTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={cn("w-3.5 h-3.5", accent)} />
        <span className="text-[10px] font-medium text-slate-400">{label}</span>
      </div>
      <p className="text-lg font-bold text-slate-800 leading-none">{value}</p>
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));
  const router = useRouter();
  const { user, logout } = useAuth();

  const isStudent = user?.role === "student";
  const { data: stats } = useMyStats();
  const { data: skills } = useMySkills();

  const initials = getInitials(user);
  const name = getDisplayName(user);

  // Weekly learning goal progress (target: 10 lessons / week)
  const weeklyGoal = 10;
  const weeklyDone = stats?.weekly_completed_lessons ?? 0;
  const weeklyPercent = Math.min(100, Math.round((weeklyDone / weeklyGoal) * 100));

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.push("/login");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[2px] cursor-pointer shadow-md hover:shadow-lg transition-shadow"
        aria-label="プロフィール"
      >
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <span className="text-xs font-bold text-slate-700">{initials}</span>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl ring-1 ring-slate-900/5 border border-slate-100 overflow-hidden z-50 animate-fadeIn">
          {/* Banner */}
          <div className="relative bg-gradient-to-tr from-cyan-500 via-blue-500 to-fuchsia-500 px-5 pt-5 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur p-[2px] shadow-lg ring-2 ring-white/40">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-base font-bold text-slate-700">{initials}</span>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-white truncate">{name}</p>
                <p className="text-xs text-white/80 truncate">{user?.email}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {getRoleLabel(user) && (
                    <span className="text-[10px] font-bold text-white bg-white/25 px-2 py-0.5 rounded-full backdrop-blur">
                      {getRoleLabel(user)}
                    </span>
                  )}
                  {getPlanLabel(user) && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-300 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      {getPlanLabel(user)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Student: progress + skills */}
          {isStudent && (
            <div className="px-5 py-4 space-y-4">
              {/* Weekly goal */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    今週の学習目標
                  </span>
                  <span className="text-xs font-bold text-slate-500 tabular-nums">
                    {weeklyDone} / {weeklyGoal} レッスン
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all"
                    style={{ width: `${weeklyPercent}%` }}
                  />
                </div>
              </div>

              {/* Stat tiles */}
              <div className="grid grid-cols-2 gap-2">
                <StatTile
                  icon={Clock}
                  label="累計視聴時間"
                  value={`${stats?.total_watch_time_hours ?? 0}h`}
                  accent="text-cyan-500"
                />
                <StatTile
                  icon={Sparkles}
                  label="スキルポイント"
                  value={`${stats?.skill_points_total ?? 0}pt`}
                  accent="text-fuchsia-500"
                />
                <StatTile
                  icon={BookOpen}
                  label="完了コース"
                  value={`${stats?.completed_courses ?? 0}`}
                  accent="text-blue-500"
                />
                <StatTile
                  icon={CheckCircle}
                  label="完了レッスン"
                  value={`${stats?.completed_lessons ?? 0}`}
                  accent="text-green-500"
                />
              </div>

              {/* Skill tags */}
              {skills && skills.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-2">獲得スキル</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.slice(0, 8).map((s) => (
                      <span
                        key={s.category}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-full pl-2 pr-1.5 py-0.5"
                      >
                        {s.category}
                        <span className="text-[9px] font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full px-1.5 py-px">
                          Lv{s.level}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="px-2 py-2 border-t border-slate-100">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              プロフィール・設定
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function DashboardHeader({ title, badge, badgeColor = "bg-red-100 text-red-600" }: DashboardHeaderProps) {
  return (
    <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-slate-800 tracking-wider">{title}</h1>
        {badge && (
          <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider", badgeColor)}>
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-slate-100 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all w-64 shadow-sm"
          />
        </div>
        <NotificationBell />
        <ProfileMenu />
      </div>
    </header>
  );
}
