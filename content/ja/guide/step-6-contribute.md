---
id: step-6-contribute
type: guide
order: 6
title: STEP 6 — 知見を PDE に還元する
summary: あなたの型を、他の人が育てられる形で公開する。それが PDE コミュニティの正体
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-12
---

STEP 1〜5 で作った型は、あなたの組織の中でだけなら資産、**公開すれば業界のインフラ**になります。PDE は、各領域の専門家が自分の領域の知見を持ち寄って育てるプロジェクトです。

## 貢献の形: 3 つのレベル

### レベル A: 使ってみて気づきを出す（5 分）

- 既存コンテンツの誤り・わかりにくい点を [Issue](https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/issues/new/choose) で報告

### レベル B: 自分の領域を書く（1 〜 2 週間）

1. `content/ja/domains/_template/` をコピーして自分の領域を作る
2. STEP 2〜4 で作った役割分担表・プロンプトの型・受け入れ基準をユースケースに書く
3. PR を出す（[CONTRIBUTING.md](https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/blob/main/CONTRIBUTING.md)）

### レベル C: 領域オーナーになる

- その領域の品質に責任を持ち、他の人の PR をレビューする（[GOVERNANCE.md](https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/blob/main/GOVERNANCE.md)）

## 何を書くか: チェックリスト

あなたが次の項目を 3 つ以上答えられれば、書くべきことがあります。

- [ ] その業務で AI に任せてよいこと / いけないこと
- [ ] 実際に動いた（または動かなかった）プロンプト
- [ ] 専門家だから気づける、AI 出力の「専門的にアウトな点」
- [ ] 導入前後で比べた時間や品質の変化
- [ ] この領域特有の規制・倫理・守秘の注意点

**完璧でなくていい。`draft` ステータスで出して、レビューで育てるのがこのリポジトリの流儀です。**

次の一手: [領域一覧](/domains)を見て、あなたの領域がまだ無ければ STEP 1 の問いに答えてみてください — 「3 チェック（反復性・検証可能性・失敗コスト）」で最も高得点の業務は何ですか?
