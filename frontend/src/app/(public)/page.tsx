import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronsDown,
  Cpu,
  Bot,
  Code,
  Users,
  Check,
  Star,
  Palette,
  Terminal,
  Sparkles,
  Briefcase,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-slate-50 text-slate-800 antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold tracking-tight">MOMOCRI</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">特徴</a>
              <a href="#courses" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">コース</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">料金</a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">お客様の声</a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100">
                Login
              </Link>
              <Link href="/signup" className="inline-flex items-center text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-5 py-2.5 rounded-lg transition-all shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30">
                無料体験
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/40" />
        <div className="absolute w-96 h-96 bg-cyan-400 top-20 -left-20 rounded-full blur-[80px] opacity-25 animate-pulse" />
        <div className="absolute w-80 h-80 bg-blue-500 top-40 right-10 rounded-full blur-[80px] opacity-25 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute w-72 h-72 bg-fuchsia-400 bottom-20 left-1/3 rounded-full blur-[80px] opacity-25 animate-pulse" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #334155 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-slate-200/60 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-600">2026年 春期受講生 募集中</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">AIと学ぶ、</span>
            <br />
            <span className="text-slate-900">次世代Webデザイン</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed mb-10">
            AI技術を活用した革新的な学習体験で、Webデザインスキルを効率的に習得。
            <br className="hidden sm:inline" />
            AI Tuberがあなたの学習をサポートします。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5">
              無料で始める
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 border-2 border-slate-300 hover:border-slate-400 px-8 py-4 rounded-xl transition-all hover:bg-white hover:-translate-y-0.5">
              詳しく見る
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">5,000+</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">受講生</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">98%</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">満足度</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">200+</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">コンテンツ</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronsDown className="w-6 h-6 text-slate-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">MOMOCRIが選ばれる理由</h2>
            <p className="max-w-2xl mx-auto text-slate-600">最新のAI技術と実践的なカリキュラムで、あなたの学習を最大限にサポートします。</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Cpu, color: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-500/20", title: "AI学習サポート", desc: "AIがあなたの学習進捗を分析し、最適な学習プランを個別に提案。効率的にスキルアップできます。" },
              { icon: Bot, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20", title: "AI Tuber講師", desc: "AIキャラクター「アイ」がリアルタイムであなたの質問に回答。24時間いつでも学習をサポートします。" },
              { icon: Code, color: "from-fuchsia-500 to-fuchsia-600", shadow: "shadow-fuchsia-500/20", title: "実践型カリキュラム", desc: "現場で使えるスキルを実践的に習得。実際のプロジェクトを通じて即戦力を身につけます。" },
              { icon: Users, color: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20", title: "コミュニティ", desc: "仲間と繋がり、共に成長。受講生同士の交流や勉強会で、モチベーションを維持できます。" },
            ].map((feature) => (
              <div key={feature.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg ${feature.shadow}`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wider mb-3">Courses</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">コースカテゴリー</h2>
            <p className="max-w-2xl mx-auto text-slate-600">目的に合わせた多彩なコースをご用意。基礎から応用まで体系的に学べます。</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Palette, gradient: "from-cyan-500 via-cyan-600 to-blue-700", title: "Design", desc: "UI/UXデザイン、Figma、デザインシステムの構築まで幅広く学習。", count: "12コース" },
              { icon: Terminal, gradient: "from-blue-500 via-blue-600 to-indigo-700", title: "Development", desc: "HTML/CSS、JavaScript、React、Next.jsなどのフロントエンド開発。", count: "18コース" },
              { icon: Sparkles, gradient: "from-fuchsia-500 via-fuchsia-600 to-purple-700", title: "AI", desc: "生成AI、ChatGPT活用、AIを使ったデザインワークフロー。", count: "8コース" },
              { icon: Briefcase, gradient: "from-emerald-500 via-emerald-600 to-teal-700", title: "Business", desc: "フリーランス独立、ポートフォリオ戦略、クライアントワーク。", count: "6コース" },
            ].map((course) => (
              <div key={course.title} className="group relative overflow-hidden rounded-2xl aspect-[4/5] hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient}`} />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                      <course.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{course.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                    <span>{course.count}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">料金プラン</h2>
            <p className="max-w-2xl mx-auto text-slate-600">あなたの目標に合わせた最適なプランをお選びください。</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Individual Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">個人プラン</h3>
                <p className="text-sm text-slate-500">個人学習に最適なスタンダードプラン</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">&yen;15,000</span>
                  <span className="text-sm text-slate-500">/月</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">年額 &yen;150,000（年払いで2ヶ月分お得）</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["全コースへのアクセス", "AI Tuber「アイ」の学習サポート", "コミュニティへの参加", "月2回のライブ講義", "修了証明書の発行"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full text-center text-sm font-semibold text-slate-700 border-2 border-slate-300 hover:border-cyan-500 hover:text-cyan-600 py-3 rounded-xl transition-all">
                無料で始める
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl p-8 flex flex-col shadow-2xl shadow-slate-900/20 lg:scale-105 hover:-translate-y-1.5 transition-all duration-300">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-cyan-500/30">
                  <Star className="w-3 h-3" />
                  POPULAR
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">Proプラン</h3>
                <p className="text-sm text-slate-400">本気でスキルアップしたい方に</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">&yen;25,000</span>
                  <span className="text-sm text-slate-400">/月</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">年額 &yen;250,000（年払いで2ヶ月分お得）</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["個人プランの全機能", "1on1メンタリング（月4回）", "ポートフォリオレビュー", "転職・案件獲得サポート", "限定ワークショップへの参加", "優先サポート対応"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full text-center text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
                無料で始める
              </Link>
            </div>

            {/* Business Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">法人プラン</h3>
                <p className="text-sm text-slate-500">チームでの研修・育成に</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">&yen;80,000~</span>
                  <span className="text-sm text-slate-500">/月</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">ご要望に合わせたカスタムプラン</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {["Proプランの全機能", "アカウント数 無制限", "管理ダッシュボード", "カスタムカリキュラム作成", "専任カスタマーサクセス", "請求書払い対応"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <Check className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="mailto:contact@momocri.com" className="block w-full text-center text-sm font-semibold text-slate-700 border-2 border-slate-300 hover:border-cyan-500 hover:text-cyan-600 py-3 rounded-xl transition-all">
                お問い合わせ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wider mb-3">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">お客様の声</h2>
            <p className="max-w-2xl mx-auto text-slate-600">MOMOCRIで学んだ受講生の声をご紹介します。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "田中 美咲", role: "Webデザイナー / 25歳", initial: "田", gradient: "from-cyan-400 to-blue-500", quote: "AI Tuberのアイちゃんのおかげで、つまずいた時もすぐに解決できました。未経験からわずか3ヶ月でWebデザイナーとして転職できたのは、MOMOCRIのおかげです。" },
              { name: "鈴木 健太", role: "フロントエンドエンジニア / 32歳", initial: "鈴", gradient: "from-fuchsia-400 to-purple-500", quote: "実践型のカリキュラムが素晴らしい。学んだことをすぐに業務に活かせるので、会社での評価も上がりました。AIを活用した学習方法は本当に効率的です。" },
              { name: "佐藤 あかり", role: "フリーランスデザイナー / 28歳", initial: "佐", gradient: "from-emerald-400 to-teal-500", quote: "コミュニティの仲間との交流が最高でした。同じ目標を持つ人たちと切磋琢磨できる環境は、独学では得られない大きな価値です。" },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-2xl border border-slate-100 p-6 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">「{testimonial.quote}」</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                    {testimonial.initial}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute w-80 h-80 bg-cyan-500 -top-20 -right-20 rounded-full blur-[80px] opacity-20 animate-pulse" />
        <div className="absolute w-72 h-72 bg-fuchsia-500 -bottom-20 -left-20 rounded-full blur-[80px] opacity-15 animate-pulse" style={{ animationDelay: "3s" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">今すぐ始めましょう</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto">
            まずは無料体験から。AIと一緒に、あなたのWebデザインキャリアをスタートさせましょう。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5">
              無料体験に申し込む
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-xs text-slate-500 mt-6">クレジットカード不要 ・ 7日間無料トライアル</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">MOMOCRI</span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed">AI技術を活用した次世代Webデザインスクール。あなたの学習を最適化します。</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">サービス</h4>
              <ul className="space-y-2.5">
                <li><a href="#features" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">特徴</a></li>
                <li><a href="#courses" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">コース</a></li>
                <li><a href="#pricing" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">料金</a></li>
                <li><a href="#testimonials" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">お客様の声</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">アカウント</h4>
              <ul className="space-y-2.5">
                <li><Link href="/login" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">ログイン</Link></li>
                <li><Link href="/signup" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">新規登録</Link></li>
                <li><Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">ダッシュボード</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-4">法的情報</h4>
              <ul className="space-y-2.5">
                <li><Link href="/legal/terms" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">利用規約</Link></li>
                <li><Link href="/legal/privacy" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">プライバシーポリシー</Link></li>
                <li><Link href="/legal" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">特定商取引法に基づく表記</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">&copy; 2026 MOMOCRI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
