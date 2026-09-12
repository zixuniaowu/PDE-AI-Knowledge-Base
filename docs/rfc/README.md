# RFC（Request for Comments）

コンテンツモデル、スキーマ、サイト構造など「基盤」に関わる変更は、いきなり実装せず RFC で合意を取ります。

## 流れ

1. `template.md` をコピーして `NNNN-タイトル.md` として作成（NNNN は連番）
2. Pull Request を出す（ラベル `rfc`）
3. レビュー期間（最低 7 日）で議論
4. メンテナーが `accepted` / `rejected` を判定
5. 採用されたら実装 PR を出す。RFC の status を `accepted` に更新

## 採用基準

- 拡張モデル（docs/architecture.md）と矛盾しない
- 既存コンテンツの移行コストが明示されている
- 「領域の専門家が Markdown だけで貢献できる」原則を損なわない
