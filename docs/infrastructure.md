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
