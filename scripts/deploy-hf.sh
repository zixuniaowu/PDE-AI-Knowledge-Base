#!/usr/bin/env bash
# 静的サイト（apps/web/out）を Hugging Face Spaces（sdk: static）へデプロイする。
# 前提: huggingface-cli がログイン済み（huggingface-cli login）、または HF_TOKEN 設定済み。
#
# 使い方:
#   ./scripts/deploy-hf.sh <HFユーザー名> [スペース名]
#   例: ./scripts/deploy-hf.sh zixuniaowu fde-kb
set -euo pipefail

USER="${1:?使い方: ./scripts/deploy-hf.sh <HFユーザー名> [スペース名]}"
SPACE="${2:-fde-kb}"
REPO_ID="${USER}/${SPACE}"

# out/ の最新化
if [ ! -f apps/web/out/index.html ]; then
  echo "apps/web/out がありません。pnpm build:web を先に実行してください"
  exit 1
fi

# HF Spaces は README.md の frontmatter で設定を定義する
cat > apps/web/out/README.md <<EOF
---
title: FDE Knowledge Base
emoji: 📚
colorFrom: blue
colorTo: indigo
sdk: static
pinned: false
---
# FDE — Forward Deployed Engineer Knowledge Base
EOF

# Space が無ければ作成（sdk: static、public）
python3 - <<EOF
from huggingface_hub import HfApi
api = HfApi()
api.create_repo(repo_id="${REPO_ID}", repo_type="space", space_sdk="static", exist_ok=True)
print(f"space ok: https://huggingface.co/spaces/${REPO_ID}")
EOF

# アップロード（差分同期）
huggingface-cli upload "${REPO_ID}" apps/web/out . --repo-type space

echo "✅ デプロイ完了: https://${USER}-${SPACE}.hf.space/"
