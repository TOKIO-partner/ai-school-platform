"use client";

import { useState } from "react";
import {
  Plus,
  Link as LinkIcon,
  Copy,
  Globe,
  Lock,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type VisibilityStatus = "public" | "private";

type PortfolioWork = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  date: string;
  visibility: VisibilityStatus;
  gradient: string;
};

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const portfolioLink = "https://momocri.school/portfolio/hasegawa-asako-2024";

const portfolioWorks: PortfolioWork[] = [
  {
    id: 1,
    title: "AIチャットボット UI デザイン",
    description:
      "ChatGPTライクなインターフェースを独自のデザインシステムで再構築。レスポンシブ対応とダークモードを実装。",
    tags: ["#UI/UX", "#React", "#AI"],
    date: "2024年3月15日",
    visibility: "public",
    gradient: "linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 100%)",
  },
  {
    id: 2,
    title: "ECサイト リニューアル",
    description:
      "Next.js 14とStripeを使ったECサイトのフルリニューアル。決済フローの最適化とパフォーマンス改善を実施。",
    tags: ["#Next.js", "#EC", "#Stripe"],
    date: "2024年2月28日",
    visibility: "public",
    gradient: "linear-gradient(135deg, #e0e7ff 0%, #4f46e5 100%)",
  },
  {
    id: 3,
    title: "ダッシュボード分析ツール",
    description:
      "データビジュアライゼーションを活用した管理者向けダッシュボード。Rechartsによるインタラクティブなグラフ表示。",
    tags: ["#Dashboard", "#Recharts"],
    date: "2024年2月10日",
    visibility: "private",
    gradient: "linear-gradient(135deg, #fce7f3 0%, #db2777 100%)",
  },
  {
    id: 4,
    title: "レシピ共有アプリ",
    description:
      "AIが食材から最適なレシピを提案するモバイルファーストのWebアプリケーション。画像認識機能を搭載。",
    tags: ["#モバイル", "#AI", "#PWA"],
    date: "2024年1月20日",
    visibility: "public",
    gradient: "linear-gradient(135deg, #ecfdf5 0%, #059669 100%)",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PortfolioPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = portfolioLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">ポートフォリオ</h2>
        <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          作品を追加
        </button>
      </div>

      {/* Public Share Link */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-3">
          <LinkIcon className="w-4 h-4 text-cyan-600" />
          <h3 className="font-bold text-slate-800 text-sm">
            公開ポートフォリオリンク
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600 font-mono truncate">
            {portfolioLink}
          </div>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors flex items-center gap-2 shrink-0"
          >
            <Copy className="w-4 h-4" />
            {copied ? "コピー済み" : "コピー"}
          </button>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolioWorks.map((work) => (
          <div
            key={work.id}
            className="group rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className="h-48 w-full relative"
              style={{ background: work.gradient }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
              <div className="absolute top-3 right-3">
                {work.visibility === "public" ? (
                  <span className="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Globe className="w-3 h-3" /> 公開
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Lock className="w-3 h-3" /> 非公開
                  </span>
                )}
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-cyan-600 transition-colors mb-1">
                {work.title}
              </h4>
              <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                {work.description}
              </p>
              <div className="flex items-center gap-2 mb-4">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">{work.date}</span>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                    title="編集"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    title="公開設定"
                  >
                    {work.visibility === "public" ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
