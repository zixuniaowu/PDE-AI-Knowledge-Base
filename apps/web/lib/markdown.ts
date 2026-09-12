/** Markdown 本文を「## 見出し」単位に分解する */
export function extractSections(md: string): Record<string, string> {
  const out: Record<string, string> = {};
  let cur: string | null = null;
  let buf: string[] = [];
  for (const line of md.split("\n")) {
    if (line.startsWith("## ")) {
      if (cur) out[cur] = buf.join("\n").trim();
      cur = line.slice(3).trim();
      buf = [];
    } else if (cur) {
      buf.push(line);
    }
  }
  if (cur) out[cur] = buf.join("\n").trim();
  return out;
}
