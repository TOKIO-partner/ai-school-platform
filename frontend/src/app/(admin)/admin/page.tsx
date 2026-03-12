import { Users, CreditCard, TrendingUp, Cpu } from "lucide-react";

const activities = [
  { name: "田中 翔", action: "が課題を提出しました", detail: "AI基礎コース - 第3章 演習問題", time: "2分前", gradient: "from-blue-400 to-cyan-400", initial: "田" },
  { name: "鈴木 美咲", action: "新規登録:", detail: "個人プラン - Freeプラン", time: "1時間前", gradient: "from-fuchsia-400 to-pink-400", initial: "鈴", prefix: true },
  { name: "山田 太郎", action: "がProプランにアップグレード", detail: "月額プラン ¥4,980/月", time: "3時間前", gradient: "from-amber-400 to-orange-400", initial: "山" },
  { name: "株式会社テックイノベーション", action: "法人登録:", detail: "Businessプラン - 10アカウント", time: "5時間前", gradient: "from-emerald-400 to-green-400", initial: "株", prefix: true },
  { name: "高橋 優子", action: "がコースを完了しました", detail: "プロンプトエンジニアリング実践 - 修了証発行", time: "昨日", gradient: "from-violet-400 to-purple-400", initial: "高" },
];

export default function AdminDashboardPage() {
  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">+12</span>
          </div>
          <p className="text-sm text-slate-500 mb-1">総ユーザー数</p>
          <p className="text-3xl font-bold text-slate-800">156</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">+8%</span>
          </div>
          <p className="text-sm text-slate-500 mb-1">月間売上</p>
          <p className="text-3xl font-bold text-slate-800">&yen;2,400,000</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">平均受講率</p>
          <p className="text-3xl font-bold text-slate-800">72%</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">AI利用回数</p>
          <p className="text-3xl font-bold text-slate-800">3,200</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">売上推移（月次）</h3>
            <select className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none">
              <option>2026年</option>
              <option>2025年</option>
            </select>
          </div>
          <div className="flex items-end gap-3 h-48 px-2">
            {[60, 70, 55, 80, 75, 90, 85, 65, 78, 88, 92, 100].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t-md" style={{ height: `${height}%` }} />
                <span className="text-[10px] text-slate-400">{i + 1}月</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">ユーザー数推移</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />個人</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" />法人</span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-48 px-2">
            {[40, 48, 52, 58, 62, 70, 74, 76, 82, 88, 94, 100].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col rounded-t-md overflow-hidden" style={{ height: `${height}%` }}>
                  <div className="flex-[3] bg-cyan-400" />
                  <div className={`flex-[${Math.min(1 + i * 0.2, 3)}] bg-fuchsia-400`} />
                </div>
                <span className="text-[10px] text-slate-400">{i + 1}月</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">最近のアクティビティ</h3>
          <a href="#" className="text-xs text-cyan-600 hover:text-cyan-700 font-medium">すべて表示</a>
        </div>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${activity.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                {activity.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">
                  {activity.prefix ? (
                    <>{activity.action} <span className="font-bold">{activity.name}</span></>
                  ) : (
                    <><span className="font-bold">{activity.name}</span>{activity.action}</>
                  )}
                </p>
                <p className="text-xs text-slate-400">{activity.detail}</p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
