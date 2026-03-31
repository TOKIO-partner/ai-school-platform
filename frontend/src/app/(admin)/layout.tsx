"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/layouts/admin-sidebar";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { BackgroundDecoration } from "@/components/layouts/background-decoration";

const titleMap: Record<string, string> = {
  "/admin": "管理ダッシュボード",
  "/admin/users": "ユーザー管理",
  "/admin/courses": "コース管理",
  "/admin/contents": "コンテンツ管理",
  "/admin/community": "コミュニティ管理",
  "/admin/events": "イベント管理",
  "/admin/announcements": "お知らせ管理",
  "/admin/billing": "売上・決済管理",
  "/admin/ai-settings": "AI設定",
  "/admin/system": "システム設定",
  "/admin/lessons": "レッスン編集",
};

function getTitle(pathname: string): string {
  if (titleMap[pathname]) return titleMap[pathname];
  // Dynamic route patterns
  if (/^\/admin\/users\/[^/]+$/.test(pathname)) return "ユーザー詳細";
  if (/^\/admin\/lessons\/[^/]+\/edit$/.test(pathname)) return "レッスン編集";
  for (const [path, title] of Object.entries(titleMap)) {
    if (pathname.startsWith(path + "/")) return title;
  }
  return "管理ダッシュボード";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-hidden">
        <BackgroundDecoration />
        <DashboardHeader title={title} badge="Admin" />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
}
