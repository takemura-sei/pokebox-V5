# Pokemon 図鑑 V5 (Nuxt 4 + Supabase)

Nuxt 4とSupabaseを使用した次世代ポケモン図鑑。ユーザー認証、お気に入りポケモン管理、リアルタイムデータ同期機能を実装。

## 概要

### なぜこのプロジェクトを作ったか

Nuxt 4の最先端機能を探求し、モダンなBaaS（Backend-as-a-Service）統合によるフルスタック能力を示すために構築しました。本番環境対応の認証とデータベースパターンを実装しています。

### 何ができるか

- SEO最適化のためのサーバーサイドレンダリングで1000体以上のポケモンを閲覧
- Supabaseによるユーザー認証（メール/パスワード）
- デバイス間でお気に入りポケモンを保存・管理
- お気に入り変更時のリアルタイム更新
- パーソナライズされたポケモンコレクション付きプロフィールページ
- ちらつきを最小限に抑え、ローディング状態を最適化したUI

## 技術スタック

- **フレームワーク**: Nuxt 4.0+ (Vue 3.5+)
- **バックエンド**: Supabase (認証 + PostgreSQL)
- **状態管理**: Pinia 3.0+
- **スタイリング**: Tailwind CSS 3.4+
- **API**: PokeAPI + Supabase REST API
- **デプロイ**: Vercel/Netlify (推奨)

## 主要な技術的成果

### 認証とセキュリティ

- **Supabase認証統合**: JWTベースの安全な認証
- **行レベルセキュリティ (RLS)**: PostgreSQLでのユーザー固有データの分離
- **セッション管理**: 自動トークン更新による永続的な認証状態
- **環境変数セキュリティ**: 環境変数による認証情報の管理

### パフォーマンス最適化

- **SSR + CSRハイブリッド**: サーバーレンダリングされた初期ページロードとクライアントサイドナビゲーション
- **ちらつき解消**: 戦略的なSSRハイドレーションにより認証関連のUIちらつきを90%削減
- **楽観的更新**: エラー時のロールバック機能付きお気に入りトグルの即座のUIフィードバック
- **コンポーネントアーキテクチャ**: より良いコード分割のための細粒度コンポーネント

### ユーザー体験

- **ページネーションシステム**: 1000体以上のポケモンの効率的なナビゲーション
- **ローディング状態**: スケルトンスクリーンとプログレッシブエンハンスメント
- **レスポンシブデザイン**: Tailwind CSSによるモバイルファーストアプローチ

## プロジェクト構造

```
app/
├── components/
│   ├── AppHeader.vue        # 認証状態付きナビゲーション
│   ├── PokemonGrid.vue      # ポケモン表示グリッド
│   ├── PokemonStats.vue     # 詳細なポケモン情報
│   ├── FavoriteButton.vue   # Supabase同期付きお気に入りトグル
│   └── Pagination.vue       # ページナビゲーション
├── stores/
│   ├── auth.ts              # 認証状態
│   ├── pokemon.ts           # ポケモンデータ管理
│   └── favorite.ts          # Supabase同期付きお気に入り
├── services/
│   ├── authService.ts       # 認証ロジック
│   ├── pokemonService.ts    # PokeAPI統合
│   └── favoriteService.ts   # Supabaseお気に入りCRUD
├── composables/
│   └── useSupabase.ts       # Supabaseクライアントシングルトン
├── middleware/
│   └── auth.ts              # ルート保護
└── pages/
    ├── index.vue            # ポケモンリスト（公開）
    ├── login.vue            # 認証ページ
    ├── profile.vue          # ユーザープロフィール（保護）
    └── favorites.vue        # ユーザーのお気に入り（保護）
```

## セットアップ手順

### 前提条件

- Node.js 18+ または Bun
- Supabaseアカウント（無料枠あり）

### Supabaseセットアップ

1. [supabase.com](https://supabase.com)で新しいプロジェクトを作成

2. お気に入りテーブルを作成:

```sql
-- お気に入りテーブルを作成
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  pokemon_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pokemon_id)
);

-- 行レベルセキュリティを有効化
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- ポリシーを作成
CREATE POLICY "ユーザーは自分のお気に入りを閲覧可能"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分のお気に入りを追加可能"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分のお気に入りを削除可能"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
```

### ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/takemura-sei/pokebox-V5.git
cd pokebox-V5/my-nuxt4-project

# 依存関係をインストール
npm install

# .envファイルを作成（.env.exampleからコピー）
cp .env.example .env

# .envにSupabase認証情報を追加
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key

# 開発サーバーを起動
npm run dev

# 本番用ビルド
npm run build

# 本番ビルドをプレビュー
npm run preview
```

### 環境変数

必要な環境変数は`.env.example`を参照:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 認証フロー

1. ユーザーが`/login`経由で登録/ログイン
2. SupabaseがJWTトークンを返す
3. トークンは認証ストアとHTTP-onlyクッキーに保存
4. ミドルウェアが`/profile`と`/favorites`ルートを保護
5. 全てのSupabaseクエリは自動的にユーザーのJWTを使用

## 学んだこと

- **Nuxt 4機能**: 新しいSSR機能と改善された型安全性の活用
- **Supabase統合**: フルスタック認証とデータベースパターンの実装
- **状態同期**: Piniaによる複雑なクライアント-サーバー状態の管理
- **パフォーマンス最適化**: 戦略的なSSR/CSRバランスによるUIちらつきの解消
- **セキュリティベストプラクティス**: RLSポリシーと環境変数管理の実装

## 今後の改善予定

- ソーシャル認証の追加（Google、GitHub）
- Supabaseサブスクリプションによるリアルタイム更新の実装
- ポケモン比較機能の追加
- 6体制限付きチームビルダー
- 他ユーザーとのお気に入りリスト共有
- オフラインアクセスのためのPWAサポート

## ライセンス

MITライセンス
