"use client";

import { useState, useMemo } from "react";
import {
  Upload,
  Film,
  FileText,
  Image as ImageIcon,
  Archive,
  Download,
  Pencil,
  Trash2,
  HardDrive,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ContentType = "動画" | "PDF" | "画像" | "その他";
type TabFilter = "すべて" | ContentType;

interface ContentItem {
  id: string;
  filename: string;
  type: ContentType;
  size: string;
  course: string;
  uploadDate: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const contents: ContentItem[] = [
  {
    id: "1",
    filename: "lesson01_design_basics.mp4",
    type: "動画",
    size: "1.2 GB",
    course: "AI活用Webデザイン基礎",
    uploadDate: "2026/03/10",
  },
  {
    id: "2",
    filename: "color_theory_guide.pdf",
    type: "PDF",
    size: "4.5 MB",
    course: "AI活用Webデザイン基礎",
    uploadDate: "2026/03/09",
  },
  {
    id: "3",
    filename: "react_fundamentals.mp4",
    type: "動画",
    size: "890 MB",
    course: "Next.js 14 & React実践",
    uploadDate: "2026/03/08",
  },
  {
    id: "4",
    filename: "ui_components_sample.png",
    type: "画像",
    size: "2.8 MB",
    course: "AI活用Webデザイン基礎",
    uploadDate: "2026/03/07",
  },
  {
    id: "5",
    filename: "prompt_engineering_slides.pdf",
    type: "PDF",
    size: "1.8 MB",
    course: "プロンプトエンジニアリング入門",
    uploadDate: "2026/03/05",
  },
  {
    id: "6",
    filename: "ai_tools_overview.mp4",
    type: "動画",
    size: "1.5 GB",
    course: "プロンプトエンジニアリング入門",
    uploadDate: "2026/03/03",
  },
  {
    id: "7",
    filename: "thumbnail_template.png",
    type: "画像",
    size: "540 KB",
    course: "画像生成AI マスター",
    uploadDate: "2026/02/28",
  },
  {
    id: "8",
    filename: "course_materials.zip",
    type: "その他",
    size: "32 MB",
    course: "データ分析基礎",
    uploadDate: "2026/02/25",
  },
];

const tabs: TabFilter[] = ["すべて", "動画", "PDF", "画像", "その他"];

// ---------------------------------------------------------------------------
// Icon / color helpers
// ---------------------------------------------------------------------------

function typeIcon(type: ContentType) {
  switch (type) {
    case "動画":
      return Film;
    case "PDF":
      return FileText;
    case "画像":
      return ImageIcon;
    case "その他":
      return Archive;
  }
}

function typeIconBg(type: ContentType) {
  switch (type) {
    case "動画":
      return "bg-cyan-50";
    case "PDF":
      return "bg-red-50";
    case "画像":
      return "bg-green-50";
    case "その他":
      return "bg-amber-50";
  }
}

function typeIconColor(type: ContentType) {
  switch (type) {
    case "動画":
      return "text-cyan-500";
    case "PDF":
      return "text-red-500";
    case "画像":
      return "text-green-500";
    case "その他":
      return "text-amber-500";
  }
}

function typeBadgeClasses(type: ContentType) {
  switch (type) {
    case "動画":
      return "bg-cyan-50 text-cyan-600 border-cyan-200";
    case "PDF":
      return "bg-red-50 text-red-500 border-red-200";
    case "画像":
      return "bg-green-50 text-green-600 border-green-200";
    case "その他":
      return "bg-amber-50 text-amber-600 border-amber-200";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminContentsPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("すべて");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredContents = useMemo(() => {
    if (activeTab === "すべて") return contents;
    return contents.filter((c) => c.type === activeTab);
  }, [activeTab]);

  // -- selection helpers --
  const allSelected =
    filteredContents.length > 0 &&
    filteredContents.every((c) => selectedIds.has(c.id));

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContents.map((c) => c.id)));
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            コンテンツ管理
          </h2>
          <p className="text-slate-500 text-sm">
            アップロード済みファイルの管理
          </p>
        </div>
        <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
          <Upload className="w-4 h-4" />
          アップロード
        </button>
      </div>

      {/* Storage Usage */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">
              使用容量: 12.4 GB / 50 GB
            </span>
          </div>
          <span className="text-xs text-slate-400">24.8%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
            style={{ width: "24.8%" }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedIds(new Set());
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                </th>
                <th className="px-4 py-3">ファイル名</th>
                <th className="px-4 py-3">タイプ</th>
                <th className="px-4 py-3">サイズ</th>
                <th className="px-4 py-3">関連コース</th>
                <th className="px-4 py-3">アップロード日</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredContents.map((item, idx) => {
                const Icon = typeIcon(item.type);
                const isLast = idx === filteredContents.length - 1;
                return (
                  <tr
                    key={item.id}
                    className={`${
                      isLast ? "" : "border-b border-slate-50"
                    } hover:bg-slate-50/50 transition-colors`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleOne(item.id)}
                        className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      />
                    </td>

                    {/* Filename */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg ${typeIconBg(
                            item.type
                          )} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon
                            className={`w-4 h-4 ${typeIconColor(item.type)}`}
                          />
                        </div>
                        <span className="font-medium text-slate-700 truncate">
                          {item.filename}
                        </span>
                      </div>
                    </td>

                    {/* Type badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-medium border ${typeBadgeClasses(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="px-4 py-3 text-slate-500">{item.size}</td>

                    {/* Related course */}
                    <td className="px-4 py-3 text-slate-500">{item.course}</td>

                    {/* Upload date */}
                    <td className="px-4 py-3 text-slate-500">
                      {item.uploadDate}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 text-slate-400 hover:text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors"
                          title="ダウンロード"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="編集"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          title="削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
