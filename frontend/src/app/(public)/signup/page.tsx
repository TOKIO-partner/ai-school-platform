"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, UserPlus, User, ArrowLeft, Zap } from "lucide-react";
import { BackgroundDecoration } from "@/components/layouts/background-decoration";
import { useAuth } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      setError("パスワードが一致しません。");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        username: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      router.push("/dashboard");
    } catch {
      setError("登録に失敗しました。入力内容を確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased selection:bg-cyan-200">
      <BackgroundDecoration />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 tracking-wider">
            MOMOCRI
          </span>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">新規登録</h1>
          <p className="text-sm text-slate-500 text-center mb-8">アカウントを作成してAI学習を始めましょう</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">姓</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="山田"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">名</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="太郎"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">メールアドレス</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">パスワード</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="8文字以上"
                  required
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">パスワード（確認）</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={formData.password_confirm}
                  onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                  placeholder="もう一度入力"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-5 h-5" />
              {isLoading ? "登録中..." : "アカウントを作成"}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-4">
            登録することで<Link href="/legal/terms" className="text-cyan-600 hover:underline">利用規約</Link>および
            <Link href="/legal/privacy" className="text-cyan-600 hover:underline">プライバシーポリシー</Link>に同意します。
          </p>

          <p className="text-sm text-slate-500 text-center mt-6">
            すでにアカウントをお持ちですか？{" "}
            <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors">ログイン</Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 justify-center">
            <ArrowLeft className="w-4 h-4" />
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
