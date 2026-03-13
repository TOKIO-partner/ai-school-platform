"use client";

import { usePathname } from "next/navigation";
import { CorpSidebar } from "@/components/layouts/corp-sidebar";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { BackgroundDecoration } from "@/components/layouts/background-decoration";

const titleMap: Record<string, string> = {
  "/corp": "Corporate Dashboard",
  "/corp/members": "Corporate Management",
  "/corp/reports": "Corporate Reports",
};

function getTitle(pathname: string): string {
  return titleMap[pathname] || "Corporate Management";
}

export default function CorpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      <CorpSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-hidden">
        <BackgroundDecoration />
        <DashboardHeader title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
}
