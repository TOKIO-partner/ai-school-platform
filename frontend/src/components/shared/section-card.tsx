import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, description, children, actions, className }: SectionCardProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-100 p-6 shadow-sm", className)}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-800">{title}</h3>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
