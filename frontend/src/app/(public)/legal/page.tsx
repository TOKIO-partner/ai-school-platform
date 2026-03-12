import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BackgroundDecoration } from "@/components/layouts/background-decoration";

export default function LegalPage() {
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
            <h1 className="text-2xl font-bold text-slate-800 mb-8">特定商取引法に基づく表記</h1>
            <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
              <div>
                <h3 className="font-bold text-slate-800 mb-2">販売業者</h3>
                <p>MOMOCRI株式会社</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">所在地</h3>
                <p>東京都渋谷区xxx-xx-xx</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">連絡先</h3>
                <p>Email: contact@momocri.com</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">販売価格</h3>
                <p>各プランの料金ページをご確認ください。</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">支払い方法</h3>
                <p>クレジットカード（Visa, MasterCard, JCB, American Express）</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">返品・キャンセルについて</h3>
                <p>デジタルコンテンツの性質上、購入後の返品は原則としてお受けしておりません。サブスクリプションはいつでもキャンセル可能です。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
