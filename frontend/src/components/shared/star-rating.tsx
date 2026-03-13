import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  showValue?: boolean;
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
};

export function StarRating({ rating, max = 5, size = "md", showValue = true }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            sizeMap[size],
            i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"
          )}
        />
      ))}
      {showValue && <span className="text-xs text-slate-500 ml-1">{rating}</span>}
    </div>
  );
}
