export default function FilterBar({
  filter,
  onChange,
  totalCount,
  remainingCount,
  completedCount,
}) {
  const items = [
    { key: "all", label: `All (${totalCount})` },
    { key: "active", label: `Active (${remainingCount})` },
    { key: "completed", label: `Completed (${completedCount})` },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        {items.map((it) => (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            style={{
              padding: "8px 10px",
              borderRadius: 999,
              fontWeight: filter === it.key ? 800 : 500,
            }}
          >
            {it.label}
          </button>
        ))}
      </div>

      <div style={{ opacity: 0.8, fontSize: 13 }}>
        {remainingCount} left
      </div>
    </div>
  );
}
