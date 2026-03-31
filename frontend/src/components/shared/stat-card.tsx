import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  badge?: string;
  iconBg?: string;
  iconColor?: string;
  badgeBg?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  badge,
  iconBg = "bg-cyan-50",
  iconColor = "text-cyan-600",
  badgeBg = "bg-cyan-50 text-cyan-700",
}: StatCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg transition-colors", iconBg, iconColor)}>
          <Icon className="w-6 h-6" />
        </div>
        {badge && (
          <span className={cn("text-xs font-mono px-2 py-1 rounded", badgeBg)}>
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
      <p className="text-3xl font-bold text-slate-800 mt-1">
        {value}
        {suffix && <span className="text-sm text-slate-400 font-normal ml-1">{suffix}</span>}
      </p>
    </div>
  );
}
