# 🏋️ Training Diary
筋トレの記録をカレンダーで管理するモチベーション特化型Webアプリ。

## ✨ 機能
* 📅 **カレンダービュー** — 月ごとの筋トレ記録を一覧表示
* 🏷️ **部位タグ管理** — 胸 / 肩 / 2頭筋 / 3頭筋 など複数部位に対応
* 📝 **日記エディター** — 選択した日付にコメントとタグを記録
* 🔥 **ストリーク表示** — 連続記録日数をモチベーション表示
* 📊 **タグページ** — 部位ごとの記録履歴を一覧確認
* 🔐 **Googleログイン** — Firebase Authentication によるユーザー認証
* ☁️ **クラウド同期** — Firestore によるリアルタイムデータ保存

## 🛠️ 技術スタック

| 項目 | 使用技術 |
|------|----------|
| フロントエンド | React 19 |
| ルーティング | React Router DOM v7 |
| ビルドツール | Vite 7 |
| スタイリング | カスタム CSS（グラデーション / アニメーション） |
| 認証 | Firebase Authentication（Google ログイン） |
| データ保存 | Cloud Firestore |
| デプロイ | Netlify（GitHub連携 / 自動デプロイ） |

## 🚀 セットアップ

### 必要な環境
* Node.js `>=20.19.0` または `>=22.12.0`
* Firebase プロジェクト（後述）

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

## 🔥 Firebase セットアップ

### 1. Firebase プロジェクトを作成
1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」からプロジェクトを新規作成
3. ウェブアプリを追加してアプリの設定情報を取得

### 2. Authentication を有効化
1. Firebase Console → **Authentication** → **Sign-in method**
2. **Google** を有効化

### 3. Firestore を有効化
1. Firebase Console → **Firestore Database** → 「データベースを作成」
2. セキュリティルールを以下に設定：
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. 環境変数を設定
プロジェクトルートに `.env` ファイルを作成し、Firebase の設定情報を記載：
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ `.env` ファイルは `.gitignore` に追加して、GitHub にプッシュしないよう注意。

### 5. Netlify への環境変数設定
Netlify でデプロイする場合、**Site settings → Environment variables** から上記の変数を同様に登録する。

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
│   ├── firebase.js          # Firebase 初期化・設定
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── .env                     # 環境変数（Git管理外）
└── package.json
```

## 🌐 デプロイ
GitHub リポジトリと Netlify を連携することで、`main` ブランチへのプッシュ時に自動デプロイが実行される。
```
[StackBlitz / VS Code] → [GitHub push] → [Netlify 自動ビルド & デプロイ]
```

## 📌 使い方
1. アプリにアクセスして **Google アカウントでログイン**
2. カレンダーの日付をクリックして記録したい日を選択
3. 部位タグ（胸・肩など）を選択
4. コメントを入力して保存ボタンを押す
5. ヘッダーのタグメニューから部位別の記録一覧ページへ移動可能
6. データはクラウドに自動保存され、どのデバイスからでも確認可能

## 📝 ライセンス
MIT