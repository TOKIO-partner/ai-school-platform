"use client";

import { useState } from "react";
import {
  Upload,
  Mail,
  Key,
  Shield,
  Github,
  Settings,
  Save,
  ExternalLink,
  CreditCard,
  Brain,
  Chrome,
  UserCheck,
  Megaphone,
  Clock,
  Zap,
} from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";

// ---------------------------------------------------------------------------
// Email template data
// ---------------------------------------------------------------------------

const emailTemplates = [
  {
    id: "registration",
    label: "登録確認",
    description: "新規ユーザー登録時",
    icon: UserCheck,
    previewTitle: "登録確認メール",
    greeting: "{{user_name}} 様",
    body: [
      "MOMOCRI AIスクールへのご登録ありがとうございます。",
      "以下のボタンをクリックして、メールアドレスの確認を完了してください。",
    ],
    buttonLabel: "メールアドレスを確認",
    footer: "このリンクは24時間有効です。",
  },
  {
    id: "password-reset",
    label: "パスワードリセット",
    description: "パスワード再設定時",
    icon: Key,
    previewTitle: "パスワードリセットメール",
    greeting: "{{user_name}} 様",
    body: [
      "パスワードリセットのリクエストを受け付けました。",
      "以下のボタンをクリックして、新しいパスワードを設定してください。",
    ],
    buttonLabel: "パスワードをリセット",
    footer: "このリンクは1時間有効です。",
  },
  {
    id: "announcement",
    label: "お知らせ",
    description: "お知らせ配信時",
    icon: Megaphone,
    previewTitle: "お知らせメール",
    greeting: "{{user_name}} 様",
    body: [
      "MOMOCRI AIスクールからのお知らせです。",
      "新しいコースが追加されました。ぜひご確認ください。",
    ],
    buttonLabel: "詳細を見る",
    footer: "配信停止は設定画面から行えます。",
  },
  {
    id: "reminder",
    label: "進捗リマインド",
    description: "学習リマインダー",
    icon: Clock,
    previewTitle: "学習リマインダーメール",
    greeting: "{{user_name}} 様",
    body: [
      "最近の学習から時間が経っています。",
      "前回の続きからコースを再開しましょう！",
    ],
    buttonLabel: "学習を再開する",
    footer: "リマインダー設定は設定画面から変更できます。",
  },
];

// ---------------------------------------------------------------------------
// API integration data
// ---------------------------------------------------------------------------

const apiIntegrations = [
  {
    name: "Stripe API Key",
    description: "sk_live_****************************3xFg",
    icon: CreditCard,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    connected: true,
  },
  {
    name: "OpenAI API Key",
    description: "sk-proj-****************************7mKa",
    icon: Brain,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    connected: true,
  },
  {
    name: "Google OAuth設定",
    description: "Googleアカウントでのログイン",
    icon: Chrome,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    connected: true,
  },
  {
    name: "GitHub OAuth設定",
    description: "GitHubアカウントでのログイン",
    icon: Github,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
    connected: false,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SystemSettingsPage() {
  const [siteName, setSiteName] = useState("MOMOCRI AIスクール");
  const [siteUrl, setSiteUrl] = useState("https://school.momocri.com");
  const [siteDescription, setSiteDescription] = useState(
    "MOMOCRI AIスクールは、AIとプログラミングを楽しく学べるオンライン学習プラットフォームです。AI Tuberキャラクターと一緒に、初心者から上級者まで自分のペースで学習できます。"
  );
  const [selectedTemplate, setSelectedTemplate] = useState("registration");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "ただいまシステムメンテナンスを実施しております。ご不便をおかけして申し訳ございません。メンテナンス完了予定時刻は本日18:00です。しばらくお待ちください。"
  );

  const activeTemplate =
    emailTemplates.find((t) => t.id === selectedTemplate) ?? emailTemplates[0];

  const inputClass =
    "bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 focus:bg-white w-full";

  return (
    <>
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          システム設定
        </h2>
        <p className="text-slate-500 text-sm">
          サイト全体の設定、API連携、メンテナンスモードの管理
        </p>
      </div>

      <div className="space-y-6">
        {/* ----------------------------------------------------------------- */}
        {/* 1. サイト設定 */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard title="サイト設定">
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  サイト名
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  サイトURL
                </label>
                <input
                  type="url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                サイト説明
              </label>
              <textarea
                rows={2}
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ロゴアップロード
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50 transition-colors">
                      ファイルを選択
                    </button>
                    <p className="text-xs text-slate-400 mt-1">
                      PNG, SVG（推奨: 512x512px）
                    </p>
                  </div>
                </div>
              </div>
              {/* Favicon */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ファビコンアップロード
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50 transition-colors">
                      ファイルを選択
                    </button>
                    <p className="text-xs text-slate-400 mt-1">
                      ICO, PNG（推奨: 32x32px）
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 2. メールテンプレート */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard title="メールテンプレート">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Template list */}
            <div className="lg:col-span-2 space-y-2">
              {emailTemplates.map((tmpl) => {
                const Icon = tmpl.icon;
                const isActive = tmpl.id === selectedTemplate;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      isActive
                        ? "border-2 border-cyan-200 bg-cyan-50/30"
                        : "border border-slate-200 hover:border-cyan-200 hover:bg-cyan-50/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-5 h-5 ${
                            isActive ? "text-cyan-600" : "text-slate-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {tmpl.label}
                          </p>
                          <p className="text-xs text-slate-500">
                            {tmpl.description}
                          </p>
                        </div>
                      </div>
                      <button
                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                          isActive
                            ? "bg-cyan-500 text-white hover:bg-cyan-600"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        編集
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Template preview */}
            <div className="lg:col-span-3 border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-700">
                  プレビュー: {activeTemplate.previewTitle}
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                    テスト送信
                  </button>
                </div>
              </div>
              <div className="p-6 bg-white">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-800">
                      MOMOCRI AIスクール
                    </h4>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-5 text-sm text-slate-600 space-y-3 border border-slate-100">
                    <p className="font-bold text-slate-800">
                      {activeTemplate.greeting}
                    </p>
                    {activeTemplate.body.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                    <div className="text-center py-2">
                      <span className="inline-block px-6 py-2.5 bg-cyan-500 text-white text-sm font-medium rounded-lg">
                        {activeTemplate.buttonLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {activeTemplate.footer}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 text-center mt-4">
                    &copy; 2026 MOMOCRI AIスクール
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 3. API連携 */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard title="API連携">
          <div className="space-y-4">
            {apiIntegrations.map((api) => {
              const Icon = api.icon;
              return (
                <div
                  key={api.name}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg ${api.iconBg} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${api.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {api.name}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {api.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {api.connected ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        接続済み
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        未接続
                      </span>
                    )}
                    <button
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        api.connected
                          ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                          : "bg-cyan-500 text-white hover:bg-cyan-600"
                      }`}
                    >
                      {api.connected ? "設定" : "接続"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 4. メンテナンスモード */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard title="メンテナンスモード">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  メンテナンスモードを有効にする
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  有効にすると、管理者以外のユーザーはサイトにアクセスできなくなります
                </p>
              </div>
              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={maintenanceMode}
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
                  maintenanceMode ? "bg-cyan-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    maintenanceMode ? "translate-x-6" : "translate-x-1"
                  } translate-y-1`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                メンテナンスメッセージ
              </label>
              <textarea
                rows={4}
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                className={`${inputClass} resize-y`}
              />
              <p className="text-xs text-slate-400 mt-1">
                メンテナンス中にユーザーに表示されるメッセージです
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* Save Button */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex justify-end">
          <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2">
            <Save className="w-4 h-4" />
            設定を保存
          </button>
        </div>
      </div>
    </>
  );
}
