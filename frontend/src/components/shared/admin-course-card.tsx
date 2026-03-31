import { Users, Star, Pencil, Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminCourseCardProps {
  id: number;
  title: string;
  icon: LucideIcon;
  iconGradient: string;
  status: "公開中" | "下書き" | "非公開";
  category: string;
  categoryColor: string;
  level: string;
  enrollmentCount: number;
  rating: number;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onTogglePublish?: () => void;
  onDelete?: () => void;
}

const statusConfig = {
  "公開中": "bg-green-50 text-green-600",
  "下書き": "bg-slate-100 text-slate-500",
  "非公開": "bg-red-50 text-red-600",
};

export function AdminCourseCard({
  title,
  icon: Icon,
  iconGradient,
  status,
  category,
  categoryColor,
  level,
  enrollmentCount,
  rating,
  onEdit,
  onDuplicate,
  onTogglePublish,
  onDelete,
}: AdminCourseCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className={cn("h-32 flex items-center justify-center bg-gradient-to-br", iconGradient)}>
        <Icon className="w-12 h-12 text-white/80" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", statusConfig[status])}>
            {status}
          </span>
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", categoryColor)}>
            {category}
          </span>
        </div>
        <h4 className="font-bold text-slate-800 mb-3 line-clamp-2">{title}</h4>
        <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
          <span className="text-xs text-slate-400">{level}</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {enrollmentCount}名
          </span>
        </div>
        <div className="flex items-center gap-0.5 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "w-4 h-4",
                star <= Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"
              )}
            />
          ))}
          <span className="text-xs text-slate-500 ml-1">{rating}</span>
        </div>
        <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
          <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
            <Pencil className="w-3.5 h-3.5" />編集
          </button>
          <button onClick={onDuplicate} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <Copy className="w-3.5 h-3.5" />複製
          </button>
          <button onClick={onTogglePublish} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            {status === "公開中" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {status === "公開中" ? "非公開" : "公開"}
          </button>
          <button onClick={onDelete} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-3.5 h-3.5" />削除
          </button>
        </div>
      </div>
    </div>
  );
}
