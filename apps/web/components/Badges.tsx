const label: Record<string, string> = {
  draft: "ドラフト",
  reviewed: "レビュー済",
  approved: "承認済",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{label[status] ?? status}</span>;
}

export function Meta({ updated, owners }: { updated: string; owners: string[] }) {
  return (
    <p style={{ color: "var(--text-faint)", fontSize: 13, margin: "4px 0 0" }}>
      更新: {updated} · オーナー: {owners.join(" ")}
    </p>
  );
}
