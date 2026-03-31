"use client";

import { useState, useCallback } from "react";
import {
  User,
  Camera,
  Lock,
  X,
  Twitter,
  Github,
  Save,
  Shield,
  Key,
  AlertTriangle,
  Trash2,
  Bell,
  BellRing,
  MessageSquare,
  Mail,
  Monitor,
  Moon,
  Sun,
  Globe,
  Type,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TabId = "profile" | "account" | "notifications" | "display";

interface Tab {
  id: TabId;
  label: string;
}

interface SkillTag {
  id: string;
  label: string;
  variant: "cyan" | "fuchsia";
}

interface SnsLink {
  id: string;
  icon: typeof Twitter;
  placeholder: string;
  value: string;
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: typeof Bell;
}

interface DisplaySetting {
  id: string;
  label: string;
  description: string;
  value: string;
  options: { value: string; label: string }[];
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const TABS: Tab[] = [
  { id: "profile", label: "プロフィール" },
  { id: "account", label: "アカウント" },
  { id: "notifications", label: "通知設定" },
  { id: "display", label: "表示設定" },
];

const INITIAL_SKILL_TAGS: SkillTag[] = [
  { id: "html-css", label: "HTML/CSS", variant: "cyan" },
  { id: "javascript", label: "JavaScript", variant: "cyan" },
  { id: "figma", label: "Figma", variant: "cyan" },
  { id: "react", label: "React", variant: "fuchsia" },
];

const INITIAL_SNS_LINKS: SnsLink[] = [
  {
    id: "twitter",
    icon: Twitter,
    placeholder: "https://twitter.com/username",
    value: "https://twitter.com/asako_design",
  },
  {
    id: "github",
    icon: Github,
    placeholder: "https://github.com/username",
    value: "https://github.com/asako-h",
  },
];

const INITIAL_NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: "course-update",
    label: "コース更新通知",
    description: "受講中のコースに新しいレッスンが追加された時に通知",
    enabled: true,
    icon: Bell,
  },
  {
    id: "community",
    label: "コミュニティ通知",
    description: "フォロー中のユーザーの投稿やコメントへの返信を通知",
    enabled: true,
    icon: MessageSquare,
  },
  {
    id: "reminder",
    label: "学習リマインダー",
    description: "学習目標の達成に向けたリマインダー通知",
    enabled: false,
    icon: BellRing,
  },
  {
    id: "email-digest",
    label: "メールダイジェスト",
    description: "週次の学習レポートをメールで受信",
    enabled: true,
    icon: Mail,
  },
];

const DISPLAY_SETTINGS: DisplaySetting[] = [
  {
    id: "theme",
    label: "テーマ",
    description: "アプリケーションの外観テーマを選択",
    value: "light",
    options: [
      { value: "light", label: "ライト" },
      { value: "dark", label: "ダーク" },
      { value: "system", label: "システム設定" },
    ],
  },
  {
    id: "language",
    label: "言語",
    description: "インターフェースの表示言語",
    value: "ja",
    options: [
      { value: "ja", label: "日本語" },
      { value: "en", label: "English" },
    ],
  },
  {
    id: "font-size",
    label: "文字サイズ",
    description: "コンテンツの文字サイズを調整",
    value: "medium",
    options: [
      { value: "small", label: "小" },
      { value: "medium", label: "中" },
      { value: "large", label: "大" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Toggle Switch Component
// ---------------------------------------------------------------------------

function ToggleSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? "bg-cyan-500" : "bg-slate-300"
      }`}
      onClick={onToggle}
    >
      <span
        className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Tab Content Components
// ---------------------------------------------------------------------------

function ProfileTab() {
  const [name, setName] = useState("長谷川 麻子");
  const [bio, setBio] = useState(
    "Webデザインとフロントエンド開発を学んでいます。AIを活用したクリエイティブワークに興味があります。"
  );
  const [skillTags, setSkillTags] = useState<SkillTag[]>(INITIAL_SKILL_TAGS);
  const [newSkill, setNewSkill] = useState("");
  const [snsLinks, setSnsLinks] = useState<SnsLink[]>(INITIAL_SNS_LINKS);

  const removeSkillTag = useCallback((id: string) => {
    setSkillTags((prev) => prev.filter((tag) => tag.id !== id));
  }, []);

  const addSkillTag = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && newSkill.trim()) {
        e.preventDefault();
        const id = newSkill.trim().toLowerCase().replace(/\s+/g, "-");
        if (!skillTags.find((t) => t.id === id)) {
          setSkillTags((prev) => [
            ...prev,
            { id, label: newSkill.trim(), variant: "cyan" },
          ]);
        }
        setNewSkill("");
      }
    },
    [newSkill, skillTags]
  );

  const updateSnsLink = useCallback((id: string, value: string) => {
    setSnsLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, value } : link))
    );
  }, []);

  const tagColorMap = {
    cyan: {
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      border: "border-cyan-100",
      hover: "hover:text-cyan-900",
    },
    fuchsia: {
      bg: "bg-fuchsia-50",
      text: "text-fuchsia-700",
      border: "border-fuchsia-100",
      hover: "hover:text-fuchsia-900",
    },
  } as const;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-cyan-600" />
        プロフィール情報
      </h2>

      {/* Avatar Upload */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            AS
          </div>
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700 mb-1">
            プロフィール画像
          </p>
          <p className="text-xs text-slate-500 mb-2">
            JPG, PNG, GIF (最大 2MB)
          </p>
          <button className="px-4 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            画像を変更
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* 氏名 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            氏名
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all bg-white"
          />
        </div>

        {/* メールアドレス */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            メールアドレス
          </label>
          <input
            type="email"
            value="asako.hasegawa@example.com"
            disabled
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            メールアドレスの変更はサポートにお問い合わせください
          </p>
        </div>

        {/* 自己紹介 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            自己紹介
          </label>
          <textarea
            rows={4}
            placeholder="あなたについて教えてください..."
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 200))}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all bg-white resize-none"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">
            {bio.length} / 200
          </p>
        </div>

        {/* スキルタグ */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            スキルタグ
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skillTags.map((tag) => {
              const colors = tagColorMap[tag.variant];
              return (
                <span
                  key={tag.id}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colors.bg} ${colors.text} text-xs font-medium rounded-full border ${colors.border}`}
                >
                  {tag.label}
                  <button
                    type="button"
                    className={colors.hover}
                    onClick={() => removeSkillTag(tag.id)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="スキルを追加 (Enterで確定)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={addSkillTag}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all bg-white"
          />
        </div>

        {/* SNSリンク */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            SNSリンク
          </label>
          <div className="space-y-3">
            {snsLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <div key={link.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-slate-500" />
                  </div>
                  <input
                    type="url"
                    placeholder={link.placeholder}
                    value={link.value}
                    onChange={(e) => updateSnsLink(link.id, e.target.value)}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all bg-white"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
        <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2">
          <Save className="w-4 h-4" />
          保存する
        </button>
      </div>
    </div>
  );
}

function AccountTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <>
      {/* Password Change */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-600" />
          パスワード変更
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              現在のパスワード
            </label>
            <input
              type="password"
              placeholder="現在のパスワードを入力"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              新しいパスワード
            </label>
            <input
              type="password"
              placeholder="新しいパスワードを入力"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all bg-white"
            />
            <p className="text-xs text-slate-400 mt-1.5">
              8文字以上、大文字・小文字・数字を含めてください
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              パスワード確認
            </label>
            <input
              type="password"
              placeholder="新しいパスワードを再入力"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all bg-white"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2">
            <Key className="w-4 h-4" />
            パスワードを更新
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-red-200 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-red-600 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          アカウントを削除すると、すべてのデータが完全に削除され、復元できません。
        </p>
        <button className="px-6 py-3 rounded-xl border-2 border-red-300 text-red-600 font-bold hover:bg-red-50 hover:border-red-400 transition-all flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          アカウントを削除
        </button>
      </div>
    </>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState<NotificationSetting[]>(
    INITIAL_NOTIFICATION_SETTINGS
  );

  const toggleSetting = useCallback((id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Bell className="w-5 h-5 text-cyan-600" />
        通知設定
      </h2>

      <div className="space-y-6">
        {settings.map((setting) => {
          const IconComponent = setting.icon;
          return (
            <div
              key={setting.id}
              className="flex items-center justify-between gap-4 py-4 border-b border-slate-100 last:border-b-0"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <IconComponent className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {setting.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {setting.description}
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={setting.enabled}
                onToggle={() => toggleSetting(setting.id)}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
        <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2">
          <Save className="w-4 h-4" />
          保存する
        </button>
      </div>
    </div>
  );
}

function DisplayTab() {
  const [displaySettings, setDisplaySettings] =
    useState<DisplaySetting[]>(DISPLAY_SETTINGS);

  const updateSetting = useCallback((id: string, value: string) => {
    setDisplaySettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value } : s))
    );
  }, []);

  const iconMap: Record<string, typeof Monitor> = {
    theme: Monitor,
    language: Globe,
    "font-size": Type,
  };

  const themeIconMap: Record<string, typeof Sun> = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Monitor className="w-5 h-5 text-cyan-600" />
        表示設定
      </h2>

      <div className="space-y-6">
        {displaySettings.map((setting) => {
          const IconComponent = iconMap[setting.id] ?? Monitor;
          return (
            <div
              key={setting.id}
              className="py-4 border-b border-slate-100 last:border-b-0"
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <IconComponent className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {setting.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {setting.description}
                  </p>
                </div>
              </div>
              <div className="ml-14 flex flex-wrap gap-2">
                {setting.options.map((option) => {
                  const isActive = setting.value === option.value;
                  const ThemeIcon =
                    setting.id === "theme"
                      ? themeIconMap[option.value]
                      : undefined;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateSetting(setting.id, option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                          : "border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {ThemeIcon && <ThemeIcon className="w-4 h-4" />}
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
        <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2">
          <Save className="w-4 h-4" />
          保存する
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="max-w-3xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? "font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                : "font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <>
          <ProfileTab />
          <AccountTab />
        </>
      )}
      {activeTab === "account" && <AccountTab />}
      {activeTab === "notifications" && <NotificationsTab />}
      {activeTab === "display" && <DisplayTab />}
    </div>
  );
}
