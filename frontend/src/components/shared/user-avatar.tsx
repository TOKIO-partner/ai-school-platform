import { cn } from "@/lib/utils";

interface UserAvatarProps {
  initials: string;
  gradient?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function UserAvatar({
  initials,
  gradient = "from-cyan-400 to-blue-500",
  size = "md",
  className,
}: UserAvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-tr flex items-center justify-center text-white font-bold shadow-md",
        gradient,
        sizeMap[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
