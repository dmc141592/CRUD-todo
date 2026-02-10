function formatDue(dueDate) {
  if (!dueDate) return "";
  return `Due: ${dueDate}`;
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  return (
    <li
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 12,
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={Boolean(todo.completed)}
          onChange={() => onToggle(todo.id)}
        />

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.text}
          </div>

          <div style={{ display: "flex", gap: 10, fontSize: 13, opacity: 0.8 }}>
            <span>Priority: {todo.priority || "medium"}</span>
            {todo.dueDate ? <span>{formatDue(todo.dueDate)}</span> : null}
          </div>

          {Array.isArray(todo.tags) && todo.tags.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {todo.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 12,
                    padding: "2px 8px",
                    border: "1px solid #ccc",
                    borderRadius: 999,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {todo.notes ? (
            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>
              {todo.notes}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => onEdit(todo)}>
            Edit
          </button>
          <button type="button" onClick={() => onDelete(todo.id)}>
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
