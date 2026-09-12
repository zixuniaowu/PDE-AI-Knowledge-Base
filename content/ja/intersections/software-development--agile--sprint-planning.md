---
id: software-development--agile--sprint-planning
type: intersection
domain: software-development
method: agile
phase: sprint-planning
title: ソフトウェア開発 × スプリントプランニング
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

## この交点の要点

- AI 生成コードは**短時間で大きな diff** を生む。プランニングでの見積もり・コミット量の物差しが変わるため「AI 補助ありのベロシティ」を別軸で計測する
- AC（受け入れ基準）は AI に下書きさせるのに最適（[リファインメント](/process/agile/backlog-refinement.md)参照）。人は価値判断に集中する

## この領域特有の注意

- 「AI ならすぐ」でコミットを増やすと、レビュー（人間）がボトルネックになる。レビュー工数も一緒にプランニングに入れる
- 生成コードの理解コストを見積もらないのが最大の落とし穴。不明なコードほどレビュー時間が読めない
