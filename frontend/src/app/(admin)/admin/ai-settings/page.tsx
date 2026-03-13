"use client";

import { useState } from "react";
import { Bot, FileText, File, Trash2, Pencil, Eye, Save } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";
import { FileUploadZone } from "@/components/shared/file-upload-zone";

interface CharacterData {
  id: number;
  name: string;
  nameEn: string;
  role: string;
  voice: string;
  personality: string;
  gradient: string;
  isMain: boolean;
}

interface UploadedFile {
  id: number;
  name: string;
  size: string;
  type: "pdf" | "md" | "txt";
}

const voiceOptions = [
  "日本語 - 女性（明るい）",
  "日本語 - 女性（落ち着き）",
  "日本語 - 男性（明るい）",
  "日本語 - 男性（落ち着き）",
];

const defaultSystemPrompt = `あなたはMOMOCRI AIスクールの学習アシスタント「アイ」です。受講生の学習をサポートし、質問に丁寧に回答してください。

以下のルールに従ってください：
- 日本語で回答すること
- 専門用語は初心者にも分かりやすく説明すること
- コード例を示す場合はコメントを付けること
- 受講生の理解度に合わせて説明の詳細度を調整すること
- 学習意欲を高めるポジティブなフィードバックを心がけること`;

const initialCharacters: CharacterData[] = [
  {
    id: 1,
    name: "アイ",
    nameEn: "Eye",
    role: "メインキャラクター",
    voice: "日本語 - 女性（明るい）",
    personality:
      "明るく親しみやすい性格。初心者にも優しく丁寧に教えることが得意。時々ユーモアを交えて場を和ませる。プログラミングとAIが大好き。",
    gradient: "from-cyan-400 to-blue-500",
    isMain: true,
  },
  {
    id: 2,
    name: "レン",
    nameEn: "Ren",
    role: "サブキャラクター",
    voice: "日本語 - 男性（明るい）",
    personality:
      "論理的で知的な性格。技術的な解説が得意で、複雑な概念をシンプルに説明する。やや真面目だが頼れる存在。",
    gradient: "from-purple-400 to-fuchsia-500",
    isMain: false,
  },
];

const initialFiles: UploadedFile[] = [
  { id: 1, name: "course_syllabus.pdf", size: "2.4 MB", type: "pdf" },
  { id: 2, name: "faq_database.md", size: "156 KB", type: "md" },
  { id: 3, name: "style_guide.txt", size: "24 KB", type: "txt" },
];

export default function AISettingsPage() {
  const [model, setModel] = useState("GPT-4o");
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
  const [tone, setTone] = useState("friendly");
  const [maxTokens, setMaxTokens] = useState(2048);
  const [characters, setCharacters] = useState<CharacterData[]>(initialCharacters);
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);

  const inputClass =
    "bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 focus:bg-white w-full";

  const handleCharacterVoiceChange = (id: number, voice: string) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, voice } : c))
    );
  };

  const handleCharacterPersonalityChange = (id: number, personality: string) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, personality } : c))
    );
  };

  const handleDeleteFile = (id: number) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const FileIcon = ({ type }: { type: string }) => {
    if (type === "pdf") {
      return <File className="w-5 h-5 text-red-500" />;
    }
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">AI設定</h2>
        <p className="text-slate-500 text-sm">
          AIチャット、AI Tuberキャラクター、コンテキスト、利用制限の設定
        </p>
      </div>

      {/* Section 1: AIチャット設定 */}
      <SectionCard title="AIチャット設定" description="AIチャットボットの基本設定">
        <div className="space-y-6">
          {/* モデル選択 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              使用モデル
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={`${inputClass} md:w-80`}
            >
              <option value="GPT-4o">GPT-4o</option>
              <option value="GPT-4">GPT-4</option>
              <option value="GPT-3.5">GPT-3.5</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              AIチャットで使用するモデルを選択してください
            </p>
          </div>

          {/* システムプロンプト */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              システムプロンプト
            </label>
            <textarea
              rows={6}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className={`${inputClass} resize-y`}
            />
            <p className="text-xs text-slate-400 mt-1">
              AIの振る舞いを定義するシステムプロンプトです
            </p>
          </div>

          {/* 回答トーン */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              回答トーン
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                { value: "friendly", label: "フレンドリー" },
                { value: "professional", label: "プロフェッショナル" },
                { value: "casual", label: "カジュアル" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="tone"
                    value={option.value}
                    checked={tone === option.value}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-4 h-4 text-cyan-600 accent-cyan-500"
                  />
                  <span className="text-sm text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 最大トークン数 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              最大トークン数
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={256}
                max={4096}
                step={64}
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 min-w-[80px] text-center">
                {maxTokens}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              AIの回答1回あたりの最大トークン数（256 - 4096）
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Section 2: AI Tuberキャラクター管理 */}
      <SectionCard
        title="AI Tuberキャラクター管理"
        description="AI Tuberキャラクターの設定・管理"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`border rounded-xl p-5 relative ${
                character.isMain
                  ? "border-cyan-200 bg-gradient-to-br from-cyan-50/50 to-blue-50/50"
                  : "border-slate-200"
              }`}
            >
              {character.isMain && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 border border-cyan-200">
                    メイン
                  </span>
                </div>
              )}
              <div className="flex flex-col items-center mb-4">
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-tr ${character.gradient} flex items-center justify-center text-white shadow-lg mb-3`}
                >
                  <Bot className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg">
                  {character.name} ({character.nameEn})
                </h4>
                <p className="text-xs text-slate-500">{character.role}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    ボイス選択
                  </label>
                  <select
                    value={character.voice}
                    onChange={(e) =>
                      handleCharacterVoiceChange(character.id, e.target.value)
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    {voiceOptions.map((voice) => (
                      <option key={voice} value={voice}>
                        {voice}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    性格・個性
                  </label>
                  <textarea
                    rows={3}
                    value={character.personality}
                    onChange={(e) =>
                      handleCharacterPersonalityChange(
                        character.id,
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button className="flex-1 px-3 py-2 bg-cyan-500 text-white text-xs font-medium rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center gap-1">
                    <Pencil className="w-3 h-3" />
                    編集
                  </button>
                  <button className="px-3 py-2 bg-white border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    プレビュー
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section 3: AIコンテキスト設定 */}
      <SectionCard
        title="AIコンテキスト設定"
        description="AIが参照する教材・資料の管理"
      >
        <div className="space-y-6">
          {/* ファイルアップロードゾーン */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              参考資料のアップロード
            </label>
            <FileUploadZone
              accept=".pdf,.txt,.md,.docx"
              label="ファイルをドラッグ&ドロップ"
              description="PDF, TXT, MD, DOCX（最大 10MB）"
            />
          </div>

          {/* アップロード済みファイル一覧 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              アップロード済みファイル
            </label>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <FileIcon type={file.type} />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">{file.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 4: 利用制限 */}
      <SectionCard title="利用制限" description="プラン別のAI利用上限設定">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Freeプラン */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Freeプラン
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  defaultValue={100}
                  className="w-28 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 focus:bg-white"
                />
                <span className="text-sm text-slate-500">回 / 月</span>
              </div>
            </div>

            {/* Proプラン */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Proプラン
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value="無制限"
                  disabled
                  className="w-28 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                />
                <span className="text-sm text-slate-500">回 / 月</span>
              </div>
            </div>

            {/* Businessプラン */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Businessプラン
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value="無制限"
                  disabled
                  className="w-28 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                />
                <span className="text-sm text-slate-500">回 / 月</span>
              </div>
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="pt-2">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl px-6 py-3 text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
              <Save className="w-4 h-4" />
              設定を保存
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
