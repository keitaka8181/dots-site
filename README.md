# Shion - Interactive Dot Typography

カーソルに反応するインタラクティブなドットタイポグラフィサイト。

![Preview](https://via.placeholder.com/800x400/06060a/78a0ff?text=Shion)

## 特徴

- 「Shion」の文字を無数のドットで構成
- カーソルが近づくとドットが散らばる
- カーソルが離れると文字が再構成される
- 読み込み時のアニメーション演出
- タッチデバイス対応

---

## デプロイ手順

### 1. GitHubリポジトリを作成

1. [GitHub](https://github.com) にログイン
2. 右上の「+」→「New repository」をクリック
3. Repository name: `shion-dots`（任意の名前）
4. 「Create repository」をクリック

### 2. プロジェクトをアップロード

#### 方法A: GitHub Web UI（簡単）

1. 作成したリポジトリページで「uploading an existing file」をクリック
2. このフォルダ内の全ファイルをドラッグ＆ドロップ
3. 「Commit changes」をクリック

#### 方法B: Git コマンド

```bash
# このフォルダに移動
cd shion-dots

# Git初期化
git init
git add .
git commit -m "Initial commit"

# GitHubに接続（URLは自分のリポジトリに変更）
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/shion-dots.git
git push -u origin main
```

### 3. Vercelでデプロイ

1. [Vercel](https://vercel.com) にアクセス
2. 「Sign Up」→「Continue with GitHub」でGitHubアカウントと連携
3. ダッシュボードで「Add New...」→「Project」
4. 「Import Git Repository」から先ほど作成したリポジトリを選択
5. 設定はそのままで「Deploy」をクリック
6. 1〜2分でデプロイ完了！

デプロイ後、`https://shion-dots.vercel.app` のようなURLが発行されます。

---

## ローカルで実行

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

---

## カスタマイズ

`src/App.jsx` の `CONFIG` オブジェクトで調整可能：

| 項目 | 説明 | デフォルト |
|------|------|-----------|
| `text` | 表示するテキスト | `'Shion'` |
| `fontSize` | 文字サイズ | `180` |
| `dotSpacing` | ドット間隔（小さいほど密） | `4` |
| `dotRadius` | ドットの大きさ | `1.8` |
| `mouseRadius` | カーソル影響範囲 | `80` |
| `pushStrength` | 押し出す強さ | `70` |
| `baseColor` | 通常時の色 | グレー |
| `activeColor` | 活性時の色 | 青 |
| `bgColor` | 背景色 | `'#06060a'` |

---

## ライセンス

MIT
