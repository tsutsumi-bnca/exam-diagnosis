# 高校受験診断アプリ MVP プロジェクトガイド

このプロジェクトは、React + Vite + TypeScript で作成された診断アプリのMVP（Minimum Viable Product）です。

## 📁 フォルダ構成

```
高校受験診断/
├── index.html              # アプリの入り口（基本触らない）
├── package.json            # 設定ファイル（基本触らない）
├── src/
│   ├── main.tsx            # プログラムの開始地点
│   ├── App.tsx             # 画面の切り替えなどを行うメイン部品
│   ├── types.ts            # データの型定義
│   ├── index.css           # 全体のデザイン（CSS）
│   ├── data/
│   │   └── questions.json  # ★質問データ（ここを編集！）
│   └── components/         # 各画面の部品
│       ├── StartScreen.tsx     # スタート画面
│       ├── QuestionScreen.tsx  # 質問・回答画面
│       └── ResultScreen.tsx    # 結果表示画面（仮）
└── ...
```

## 🛠️ 質問データの編集方法

`src/data/questions.json` を開いて、質問内容を書き換えてください。
25問分、以下の形式でコピー＆ペーストして増やしてください。

```json
  {
    "id": "q1",                 // 質問ID（q1, q2... とユニークにする）
    "text": "質問文をここに書く", // 質問の文章
    "factor": "A1",             // 因子コード（A1, B2など）
    "reverse": false            // 逆転項目なら true、通常なら false
  },
```

## 🚀 次のステップ

`DEPLOYMENT.md` を読んで、このアプリをインターネット上に公開しましょう！
