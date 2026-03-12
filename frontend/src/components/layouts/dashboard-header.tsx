"use client";

import { Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  badge?: string;
  badgeColor?: string;
}

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
        <button className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse ring-2 ring-white" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[2px] cursor-pointer shadow-md">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <span className="text-xs font-bold text-slate-700">AS</span>
          </div>
        </div>
      </div>
    </header>
  );
}
