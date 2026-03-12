import { Zap } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  href?: string;
  showBadge?: string;
}

export function Logo({ href = "/dashboard", showBadge }: LogoProps) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
        <Zap className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 tracking-wider">
        MOMOCRI
      </span>
      {showBadge && (
        <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-md uppercase tracking-wider">
          {showBadge}
        </span>
      )}
    </Link>
  );
}
