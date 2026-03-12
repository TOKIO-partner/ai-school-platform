"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Zap, Send } from "lucide-react";
import { BackgroundDecoration } from "@/components/layouts/background-decoration";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
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
          <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">パスワードリセット</h1>
          <p className="text-sm text-slate-500 text-center mb-8">
            登録済みのメールアドレスにリセットリンクを送信します
          </p>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                <Send className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-sm text-slate-600 mb-4">
                <strong>{email}</strong> にリセットリンクを送信しました。メールをご確認ください。
              </p>
              <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium text-sm">
                ログインページに戻る
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">メールアドレス</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                リセットリンクを送信
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 justify-center">
            <ArrowLeft className="w-4 h-4" />
            ログインに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
