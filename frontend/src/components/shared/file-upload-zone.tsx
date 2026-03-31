"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  accept?: string;
  label?: string;
  description?: string;
  className?: string;
  onFileSelect?: (files: FileList) => void;
}

export function FileUploadZone({
  accept,
  label = "ファイルをドラッグ&ドロップ",
  description = "またはクリックしてアップロード",
  className,
  onFileSelect,
}: FileUploadZoneProps) {
  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/30 transition-colors",
        className
      )}
    >
      <Upload className="w-8 h-8 text-slate-400" />
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="text-xs text-slate-400">{description}</p>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files && onFileSelect?.(e.target.files)}
      />
    </label>
  );
}
