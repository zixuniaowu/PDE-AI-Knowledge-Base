import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FDE — Forward Deployed Engineer Knowledge Base",
    template: "%s | FDE",
  },
  description:
    "FDE（Forward Deployed Engineer／前沿部署エンジニア）のための実践ナレッジベース。顧客の現場に入り、AI を業務に組み込み、成果指標が動くまで責任を持つ。領域×工程のマトリクスで整理します。",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "FDE Knowledge Base",
    title: "FDE — Forward Deployed Engineer Knowledge Base",
    description:
      "顧客の現場に入り、AI を業務に組み込み、成果に変える。FDE の実践知を領域×工程で整理。",
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
              FDE
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
            FDE — Forward Deployed Engineer Knowledge Base · Code: MIT / Content: CC BY 4.0 ·
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
