import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PDE — Prompt-Driven Engineering Knowledge Base",
    template: "%s | PDE",
  },
  description:
    "あらゆる領域と開発プロセスにAIを組み込むための実践ナレッジベース。領域×工程のマトリクスで人とAIの協働を整理します。",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "PDE Knowledge Base",
    title: "PDE — Prompt-Driven Engineering Knowledge Base",
    description:
      "あらゆる領域と開発プロセスにAIを組み込むための実践ナレッジベース。",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: { "application/rss+xml": `${siteUrl}/feed.xml` },
  },
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
  { href: "/references/prompt-tips", label: "小技集" },
  { href: "/matrix", label: "マトリクス" },
  { href: "/references/glossary", label: "用語集" },
  { href: "/search", label: "検索" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <PwaRegister />
        <a href="#main" className="skip-link">
          本文へスキップ
        </a>
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
        <main className="container" id="main">
          {children}
        </main>
        <footer className="site-footer">
          <div className="container">
            PDE — Prompt-Driven Engineering Knowledge Base · Code: MIT / Content: CC BY 4.0 ·
            <Link href="https://github.com/zixuniaowu/PDE-AI-Knowledge-Base/blob/main/CONTRIBUTING.md">
              貢献する
            </Link>{" "}
            ·{" "}
            <a href="/feed.xml" target="_blank" rel="noopener noreferrer">
              RSS
            </a>{" "}
            ·{" "}
            <a href="/llms.txt" target="_blank" rel="noopener noreferrer">
              llms.txt
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
