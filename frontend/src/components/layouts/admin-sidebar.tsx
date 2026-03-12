"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  Bell,
  CreditCard,
  Cpu,
  Settings,
} from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "ダッシュボード", icon: BarChart, exact: true },
  { href: "/admin/users", label: "ユーザー管理", icon: Users },
  { href: "/admin/courses", label: "コース管理", icon: BookOpen },
  { href: "/admin/contents", label: "コンテンツ管理", icon: FileText },
  { href: "/admin/community", label: "コミュニティ管理", icon: MessageSquare },
  { href: "/admin/events", label: "イベント管理", icon: Calendar },
  { href: "/admin/announcements", label: "お知らせ管理", icon: Bell },
  { href: "/admin/billing", label: "売上・決済", icon: CreditCard },
  { href: "/admin/ai-settings", label: "AI設定", icon: Cpu },
  { href: "/admin/system", label: "システム設定", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col z-30 shadow-xl lg:shadow-none hidden lg:flex">
      <div className="h-20 flex items-center justify-center border-b border-slate-100">
        <Logo showBadge="Admin" />
      </div>

      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600 border border-cyan-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-cyan-600")} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-700 truncate">Admin User</p>
            <p className="text-xs text-slate-500 truncate">管理者</p>
          </div>
          <Settings className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>
      </div>
    </div>
  );
}
