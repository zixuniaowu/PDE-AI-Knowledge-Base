/**
 * E2E 実行時のパス接頭辞。
 * E2E_BASE_URL で basePath 付きの本番 URL（GitHub Pages 等）を検証する場合は
 * E2E_BASE_PATH も設定する（例: /PDE-AI-Knowledge-Base）。
 */
export const PREFIX = process.env.E2E_BASE_PATH ?? "";

/** テスト内のパスに接頭辞を付ける */
export const p = (path: string): string => `${PREFIX}${path}`;
