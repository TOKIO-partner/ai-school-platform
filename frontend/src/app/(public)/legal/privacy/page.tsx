import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BackgroundDecoration } from "@/components/layouts/background-decoration";

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 text-slate-800 antialiased">
      <BackgroundDecoration />
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 mb-8">
            <ArrowLeft className="w-4 h-4" />
            トップページに戻る
          </Link>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 md:p-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">プライバシーポリシー</h1>
            <p className="text-sm text-slate-400 mb-8">最終更新日: 2026年3月1日</p>
            <div className="prose prose-slate prose-sm max-w-none">
              <h2 className="text-lg font-bold text-slate-800 mt-6 mb-3">1. 個人情報の収集</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                当社は、サービスの提供にあたり、氏名、メールアドレス等の個人情報を収集することがあります。
              </p>
              <h2 className="text-lg font-bold text-slate-800 mt-6 mb-3">2. 利用目的</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                収集した個人情報は、サービスの提供、改善、お知らせの送付等の目的で利用します。
              </p>
              <h2 className="text-lg font-bold text-slate-800 mt-6 mb-3">3. 第三者提供</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
