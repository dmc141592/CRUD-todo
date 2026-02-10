// src/models/todo.model.js

export const PRIORITIES = ["low", "medium", "high"];
export const DEFAULT_PRIORITY = "medium";

/**
 * Normalize and validate a date string in YYYY-MM-DD format.
 * Returns null if invalid/empty.
 */
export function normalizeDueDate(dueDate) {
  if (!dueDate) return null;
  const s = String(dueDate).trim();

  // Expect YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;

  // Basic real-date check
  const d = new Date(`${s}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;

  // Ensure round-trip matches (catches 2026-02-31 etc.)
  const [y, m, day] = s.split("-").map(Number);
  if (
    d.getUTCFullYear() !== y ||
    d.getUTCMonth() + 1 !== m ||
    d.getUTCDate() !== day
  ) {
    return null;
  }

  return s;
}

/**
 * Normalize tags into a unique, trimmed, non-empty string array.
 */
export function normalizeTags(tags) {
  if (!tags) return [];
  const arr = Array.isArray(tags) ? tags : String(tags).split(",");
  const cleaned = arr
    .map((t) => String(t).trim())
    .filter(Boolean);

  // de-dupe (case-insensitive)
  const seen = new Set();
  const unique = [];
  for (const t of cleaned) {
    const key = t.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(t);
    }
  }
  return unique;
}

/**
 * Normalize priority into "low" | "medium" | "high".
 */
export function normalizePriority(priority) {
  const p = String(priority || "").toLowerCase().trim();
  return PRIORITIES.includes(p) ? p : DEFAULT_PRIORITY;
}

/**
 * UI -> Model: create a new Todo object (client-side)
 * Backend-friendly: uses ISO timestamps and nullables.
 */
export function createTodo({
  text,
  priority,
  dueDate,
  tags,
  notes,
} = {}) {
  const trimmedText = String(text || "").trim();

  return {
    id: crypto.randomUUID(),
    text: trimmedText,
    completed: false,

    priority: normalizePriority(priority),
    dueDate: normalizeDueDate(dueDate),     // "YYYY-MM-DD" or null
    tags: normalizeTags(tags),              // string[]
    notes: String(notes || "").trim() || "",

    completedAt: null,                      // ISO timestamp or null

    // REST-friendly timestamps (recommended)
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * API -> UI: normalize a Todo coming from the backend
 * so your UI never crashes on missing/dirty fields.
 */
export function fromApiTodo(apiTodo) {
  const t = apiTodo || {};

  return {
    id: String(t.id || ""),
    text: String(t.text || "").trim(),
    completed: Boolean(t.completed),

    priority: normalizePriority(t.priority),
    dueDate: normalizeDueDate(t.dueDate),
    tags: normalizeTags(t.tags),
    notes: String(t.notes || "").trim() || "",

    completedAt: t.completedAt ? String(t.completedAt) : null,

    createdAt: t.createdAt ? String(t.createdAt) : null,
    updatedAt: t.updatedAt ? String(t.updatedAt) : null,
  };
}

/**
 * UI -> API: build a payload safe to send to REST endpoints.
 * Useful to avoid sending UI-only fields accidentally.
 */
export function toApiTodo(todo) {
  return {
    id: todo.id,
    text: todo.text,
    completed: todo.completed,

    priority: normalizePriority(todo.priority),
    dueDate: normalizeDueDate(todo.dueDate),
    tags: normalizeTags(todo.tags),
    notes: String(todo.notes || "").trim() || "",

    completedAt: todo.completedAt ? String(todo.completedAt) : null,

    createdAt: todo.createdAt || null,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Convenient update helper for toggling completion (keeps completedAt correct).
 */
export function toggleCompleted(todo) {
  const completed = !todo.completed;
  return {
    ...todo,
    completed,
    completedAt: completed ? new Date().toISOString() : null,
    updatedAt: new Date().toISOString(),
  };
}
