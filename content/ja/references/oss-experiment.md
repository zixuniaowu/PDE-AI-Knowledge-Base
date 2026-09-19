---
id: oss-experiment
type: reference
title: 実演記録 — OSS で新機能追加とバグ対応をやってみる
summary: unjs/pathe に実際に機能追加（#47）とバグ対応（#236）を試した記録。2 つのプロセスで FDE が何を判断し、AI がどこまで担えたかを図で整理する
owners: ["@zixuniaowu"]
status: draft
updated: 2026-09-16
---

この KB の理論（[工程](/process)の人間 × AI 分業）は、実際のコード変更で成立するのか。小さな OSS リポジトリ **unjs/pathe**（Node の `path` モジュールの代替ユーティリティ。テスト 467 本が全自動で回る）で、**バグ対応**と**新機能追加**を 1 回ずつ実際にやってみた記録です。

- **タスク A（バグ対応）**: Issue #236「POSIX 上でも `\` が `/` に置き換えられ、`\` を含む正しいファイル名が壊れる」
- **タスク B（機能追加）**: Issue #47「Windows で安全なファイル名・パスを作る `safeName` / `safePath` ユーティリティがほしい」

## プロセス 1: バグ対応（#236）

### 何が起きたか

```mermaid
flowchart TB
    A["Issue #236<br/>80 行の再現コード付き"] --> B["再現テストを書く<br/>4 件が赤（バグ再現を確認）"]
    B --> C["原因は 1 関数<br/>normalizeWindowsPath が<br/>無条件に \ → / に置換"]
    C --> D["修正パッチ → 再現テスト 4 件が緑"]
    D --> E["既存テストを実行すると<br/>145 件が赤"]
    E --> F{"これはバグか、仕様か"}
    F -->|"バグ"| G["契約変更 = メジャーバージョン<br/>+ 145 件のテスト書き直し"]
    F -->|"仕様"| H["README に既知の制限として記録<br/>+ 望ましい挙動をテストで保存"]
```

### 役割分担（シーケンス図）

```mermaid
sequenceDiagram
    autonumber
    actor F as FDE（人間）
    participant AI as AI エージェント
    participant R as リポジトリ

    F->>F: Issue を読み影響範囲を評価
    Note over F: パッチを書かせる前に「これは受け入れられる変更か」を先に考える
    F->>AI: 再現テストを先に書け（TDD）
    AI->>R: テスト 4 件追加 → 全赤（再現確認）
    F->>AI: 原因を特定し最小修正を出せ
    AI->>R: 原因は normalizeWindowsPath の無条件置換。修正 → 再現テスト全緑
    AI->>R: 全テスト実行 → 145 件が赤
    F->>F: 【判断】145 赤 = 契約（常に / に正規化）の変更。<br/>ブラウザでは platform 判定が不可。メジャーバージョン待け
    F->>AI: 解決案を A（変更）/ B（ドキュメント化）で比較しろ
    AI-->>F: 2 案のコストと影響の表
    F->>F: 【決定】今のバージョンでは B
    AI->>R: README に制限を追記 + 望ましい挙動を skip テストとして保存
    AI->>R: 全テスト緑（467）を確認
```

### 学び: バグ対応の本命は「コード」ではなく「判断」

AI は 15 分で「再現テスト + 修正パッチ + 失敗リスト」まで到達した。しかし最後の分岐——**145 件の赤をどう解釈するか**——は AI には決められない:

| | 案 A: 挙動を変える | 案 B: 仕様として記録（採用） |
|---|---|---|
| コード | `normalizeWindowsPath` を platform 判定で分岐 | 変更なし |
| テスト | 145 件の契約テストを書き直し（メジャー バージョン） | 再現テストを skip で保存（仕様として） |
| 利用者への影響 | Windows 形式の文字列を POSIX で処理している全コードが壊れる | `\` を含むファイル名を扱う人は README を見て回避 |
| 判断の根拠 | pathe の前提「常に POSIX 形式」を変えるという宣言が必要 | Issue 報告者自身も「確認と文書化」を求めていた |

パッチ自体はブランチ `fix/236-posix-backslash` に保存した。**メンテナーが方針を決めた日は、そこから 30 分で出荷できる**。これが AI 時代のバグ対応の形。

## プロセス 2: 新機能追加（#47 `safeName` / `safePath`）

### 進め方（テスト先行）

```mermaid
flowchart LR
    A["要件化<br/>API の形を決める<br/>（FDE の仕事）"] --> B["テストを先に書く<br/>17 件が赤"]
    B --> C["実装<br/>utils.ts に 2 関数"]
    C --> D{"テスト実行"}
    D -->|"16 緑 1 赤"| E["失敗分析<br/>→ テスト側の期待値が誤り<br/>（内部のドットは Windows で合法）"]
    E --> F["テストを修正"]
    F --> D
    D -->|"全緑"| G["lint（oxlint / oxfmt）<br/>README に追記"]
```

### 役割分担（シーケンス図）

```mermaid
sequenceDiagram
    autonumber
    actor F as FDE（人間）
    participant AI as AI エージェント
    participant R as リポジトリ

    F->>F: 【判断】API の形を決める<br/>safeName（1 ファイル名）/ safePath（区切り保持）<br/>置換文字オプション、予約語は扱わない
    F->>AI: Windows の禁止文字規則でテストを先に書け
    AI->>R: テスト 17 件 → 全赤
    AI->>R: 実装（正規表現 1 本 + セグメント分割）→ 16 緑 1 赤
    AI->>AI: 失敗を分析 → 期待値が誤り。<br/>「final..pdf」は内部のドットなので Windows で合法
    AI->>R: テスト期待値を修正 → 全緑
    AI->>R: oxlint / oxfmt も通す
    F->>F: 【レビュー】実装と限界の書き方を確認。README 追記を指示
    AI->>R: README に用法と制限を追記
    AI->>R: 全テスト 485 緑を確認
```

### 学び: 機能追加の質は「要件化の精度」で決まる

- API の形（関数名・引数・どこまで面倒を見るか）は **FDE が先に決めた**。ここが曖昧だと AI は別の形のものを作り、手戻りになる
- 面白いのはテスト 1 件の失敗。**実装ではなくテストの期待値が誤り**だった（`final..pdf` は Windows で合法）。生成物の検証は AI の仕事だが、「どちらが正しいか」の裁定に業務知識（Windows のファイル名規則）が必要だった
- テスト 17 本 → 実装 ~20 行。テスト先行なので実装の正しさを議論する必要がなかった

## 2 つのプロセスに共通する分業構造

```mermaid
flowchart LR
    subgraph HUMAN["FDE がやる（判断・責任）"]
      direction TB
      H1["タスクの選択とスコープ"]
      H2["API の形・互換性の方針"]
      H3["解決パスの決定<br/>（契約を変えるか、変えないか）"]
      H4["最終レビューと出荷判断"]
    end
    subgraph AIWORK["AI がやる（生成・検証・反復）"]
      direction TB
      A1["横断検索と原因特定"]
      A2["テストと実装の生成"]
      A3["テスト実行と失敗分析"]
      A4["ドキュメント化"]
    end
    HUMAN -->|"指示・基準・制約"| AIWORK
    AIWORK -->|"事実と選択肢"| HUMAN
```

| AI が速かった | FDE が必須だった |
|---|---|
| 既存コードの読み込みと原因特定（1 関数に絞り込み） | 「それはバグか仕様か」の裁定 |
| テスト・実装・README の生成（分単位） | API の形とスコープの決定 |
| テスト実行 → 失敗リスト → 差し戻しの反復 | 145 件の赤の解釈とメジャー/マイナーの判断 |
| 2 案の比較表の下書き | 案の選択と責任の引き受け |

## V モデルとの対応

[工程の V モデル](/process)に当てはめると、この実験は 1 回の小型 V サイクルだった:

| V の位置 | この実験での実体 |
|---|---|
| 要件定義 | Issue（#236 / #47）の受入基準を読む。API の形を決める |
| 設計 | 修正方針（platform 分岐 or ドキュメント化）・関数シグネチャ |
| 実装 | AI が生成（正規表現 1 本、2 関数） |
| UT | 追加テスト（4 本 / 17 本）が即対応 |
| 結合テスト | リポジトリ全体のテストスイート（467 本）——ここで契約違反が露見した |
| UAT | FDE が Issue の受入基準に照らして最終判断 |

## 再現手順

実験の成果物は GitHub フォーク **[zixuniaowu/pathe](https://github.com/zixuniaowu/pathe)** の 3 ブランチに公開済み（ローカルにも `~/dev/oss-lab/pathe` として同期）:

- [`fix/236-posix-backslash`](https://github.com/zixuniaowu/pathe/tree/fix/236-posix-backslash) — 案 A のパッチ（再現テスト 4 本が緑、契約テスト 145 本が赤になる状態）
- [`docs/236-known-limitation`](https://github.com/zixuniaowu/pathe/tree/docs/236-known-limitation) — 案 B（採用）。README に制限を記録、望ましい挙動を skip テストで保存
- [`feat/47-safe-name-path`](https://github.com/zixuniaowu/pathe/tree/feat/47-safe-name-path) — `safeName` / `safePath` + テスト 20 本 + README 追記

ブランチごとの検証状態（2026-09-17 再検証済み）:

| ブランチ | テスト結果 | 検証コマンド |
|---|---|---|
| `fix/236-posix-backslash` | 再現テスト 4/4 緑 | `npx vitest run test/posix-backslash.spec.ts` |
| `docs/236-known-limitation` | 467 緑 + skip 12 | `npx vitest run` |
| `feat/47-safe-name-path` | 485 緑 + skip 12 | `npx vitest run && npx oxlint .` |

数値で見る変化: テスト 467 → 485（緑）。途中状態は「赤 4（再現）→ パッチ → 赤 145（契約）→ 方針決定 → 緑」。

実戦で効いた小技は[実戦テクニック](/references/field-tips)に追記していく。検証パターンの詳細は [Evaluation](/patterns/evaluation)、レビュー前の自己点検は [Self-check](/patterns/self-check) を参照。
