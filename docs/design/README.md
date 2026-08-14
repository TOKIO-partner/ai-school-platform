# 設計ドキュメント — MOMOCRI AI School Platform

実装コード（`backend/` / `frontend/`）を正とした設計書一式とユーザ操作マニュアル。

| # | ドキュメント | 内容 |
|---|---|---|
| 01 | [基本設計書](./01_基本設計書.md) | システム概要・構成・機能一覧・非機能 |
| 02 | [詳細設計書](./02_詳細設計書.md) | API仕様・認証フロー・権限マトリクス・処理フロー |
| 03 | [データベース設計](./03_データベース設計.md) | テーブル定義・ER図（dbdocs / Mermaid） |
| — | [schema.dbml](./schema.dbml) | DBMLソース（dbdocs build 用） |
| 04 | [画面遷移図](./04_画面遷移図.md) | ロール別画面遷移 |
| 05 | [ユーザ操作マニュアル](./05_ユーザ操作マニュアル.md) | ロール別操作手順 |

## DB設計の公開（dbdocs）
```bash
cd docs/design
dbdocs login                                          # 対話（Email / Access Token）
dbdocs build schema.dbml --project "MOMOCRI AI School"
# 構文検証: dbml2sql schema.dbml --postgres
```

## 前提
- Frontend: Next.js 16（Vercel） / Backend: Django REST（Render） / DB: PostgreSQL
- ロール: admin / corp_admin / instructor / student
- 未実装領域（analytics/submissions/portfolios/community/events）は各書で「今後拡張」と明記。
