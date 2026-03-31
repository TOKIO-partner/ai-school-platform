import Link from "next/link";
import { Play, BookOpen, Cpu } from "lucide-react";

interface CourseCardProps {
  id: number | string;
  title: string;
  progress: number;
  lessons: string;
  gradient: string;
  href?: string;
}

export function CourseCard({ id, title, progress, lessons, gradient, href }: CourseCardProps) {
  const linkHref = href || `/courses/${id}`;

  return (
    <div className="group relative rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="h-40 w-full relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
        <Link
          href={linkHref}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg"
        >
          <Play className="w-5 h-5 text-white ml-1 fill-current" />
        </Link>
      </div>
      <div className="p-5">
        <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-cyan-600 transition-colors">
          {title}
        </h4>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> {lessons} レッスン
          </span>
          <span className="flex items-center gap-1 text-cyan-600 font-medium">
            <Cpu className="w-3 h-3" /> AI分析あり
          </span>
        </div>
      </div>
    </div>
  );
}
