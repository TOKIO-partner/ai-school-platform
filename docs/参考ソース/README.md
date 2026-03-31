# HTML モックアップ 参考ソース

このディレクトリには、Next.js 変換前の HTML モックアップファイルを保管しています。
変換作業の参考資料として使用してください。

## ディレクトリ構成

```
参考ソース/
├── student/     ← 受講生向けページ（18ファイル）
├── corp/        ← 法人向けページ（3ファイル）
└── README.md
```

## 変換状況

### 変換完了（8ページ）

| HTML ファイル | Next.js パス | 備考 |
|---|---|---|
| `student/lp.html` | `/(public)/page.tsx` | LP 全セクション変換済み |
| `student/index.html` | `/(student)/dashboard/page.tsx` | ダッシュボード変換済み |
| `student/login.html` | `/(public)/login/page.tsx` | ログインフォーム完了 |
| `student/signup.html` | `/(public)/signup/page.tsx` | 個人/法人タブ付き登録 |
| `student/reset-password.html` | `/(public)/reset-password/page.tsx` | パスワードリセット完了 |
| `student/legal.html` | `/(public)/legal/page.tsx` | 特商法表記完了 |
| `student/privacy.html` | `/(public)/legal/privacy/page.tsx` | プライバシーポリシー完了 |
| `student/terms.html` | `/(public)/legal/terms/page.tsx` | 利用規約完了 |

### 部分的に変換済み（2ページ）

| HTML ファイル | Next.js パス | 備考 |
|---|---|---|
| `student/courses.html` | `/(student)/courses/page.tsx` | モックデータあり、バックエンド未連携 |
| `student/community.html` | `/(student)/community/page.tsx` | 基本レイアウトのみ |

### 未実装（8ページ） - page.tsx は存在するがスタブのみ

| HTML ファイル | Next.js パス |
|---|---|
| `student/course-detail.html` | `/(student)/courses/[courseId]/page.tsx` |
| `student/learning.html` | `/(student)/learning/page.tsx` |
| `student/progress.html` | `/(student)/progress/page.tsx` |
| `student/events.html` | `/(student)/events/page.tsx` |
| `student/portfolio.html` | `/(student)/portfolio/page.tsx` |
| `student/notifications.html` | `/(student)/notifications/page.tsx` |
| `student/subscription.html` | `/(student)/subscription/page.tsx` |
| `student/settings.html` | `/(student)/settings/page.tsx` |

### 法人向けページ

| HTML ファイル | Next.js パス | 状況 |
|---|---|---|
| `corp/index.html` | `/(corp)/corp/page.tsx` | 変換済み |
| `corp/members.html` | - | 未実装（Next.js ページなし） |
| `corp/reports.html` | - | 未実装（Next.js ページなし） |
