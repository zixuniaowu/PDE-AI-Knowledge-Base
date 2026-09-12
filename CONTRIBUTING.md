# コントリビューションガイド

PDE への貢献にようこそ。**専門家であればコードは不要です。** すべてのコンテンツは Markdown + frontmatter です。

## 貢献の種類

| やりたいこと | 手順 |
|---|---|
| 新しい領域を追加したい | [新しい領域を追加](#新しい領域を追加) |
| 既存コンテンツを改善したい | ファイルを編集して PR（小さな修正は ok） |
| AI パターンの解説を書きたい | `content/ja/patterns/` に `_template.md` から新規ファイル |
| 工程ごとの協働方法を書きたい | `content/ja/process/{waterfall,agile}/` に追加 |
| 仕組み・設計を変えたい | [RFC プロセス](./docs/rfc/) を利用 |

## リポジトリを fork せず直接 PR したい場合

領域オーナーに招待されたメンバーはブランチを直接 push して PR を出せます。それ以外の方は fork PR で問題ありません。

## 新しい領域を追加

1. `content/ja/domains/_template/` を `content/ja/domains/<あなたの領域id>/` にコピー
   - id は英小文字とハイフン（例: `logistics`）
2. `meta.json` を埋める（name / description / owners など）
3. `index.md` に領域の概要と AI 活用の全体像を書く
4. `use-cases/` にユースケースを 1 つ以上追加（`_template.md` をコピー）
5. `.github/CODEOWNERS` にあなたの領域行を追加（あなたがレビューアーになります）
6. PR を出す → CI でスキーマ検証 → 領域オーナー/メンテナーがレビュー

## コンテンツのルール

- frontmatter は必須項目をすべて埋める（スキーマは [docs/content-model.md](./docs/content-model.md)）
- `status` は `draft` で始め、レビューが通ったら `reviewed`、合意形成後 `approved`
- 具体的なプロンプト例や失敗例を添えると価値が上がります
- 実名・企業機密情報は書かない

## PR のレビュー基準

- スキーマ検証（CI）を通っていること
- 「人間の役割」と「AI の役割」の切り分けが明確か
- 専門家が見て誤りがないか（その領域のオーナーが判断）

## ローカルでの確認

```bash
pnpm install
pnpm validate:content   # スキーマ検証
pnpm dev                # サイトで見た目を確認
```

## 行動規範

技術的な議論は敬意を持って。ある領域の「正しさ」はその領域のオーナーと専門コミュニティが決めます。
