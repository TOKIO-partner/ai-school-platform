import { Settings, Search } from "lucide-react";

const members = [
  { name: "佐藤 健太", dept: "株式会社テック", progress: 85, lastLogin: "2時間前", status: "Active", statusColor: "bg-green-50 text-green-600 border-green-200" },
  { name: "鈴木 美咲", dept: "デザインラボ", progress: 42, lastLogin: "1日前", status: "Warning", statusColor: "bg-yellow-50 text-yellow-600 border-yellow-200" },
];

export default function CorpDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">法人管理コンソール</h2>
          <p className="text-slate-500 text-sm">株式会社テック 様の受講状況レポート</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm">
          <Settings className="w-4 h-4" /> 管理設定
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "登録ユーザー数", value: "24", badge: "+2", badgeColor: "text-green-500" },
          { label: "平均進捗率", value: "68%", badge: "+5%", badgeColor: "text-green-500" },
          { label: "総学習時間", value: "1,240h" },
          { label: "AI活用回数", value: "850", badge: "High", badgeColor: "text-fuchsia-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <p className="text-slate-500 text-xs mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800">
              {stat.value}
              {stat.badge && <span className={`text-xs font-normal ${stat.badgeColor} ml-1`}>{stat.badge}</span>}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">受講者リスト</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="名前で検索..."
              className="bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-3">氏名</th>
                <th className="px-6 py-3">所属</th>
                <th className="px-6 py-3">進捗状況</th>
                <th className="px-6 py-3">最終ログイン</th>
                <th className="px-6 py-3">ステータス</th>
                <th className="px-6 py-3">アクション</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{member.name}</td>
                  <td className="px-6 py-4">{member.dept}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: `${member.progress}%` }} />
                      </div>
                      <span className="text-xs font-medium">{member.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{member.lastLogin}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${member.statusColor}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-cyan-600 hover:text-cyan-800 font-medium">詳細</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
