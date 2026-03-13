"use client";

import { usePathname } from "next/navigation";
import { StudentSidebar } from "@/components/layouts/student-sidebar";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { BackgroundDecoration } from "@/components/layouts/background-decoration";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/learning": "Learning Studio",
  "/courses": "Course Library",
  "/community": "Community",
  "/events": "Events",
  "/progress": "Learning Progress",
  "/portfolio": "Portfolio",
  "/notifications": "Notifications",
  "/settings": "Settings",
  "/subscription": "Subscription",
};

function getTitle(pathname: string): string {
  if (titleMap[pathname]) return titleMap[pathname];
  for (const [path, title] of Object.entries(titleMap)) {
    if (pathname.startsWith(path + "/")) return title;
  }
  return "Dashboard";
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar />
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
