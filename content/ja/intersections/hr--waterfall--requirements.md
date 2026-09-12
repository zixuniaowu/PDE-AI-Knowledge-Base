---
id: hr--waterfall--requirements
type: intersection
domain: hr
method: waterfall
phase: requirements
title: 人事 × 要件定義（採用要件・職務定義）
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

## この交点の要点

- 採用の「要件定義」= 職務定義・求める人物像・選考基準の設計。AI が現場ヒアリングから職務タスクの一覧と JD のたたき台を作り、人事が**業務の正確性と公平性**を確定する
- 「必須要件」の過剰設定（実際は不要な資格・経験）は AI に既存 JD との比較させて検出できる

## この領域特有の注意

- 属性に基づく条件（年齢・性別等）が要件に混入しないよう、執筆段階で避ける言葉リストを用意する（[機密情報の持ち込みルール](/patterns/confidential-inputs)とは別に「出力の規制」もある）
- 面接官が評価できる基準であること（測れない「人物像」を書かない）を検収条件にする
