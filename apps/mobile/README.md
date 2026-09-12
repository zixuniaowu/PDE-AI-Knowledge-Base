# @pde/mobile

PDE ナレッジベースの Expo アプリ。

## 開発

```bash
# リポジトリルートで実行（モバイル用 JSON を生成してから起動）
pnpm build:mobile-content
pnpm --filter @pde/mobile start
```

## ビルド（EAS）

`eas.json` を用意済み。初回は `npm install -g eas-cli` → `eas login` のうえ:

```bash
cd apps/mobile
eas build --profile preview --platform all   # 内部配布
eas build --profile production --platform all  # ストア申請用
```

Apple Developer Program / Google Play Console のアカウント設定が必要です。

## データフロー

コンテンツは `pnpm build:mobile-content` が生成する `src/data/content.json` をバンドルして読みます。アプリ自身はコンテンツを持たず、Web と同じデータを表示する「レンダラー」です。
