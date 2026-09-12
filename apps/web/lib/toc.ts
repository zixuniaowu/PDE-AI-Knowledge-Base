import GithubSlugger from "github-slugger";

interface TocItem {
  text: string;
  id: string;
}

/** Markdown の「## 見出し」から目次を作る（rehype-slug と同じ ID 規則） */
export function buildToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = line.slice(3).trim();
      return { text, id: slugger.slug(text) };
    });
}
