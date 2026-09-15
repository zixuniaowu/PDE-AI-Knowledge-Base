import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const metadata = { title: "検索" };

export default function SearchPage() {
  return (
    <div>
      <h1>検索</h1>
      <p className="lead">ナレッジベース全体を横断検索します。</p>
      <Suspense fallback={<p>読み込み中…</p>}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
