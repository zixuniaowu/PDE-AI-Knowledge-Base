import path from "node:path";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/**
 * コンテンツ内 Markdown リンクをサイトのルート URL に書き換える。
 * - `*.md` を除去
 * - 相対リンクは linkBase（ページの URL 空間上のディレクトリ）で解決
 * - /domains/x/use-cases/y → /domains/x/y
 * - {domain}--{method}--{phase} 形式の交点ノート参照 → /matrix/... ルートへ
 */
export function rewriteHref(href: string, linkBase?: string): string {
  if (/^(https?:|mailto:|#)/.test(href)) return href;

  let h = href.replace(/\.md$/, "");
  if (!h.startsWith("/") && linkBase) {
    h = path.posix.join(linkBase, h);
  }
  h = h.replaceAll("/use-cases/", "/");

  const keyMatch = h.match(/\/([a-z0-9-]+--[a-z0-9-]+--[a-z0-9-]+)\/?$/);
  if (keyMatch) {
    const [domain, method, phaseKey] = keyMatch[1].split("--");
    return `/matrix/${domain}/${method}/${phaseKey}/`;
  }
  return h.endsWith("/") ? h : `${h}/`;
}

export function Prose({ markdown, linkBase }: { markdown: string; linkBase?: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          a: ({ href, children: inner }) => {
            const target = href ? rewriteHref(href, linkBase) : undefined;
            const external = /^https?:/.test(target ?? "");
            return (
              <a
                href={target}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {inner}
              </a>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
