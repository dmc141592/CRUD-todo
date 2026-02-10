import { useEffect, useMemo, useState } from "react";
import {
  normalizeDueDate,
  normalizePriority,
  normalizeTags,
  PRIORITIES,
} from "../models/todo.model";

/**
 * Props:
 * - onCreate: (draft) => void
 * - onUpdate: (id, patch) => void
 * - editingTodo: todo | null
 * - onCancelEdit: () => void
 */
export default function TodoForm({
  onCreate,
  onUpdate,
  editingTodo,
  onCancelEdit,
}) {
  const isEditing = Boolean(editingTodo);

  const initial = useMemo(() => {
    if (!editingTodo) {
      return {
        text: "",
        priority: "medium",
        dueDate: "",
        tags: "",
        notes: "",
      };
    }
    return {
      text: editingTodo.text ?? "",
      priority: editingTodo.priority ?? "medium",
      dueDate: editingTodo.dueDate ?? "", // "YYYY-MM-DD" or ""
      tags: Array.isArray(editingTodo.tags) ? editingTodo.tags.join(", ") : "",
      notes: editingTodo.notes ?? "",
    };
  }, [editingTodo]);

  const [text, setText] = useState(initial.text);
  const [priority, setPriority] = useState(initial.priority);
  const [dueDate, setDueDate] = useState(initial.dueDate);
  const [tags, setTags] = useState(initial.tags);
  const [notes, setNotes] = useState(initial.notes);

  useEffect(() => {
    setText(initial.text);
    setPriority(initial.priority);
    setDueDate(initial.dueDate);
    setTags(initial.tags);
    setNotes(initial.notes);
  }, [initial]);

  function resetToEmpty() {
    setText("");
    setPriority("medium");
    setDueDate("");
    setTags("");
    setNotes("");
  }

  function submit(e) {
    e.preventDefault();

    const trimmedText = String(text).trim();
    if (!trimmedText) return;

    // Convert UI fields into model-friendly values
    const draft = {
      text: trimmedText,
      priority: normalizePriority(priority),
      dueDate: normalizeDueDate(dueDate), // returns "YYYY-MM-DD" or null
      tags: normalizeTags(tags), // comma string -> array
      notes: String(notes || "").trim(),
    };

    if (isEditing) {
      onUpdate(editingTodo.id, draft);
    } else {
      onCreate(draft);
      resetToEmpty();
    }
  }

  return (
    <form
      onSubmit={submit}
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 12,
        display: "grid",
        gap: 10,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontWeight: 600 }}>Todo</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., Buy milk"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 600 }}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 600 }}>Due date</label>
          <input
            type="date"
            value={dueDate || ""}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontWeight: 600 }}>Tags</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="comma-separated, e.g., home, errands"
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontWeight: 600 }}>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="optional notes..."
          rows={3}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            style={{ padding: "10px 14px", borderRadius: 8 }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          style={{ padding: "10px 14px", borderRadius: 8, fontWeight: 700 }}
        >
          {isEditing ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
