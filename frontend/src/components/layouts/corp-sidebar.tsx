"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Users, FileBarChart, Home, Monitor, BookOpen } from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: Home },
  { href: "/learning", label: "学習ルーム", icon: Monitor },
  { href: "/courses", label: "コース一覧", icon: BookOpen },
  { href: "/corp", label: "法人管理", icon: BarChart2, children: [
    { href: "/corp", label: "ダッシュボード", icon: BarChart2, exact: true },
    { href: "/corp/members", label: "受講者管理", icon: Users },
    { href: "/corp/reports", label: "進捗レポート", icon: FileBarChart },
  ]},
];

export function CorpSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col z-30 shadow-xl lg:shadow-none hidden lg:flex">
      <div className="h-20 flex items-center justify-center border-b border-slate-100">
        <Logo />
      </div>

      <nav className="p-4 space-y-2 flex-1">
        {navItems.map((item) => {
          if (item.children) {
            const isGroupActive = pathname.startsWith("/corp");
            return (
              <div key={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isGroupActive
                      ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-600 border border-cyan-100 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isGroupActive && "text-cyan-600")} />
                  <span className="font-medium">管理者/法人</span>
                  {isGroupActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                  )}
                </div>
              </div>
            );
          }

          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-700 truncate">長谷川 麻子</p>
            <p className="text-xs text-slate-500 truncate">Pro Plan</p>
          </div>
          <Link href="/settings">
            <Settings className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
