# GPT-5 Generated Sample App

製造工程進捗ダッシュボード (React + TypeScript + Vite)。

## 前提
- Node.js 18 以上
- npm (同梱)

## インストール
プロジェクトルートで以下を実行してください:
```bash
npm install
```

## 開発サーバー起動
```bash
npm run dev
```
ブラウザで http://localhost:5173 を開きます。

## ビルド
```bash
npm run build
```
`dist/` に成果物が生成されます。

## ローカルプレビュー
ビルド後に:
```bash
npm run preview
```

## 型チェックのみ
```bash
npm run typecheck
```

## ディレクトリ構成 (抜粋)
```
src/
	App.tsx              メインアプリ
	main.tsx             Vite エントリ
	components/          UI コンポーネント
	hooks/               カスタムフック
	data/                モック API
```

## 主な使用ライブラリ
- react / react-dom
- recharts (グラフ表示)
- vite (開発/ビルド)
- typescript
