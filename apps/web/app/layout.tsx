import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PDE — Prompt-Driven Engineering Knowledge Base",
    template: "%s | PDE",
  },
  description:
    "あらゆる領域と開発プロセスにAIを組み込むための実践ナレッジベース。領域×工程のマトリクスで人とAIの協働を整理します。",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

const nav = [
  { href: "/guide", label: "始め方" },
  { href: "/domains", label: "領域" },
  { href: "/process", label: "工程" },
  { href: "/patterns", label: "パターン" },
  { href: "/matrix", label: "マトリクス" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="brand">
              PDE
            </Link>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="nav-link">
                {n.label}
              </Link>
            ))}
            <a
              href="https://github.com/zixuniaowu/PDE-AI-Knowledge-Base"
              className="nav-link"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "auto" }}
            >
              GitHub
            </a>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container">
            PDE — Prompt-Driven Engineering Knowledge Base · Code: MIT / Content: CC BY 4.0 ·
            <Link href="https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/blob/main/CONTRIBUTING.md">
              貢献する
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
