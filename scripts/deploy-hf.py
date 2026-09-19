"""Hugging Face Spaces へ静的サイト（apps/web/out）をデプロイする。

環境変数:
  HF_TOKEN  — write 権限のトークン（必須）
  HF_SPACE  — repo_id（デフォルト: jackywangsh/fde-kb）

使い方: python3 scripts/deploy-hf.py
"""
import os

from huggingface_hub import HfApi

token = os.environ["HF_TOKEN"]
repo_id = os.environ.get("HF_SPACE", "jackywangsh/fde-kb")

api = HfApi(token=token)
api.create_repo(repo_id=repo_id, repo_type="space", space_sdk="static", exist_ok=True)
api.upload_folder(
    repo_id=repo_id,
    repo_type="space",
    folder_path="apps/web/out",
)
print(f"deployed: https://{repo_id.replace('/', '-')}.hf.space/")
