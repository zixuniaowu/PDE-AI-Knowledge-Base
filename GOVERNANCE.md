# ガバナンス

PDE は「領域の専門家が領域のコンテンツに責任を持つ」ことを原則とします。

## 役割

### メンテナー（全体）
- リポジトリ全体の設計・基盤（apps, packages, schemas）に責任を持つ
- RFC の採否、新規領域オーナーの承認
- 初期メンテナー: [@zixuniaowu](https://github.com/zixuniaowu)

### 領域オーナー（Domain Owner）
- 自分の領域（`content/ja/domains/<id>/`）の正確性と品質に責任を持つ
- その領域への PR をレビューする（CODEOWNERS で自動アサイン）
- その領域の status を draft → reviewed → approved と進める

### コントリビューター
- Issue / PR / Discussion で貢献するすべての人

## 意思決定

| 種別 | 方法 |
|---|---|
| コンテンツの追加・修正 | PR（その領域のオーナー + メンテナー 1 名の承認） |
| コンテンツモデルや基盤の変更 | [RFC](./docs/rfc/)（メンテナー合議） |
| 新規領域の追加 | Issue テンプレートで提案 → メンテナー承認 → オーナー確定 |

## 領域オーナーになるには

1. 自分の領域のコンテンツを一通り整えて PR を出す
2. メンテナーと面談（Discussion で可）
3. CODEOWNERS に追加

## 変更履歴

このドキュメント自体の変更は RFC で行います。
