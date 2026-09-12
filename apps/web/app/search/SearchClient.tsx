"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";

interface Entry {
  url: string;
  section: string;
  title: string;
  summary: string;
  body: string;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function SearchClient() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${basePath}/search-index.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setEntries)
      .catch(() => setError(true));
    inputRef.current?.focus();
  }, []);

  const fuse = useMemo(
    () =>
      entries
        ? new Fuse(entries, {
            keys: [
              { name: "title", weight: 3 },
              { name: "summary", weight: 2 },
              { name: "section", weight: 1 },
              { name: "body", weight: 1 },
            ],
            threshold: 0.35,
            ignoreLocation: true,
          })
        : null,
    [entries]
  );

  const results = useMemo(() => {
    if (!fuse || query.trim().length < 2) return [];
    return fuse.search(query.trim()).slice(0, 20);
  }, [fuse, query]);

  if (error) {
    return (
      <div className="notice">
        検索インデックスの読み込みに失敗しました。
        <code>pnpm build:mobile-content</code> で <code>search-index.json</code>{" "}
        を生成してからビルドしてください。
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="キーワードで検索（例: 採点, レビュー, RAG）"
        style={{
          width: "100%",
          padding: "12px 16px",
          fontSize: 16,
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text)",
        }}
      />

      {entries === null && <p style={{ color: "var(--text-faint)" }}>読み込み中…</p>}

      {query.trim().length >= 2 && (
        <p style={{ color: "var(--text-faint)", fontSize: 14 }}>
          {results.length} 件ヒット
        </p>
      )}

      <div className="grid" style={{ marginTop: 12 }}>
        {results.map(({ item }) => (
          <Link key={item.url} href={item.url} className="card">
            <span className="badge">{item.section}</span>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </Link>
        ))}
      </div>

      {query.trim().length < 2 && (
        <div className="notice" style={{ marginTop: 16 }}>
          領域・工程・パターン・ガイドを横断して検索できます。2 文字以上入力してください。
        </div>
      )}
    </div>
  );
}
