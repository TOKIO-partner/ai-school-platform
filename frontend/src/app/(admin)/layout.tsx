import { AdminSidebar } from "@/components/layouts/admin-sidebar";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { BackgroundDecoration } from "@/components/layouts/background-decoration";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-hidden">
        <BackgroundDecoration />
        <DashboardHeader title="管理ダッシュボード" badge="Admin" />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
}
