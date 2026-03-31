import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "default" | "purple";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-50 text-green-600 border-green-200",
  warning: "bg-yellow-50 text-yellow-600 border-yellow-200",
  danger: "bg-red-50 text-red-600 border-red-200",
  info: "bg-cyan-50 text-cyan-600 border-cyan-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  default: "bg-slate-50 text-slate-500 border-slate-200",
};

interface StatusBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ variant = "default", children, dot = false, className }: StatusBadgeProps) {
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1.5", variantStyles[variant], className)}>
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", {
          "bg-green-500": variant === "success",
          "bg-yellow-500": variant === "warning",
          "bg-red-500": variant === "danger",
          "bg-cyan-500": variant === "info",
          "bg-purple-500": variant === "purple",
          "bg-slate-400": variant === "default",
        })} />
      )}
      {children}
    </span>
  );
}
