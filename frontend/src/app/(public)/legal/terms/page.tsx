import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BackgroundDecoration } from "@/components/layouts/background-decoration";

export default function TermsPage() {
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
            <h1 className="text-2xl font-bold text-slate-800 mb-2">利用規約</h1>
            <p className="text-sm text-slate-400 mb-8">最終更新日: 2026年3月1日</p>
            <div className="prose prose-slate prose-sm max-w-none">
              <h2 className="text-lg font-bold text-slate-800 mt-6 mb-3">第1条（適用）</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                本規約は、MOMOCRI株式会社（以下「当社」）が提供するオンライン学習サービス「MOMOCRI」（以下「本サービス」）の利用条件を定めるものです。
              </p>
              <h2 className="text-lg font-bold text-slate-800 mt-6 mb-3">第2条（利用登録）</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                利用希望者が当社の定める方法により利用登録を申請し、当社がこれを承認することで利用登録が完了するものとします。
              </p>
              <h2 className="text-lg font-bold text-slate-800 mt-6 mb-3">第3条（禁止事項）</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                ユーザーは、本サービスの利用にあたり、法令に違反する行為、当社のサービスの運営を妨害する行為、その他当社が不適切と判断する行為を行ってはなりません。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
