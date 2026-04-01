# MOMOCRI AI School Platform - インフラ構成ガイド

## アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────┐
│                    Cloudflare (DNS/CDN)                  │
│                      無料プラン $0                        │
├──────────────────────┬──────────────────────────────────┤
│  ┌────────────┐      │  ┌────────────────────┐          │
│  │  Vercel    │      │  │  Render             │          │
│  │  Frontend  │ ───→ │  │  Web Service $7/mo  │          │
│  │  Next.js   │ API  │  │  Django + Gunicorn  │          │
│  │  $0/mo     │      │  │                    │          │
│  └────────────┘      │  │  Background Worker  │          │
│                      │  │  Celery $7/mo       │          │
│                      │  └──────┬─────────────┘          │
│              ┌───────┴───┐  ┌──┴──────┐  ┌───────────┐  │
│              │ Neon       │  │Upstash  │  │Cloudflare │  │
│              │ PostgreSQL │  │Redis    │  │R2 Storage │  │
│              │ Free $0    │  │Free $0  │  │Free $0    │  │
│              └───────────┘  └─────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────┘
```

**月額コスト: $14/月**（Celery不要なら $7/月）

---

## 1. Neon PostgreSQL セットアップ

### アカウント作成
1. https://console.neon.tech にアクセス
2. GitHub でサインアップ
3. 新規プロジェクト作成: `momocri-production`
4. Region: `Asia Pacific (Singapore)` を選択

### 接続情報の取得
1. Dashboard → Connection Details
2. Connection string をコピー（`postgresql://...?sslmode=require`）
3. この値を `DATABASE_URL` 環境変数に設定

### 初期マイグレーション
```bash
# ローカルから Neon に接続してマイグレーション実行
DATABASE_URL="postgresql://..." python manage.py migrate
```

---

## 2. Render デプロイ

### Web Service（Django API）

1. https://dashboard.render.com → New → Web Service
2. GitHub リポジトリを接続
3. 設定:
   - **Name**: `momocri-api`
   - **Region**: Singapore
   - **Root Directory**: `backend`
   - **Runtime**: Python
   - **Build Command**: `./bin/render_build.sh`
   - **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --threads 2 --timeout 120`
   - **Plan**: Starter ($7/mo)
   - **Health Check Path**: `/api/v1/health/`

4. Environment Variables を設定（`.env.example` 参照）

> **Blueprint を使う場合**: リポジトリ直下の `render.yaml` が自動検出される。
> Render Dashboard → New → Blueprint → リポジトリ選択で全サービスが一括作成される。

### Background Worker（Celery）

Blueprint を使わない場合:
1. New → Background Worker
2. 設定:
   - **Name**: `momocri-celery`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements/production.txt`
   - **Start Command**: `celery -A config worker --loglevel=info --concurrency=2`
3. Web Service と同じ環境変数を設定

---

## 3. Upstash Redis セットアップ

1. https://console.upstash.com にアクセス
2. 新規 Redis データベース作成
   - **Name**: `momocri-redis`
   - **Region**: `ap-southeast-1` (Singapore)
   - **TLS**: 有効（デフォルト）
3. Details → `UPSTASH_REDIS_REST_URL` をコピー
4. 接続文字列形式: `rediss://default:<password>@<endpoint>:6379`
5. この値を `CELERY_BROKER_URL` と `CELERY_RESULT_BACKEND` に設定

---

## 4. Cloudflare R2 セットアップ

### バケット作成
1. Cloudflare Dashboard → R2 → Create bucket
2. Bucket name: `momocri-media`
3. Location: Automatic

### API Token 作成
1. R2 → Manage R2 API Tokens → Create API token
2. Permissions: Object Read & Write
3. Bucket: `momocri-media` を指定
4. 生成された Access Key ID と Secret Access Key を記録

### 環境変数の設定
```
R2_BUCKET_NAME=momocri-media
R2_ENDPOINT_URL=https://<account_id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<access_key>
R2_SECRET_ACCESS_KEY=<secret_key>
```

### パブリックアクセス（オプション）
ユーザーに画像を配信する場合:
1. R2 → momocri-media → Settings → Public access
2. カスタムドメインを設定（例: `media.momocri.com`）
3. `R2_CUSTOM_DOMAIN=media.momocri.com` を環境変数に追加

---

## 5. Vercel フロントエンド設定

Vercel は既にデプロイ済み。API 接続の設定のみ:

1. Vercel Dashboard → Settings → Environment Variables
2. 追加:
   - `NEXT_PUBLIC_API_URL` = `https://momocri-api.onrender.com`

---

## 6. Cloudflare DNS/CDN 設定

### DNS 設定
1. ドメインを Cloudflare に追加
2. DNS レコード:
   - `api.momocri.com` → CNAME → `momocri-api.onrender.com` (Proxy: ON)
   - `media.momocri.com` → CNAME → R2 public bucket URL (Proxy: ON)

### SSL/TLS
- Full (strict) モードを設定
- Always Use HTTPS: ON
- Automatic HTTPS Rewrites: ON

---

## デプロイ検証チェックリスト

- [ ] Neon にデータベース作成完了
- [ ] `DATABASE_URL` で Django migrate 成功
- [ ] Render に Web Service デプロイ完了
- [ ] `/api/v1/health/` が `{"status": "ok"}` を返す
- [ ] Vercel の `NEXT_PUBLIC_API_URL` を Render URL に設定
- [ ] フロントエンドから API 疎通確認（ログイン等）
- [ ] Cloudflare R2 バケット作成 & API Token 発行
- [ ] 画像アップロード/取得テスト
- [ ] Upstash Redis 接続確認
- [ ] Celery タスク実行テスト

---

## トラブルシューティング

### Neon 接続エラー
- `sslmode=require` が接続文字列に含まれているか確認
- Neon のIPフィルタリングを確認（Free プランではデフォルトで全IP許可）

### Render デプロイ失敗
- Logs タブでエラー確認
- `PYTHON_VERSION` が `3.12.8` になっているか確認
- `DJANGO_SETTINGS_MODULE=config.settings.production` が設定されているか確認

### R2 アクセスエラー
- `R2_ENDPOINT_URL` が `https://<account_id>.r2.cloudflarestorage.com` 形式か確認
- API Token の権限（Object Read & Write）を確認
- バケット名が正しいか確認

### Celery タスクが実行されない
- Upstash Redis URL が `rediss://`（TLS）で始まっているか確認
- Worker のログで接続エラーがないか確認
- Upstash Free 枠の日次リミット（10,000コマンド/日）に達していないか確認

---

## スケールアップパス

| 段階 | 目安 | アクション | 追加コスト |
|------|------|-----------|-----------|
| MVP | ~100ユーザー | 現構成のまま | $7~14/月 |
| 成長期 | ~1,000 | Neon Launch ($19) | +$19/月 |
| 安定期 | ~10,000 | Render Pro ($25), Upstash Pro ($10) | +$30/月 |
| 大規模 | 10,000+ | VPS or クラスタ構成を検討 | 要見積もり |

---

## インフラコスト比較 & 推奨構成

> **結論: 現構成を維持。変更不要。**
> AWS Lightsailは3〜6倍、Vultrは約4倍のコスト。Supabaseは Django 13アプリの全面書き換えが必要で現時点では非現実的。

### 現在の構成（設定済み）

| サービス | 用途 | 月額 |
|---------|------|------|
| Vercel | Frontend (Next.js) | $0 |
| Render Starter | Django API | $7 |
| Render Worker | Celery（不要なら省略可） | $7 |
| Neon PostgreSQL | サーバーレスDB | $0 (Free tier) |
| Upstash Redis | Celery Broker | $0 (Free tier) |
| Cloudflare R2 | メディア保存 | $0 (Free 10GB/月) |
| Cloudflare | DNS/CDN | $0 |
| **合計** | | **$7〜14/月** |

> コードベースはAWS S3やLightsailを使っていない。Cloudflare R2（S3互換API）を使用中。

### コスト比較

| 構成 | サーバー | DB | ストレージ | キャッシュ | 月額合計 | 備考 |
|------|---------|-----|----------|----------|---------|------|
| **現構成 (Render)** | $7 | $0 (Neon Free) | $0 (R2 Free) | $0 (Upstash Free) | **$7〜14** | 設定済み・変更不要 |
| AWS Lightsail + S3 | $5〜10 | $15 (Managed DB) | $3〜5 (S3) | $0〜15 (ElastiCache) | **$23〜45** | セルフ管理必要 |
| Vultr VPS | $6 | $15 (Managed DB) | $5 (Object Storage) | 自前Redis | **$26〜30** | サーバー管理必要 |
| Supabase (全面移行) | $0〜25 | 含む | 含む | なし | **$0〜25** | Django全廃棄・大規模書換 |

### 各選択肢の詳細分析

#### 1. 現構成を維持（Render + Neon + R2）— 推奨

**メリット:**
- 既に全設定完了（render.yaml, production.py, .env.example）
- Free tierの組合せで最安（$7/月〜）
- Neon: サーバーレスDB、自動スケール、無料枠0.5GB
- R2: S3互換で無料10GB/月、エグレス料金なし
- デプロイはgit pushのみ（Render Blueprint）

**デメリット:**
- Render Starterはスリープあり（15分無操作で停止、初回アクセス遅延）
- Neon Free tierはコンピュート制限あり

#### 2. AWS Lightsail + S3 — 非推奨

**コスト内訳:**
- Lightsail 1GB: $5/月（2GB: $10）
- Lightsail PostgreSQL: $15/月〜
- S3: $0.025/GB + PUT/GET課金 + エグレス課金
- Redis: ElastiCache $13/月〜 or 自前Lightsailで追加$5

**なぜ高い:** マネージドDB最低$15/月（Neonなら$0）。S3はエグレス課金あり（R2は$0）。合計$23〜45/月 = 現構成の3〜6倍。

#### 3. Vultr VPS — 部分的に検討可

**コスト内訳:**
- VPS 1GB: $6/月、Managed PostgreSQL: $15/月、Object Storage (250GB): $5/月

**メリット:** スリープなし。東京リージョンあり（レイテンシ改善）。
**デメリット:** サーバー構築・管理が全て自前（nginx, SSL, systemd）。セキュリティパッチ、OS更新も自己責任。合計$26/月〜 = 現構成の約4倍。

#### 4. Supabase全面移行 — 現時点では非推奨

**何が変わる:** Django + DRF バックエンドを全廃棄。Supabaseの認証・DB・Storage・Edge Functionsに全面移行。

**コスト:** Free $0（500MB DB, 1GB Storage, 50K MAU）/ Pro $25/月

**なぜ現時点で非推奨:** Djangoバックエンドに13アプリ（accounts, courses, enrollments, ai, billing...）が実装済み。移行工数は数週間〜1ヶ月規模。Celery非同期処理の代替も必要。

### 推奨判断まとめ

| 判断基準 | 結論 |
|---------|------|
| コスト | 現構成が最安（$7/月） |
| 変更工数 | ゼロ（既に設定済み） |
| スケーラビリティ | Neon/Render共にスケール可能 |
| 運用負荷 | PaaS/サーバーレスで最小 |

### 現構成で改善できるポイント（必要時のみ）

1. **Render Starterのスリープ問題** — UptimeRobot等で定期pingすれば回避可（無料）
2. **東京リージョンでのレイテンシ** — Neon/UpstashにTokyo追加、Renderはオレゴン/シンガポールのみ
3. **将来的にSupabase検討** — 新規プロジェクトや次バージョンで採用を検討
