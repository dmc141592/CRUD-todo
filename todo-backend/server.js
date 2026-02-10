const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory DB
const todos = new Map();
const PRIORITIES = new Set(["low", "medium", "high"]);

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isValidDueDate(s) {
  if (s === null) return true;
  if (typeof s !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return false;
  const [y, m, day] = s.split("-").map(Number);
  return (
    d.getUTCFullYear() === y &&
    d.getUTCMonth() + 1 === m &&
    d.getUTCDate() === day
  );
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (!Array.isArray(tags)) return [];
  const cleaned = tags.map((t) => String(t).trim()).filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const t of cleaned) {
    const key = t.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(t);
    }
  }
  return out;
}

function validateCreate(body) {
  const text = String(body.text ?? "").trim();
  if (!text) return { ok: false, error: "text is required" };

  const priority = String(body.priority ?? "medium").toLowerCase().trim();
  if (!PRIORITIES.has(priority)) return { ok: false, error: "invalid priority" };

  const dueDate = body.dueDate ?? null;
  if (!isValidDueDate(dueDate)) return { ok: false, error: "invalid dueDate" };

  return {
    ok: true,
    value: {
      text,
      priority,
      dueDate,
      tags: normalizeTags(body.tags),
      notes: String(body.notes ?? "").trim(),
    },
  };
}

function validateUpdate(body) {
  const patch = {};

  if ("text" in body) {
    const text = String(body.text ?? "").trim();
    if (!text) return { ok: false, error: "text cannot be empty" };
    patch.text = text;
  }

  if ("completed" in body) patch.completed = Boolean(body.completed);

  if ("priority" in body) {
    const priority = String(body.priority ?? "").toLowerCase().trim();
    if (!PRIORITIES.has(priority)) return { ok: false, error: "invalid priority" };
    patch.priority = priority;
  }

  if ("dueDate" in body) {
    const dueDate = body.dueDate ?? null;
    if (!isValidDueDate(dueDate)) return { ok: false, error: "invalid dueDate" };
    patch.dueDate = dueDate;
  }

  if ("tags" in body) patch.tags = normalizeTags(body.tags);
  if ("notes" in body) patch.notes = String(body.notes ?? "").trim();

  if ("completedAt" in body) patch.completedAt = body.completedAt ? String(body.completedAt) : null;

  return { ok: true, value: patch };
}

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, time: nowIso() });
});

// GET all
app.get("/todos", (req, res) => {
  const list = Array.from(todos.values());
  list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  res.json(list);
});

// GET one
app.get("/todos/:id", (req, res) => {
  const todo = todos.get(req.params.id);
  if (!todo) return res.status(404).json({ error: "not found" });
  res.json(todo);
});

// POST create
app.post("/todos", (req, res) => {
  const v = validateCreate(req.body);
  if (!v.ok) return res.status(400).json({ error: v.error });

  const id = String(req.body.id ?? makeId());
  const createdAt = nowIso();

  const todo = {
    id,
    text: v.value.text,
    completed: false,
    priority: v.value.priority,
    dueDate: v.value.dueDate,
    tags: v.value.tags,
    notes: v.value.notes,
    completedAt: null,
    createdAt,
    updatedAt: createdAt,
  };

  todos.set(id, todo);
  res.status(201).json(todo);
});

// PUT update (partial updates allowed)
app.put("/todos/:id", (req, res) => {
  const existing = todos.get(req.params.id);
  if (!existing) return res.status(404).json({ error: "not found" });

  const v = validateUpdate(req.body);
  if (!v.ok) return res.status(400).json({ error: v.error });

  const patch = v.value;

  // Maintain completedAt if completed changes
  let completedAt = existing.completedAt;
  if ("completed" in patch && !("completedAt" in patch)) {
    completedAt = patch.completed ? nowIso() : null;
  } else if ("completedAt" in patch) {
    completedAt = patch.completedAt;
  }

  const updated = {
    ...existing,
    ...patch,
    completedAt,
    updatedAt: nowIso(),
  };

  todos.set(existing.id, updated);
  res.json(updated);
});

// DELETE
app.delete("/todos/:id", (req, res) => {
  const existed = todos.delete(req.params.id);
  if (!existed) return res.status(404).json({ error: "not found" });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
