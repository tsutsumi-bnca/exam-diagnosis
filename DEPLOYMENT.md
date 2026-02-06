# 🌐 公開手順書 (GitHub + Cloudflare Pages)

エンジニアでなくてもできる、最も簡単な公開手順です。

## 手順1: GitHubにアップロード

1.  ブラウザで [GitHub](https://github.com/) にログインし、右上の「+」から「New repository」をクリック。
2.  **Repository name** に `exam-diagnosis` (など好きな名前) を入力。
3.  **Visible** は `Public` (誰でも見れる) または `Private` (自分だけ) を選択。（最初はPrivateでもOKですが、無料枠の制限が少し厳しい場合があります。通常はPublic推奨）
4.  「Create repository」ボタンをクリック。
5.  作成後の画面に表示されるコマンドを使いますが、まずは手元のPCで準備します。

### Macのターミナルでの操作
今のフォルダ（`高校受験診断`）で以下のコマンドを順番に実行（コピペ）してください。

```bash
# Gitの初期化
git init

# 全ファイルを登録
git add .

# 保存（コミット）
git commit -m "First commit: MVP作成"

# GitHubと紐付け (※ xxxx はあなたのGitHubユーザー名に変えてください)
# GitHubの画面にある "git remote add origin..." という行をコピペするのが確実です
git remote add origin https://github.com/xxxx/exam-diagnosis.git

# アップロード
git push -u origin main
```

## 手順2: Cloudflare Pages で公開

1.  [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン（未登録ならSign up）。
2.  左メニューの「Workers & Pages」→「Overview」をクリック。
3.  「Create application」→「Pages」タブ →「Connect to Git」をクリック。
4.  GitHubアカウントを接続し、さっき作った `exam-diagnosis` リポジトリを選択。「Begin setup」をクリック。

### Builds & deployments 設定 (ここが重要！)

以下の設定を確認・入力してください。

*   **Project name**: そのままでOK
*   **Production branch**: `main`
*   **Framework preset**: `Vite` (リストから選択)
    *   選択すると、Build command が `npm run build`、Build output が `dist` に自動入力されます。もしされなければ手入力してください。

5.  「Save and Deploy」をクリック。

## 完了！

数分待つと、「Success!」と表示されます。
発行されたURL（例: `https://exam-diagnosis.pages.dev`）にスマホからアクセスしてみてください。
診断アプリが動いているはずです！
