# 🏋️ Training Diary

筋トレの記録をカレンダーで管理するモチベーション特化型Webアプリ。

## ✨ 機能

- 📅 **カレンダービュー** — 月ごとの筋トレ記録を一覧表示
- 🏷️ **部位タグ管理** — 胸 / 肩 / 2頭筋 / 3頭筋 など複数部位に対応
- 📝 **日記エディター** — 選択した日付にコメントとタグを記録
- 🔥 **ストリーク表示** — 連続記録日数をモチベーション表示
- 📊 **タグページ** — 部位ごとの記録履歴を一覧確認

## 🛠️ 技術スタック

| 項目 | 使用技術 |
|------|----------|
| フロントエンド | React 19 |
| ルーティング | React Router DOM v7 |
| ビルドツール | Vite 7 |
| スタイリング | カスタム CSS（グラデーション / アニメーション） |
| データ保存 | localStorage |
| デプロイ | Netlify（GitHub連携 / 自動デプロイ） |

## 🚀 セットアップ

### 必要な環境

- Node.js `>=20.19.0` または `>=22.12.0`

### インストールと起動
```bash
# リポジトリをクローン
git clone https://github.com/your-username/training-diary2.git
cd training-diary2

# 依存パッケージをインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

### ビルド
```bash
npm run build
```

ビルド成果物は `dist/` フォルダに出力される。

## 📁 ディレクトリ構成
```
training-diary2/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx       # ヘッダー
│   │   ├── Calendar.jsx     # カレンダー表示
│   │   ├── DiaryEditor.jsx  # 日記入力エディター
│   │   └── Streak.jsx       # ストリーク表示
│   ├── pages/
│   │   └── TagPage.jsx      # タグ別記録一覧ページ
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## 🌐 デプロイ

GitHub リポジトリと Netlify を連携することで、`main` ブランチへのプッシュ時に自動デプロイが実行される。
```
[StackBlitz / VS Code] → [GitHub push] → [Netlify 自動ビルド & デプロイ]
```

## 📌 使い方

1. カレンダーの日付をクリックして記録したい日を選択
2. 部位タグ（胸・肩など）を選択
3. コメントを入力して保存ボタンを押す
4. ヘッダーのタグメニューから部位別の記録一覧ページへ移動可能

## 📝 ライセンス

MIT