import { useEffect, useMemo, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import FilterBar from "./components/FilterBar";

import {
  createTodo,
  toggleCompleted,
} from "./models/todo.model";

import {
  fetchTodos,
  createTodoApi,
  updateTodoApi,
  deleteTodoApi,
} from "./services/todo.api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // LOAD from backend
  useEffect(() => {
    setLoading(true);
    fetchTodos()
      .then(setTodos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // CREATE
  async function onCreate(draft) {
    try {
      const local = createTodo(draft); // optimistic
      setTodos((prev) => [local, ...prev]);

      const saved = await createTodoApi(local);
      setTodos((prev) =>
        prev.map((t) => (t.id === local.id ? saved : t))
      );
    } catch (e) {
      setError(e.message);
    }
  }

  // UPDATE
  async function onUpdate(id, patch) {
    try {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, ...patch, updatedAt: new Date().toISOString() }
            : t
        )
      );

      const updated = await updateTodoApi({ id, ...patch });
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );

      setEditingTodo(null);
    } catch (e) {
      setError(e.message);
    }
  }

  // TOGGLE
  async function onToggle(id) {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    try {
      const toggled = toggleCompleted(target);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? toggled : t))
      );

      const saved = await updateTodoApi(toggled);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? saved : t))
      );
    } catch (e) {
      setError(e.message);
    }
  }

  // DELETE
  async function onDelete(id) {
    try {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      await deleteTodoApi(id);
    } catch (e) {
      setError(e.message);
    }
  }

  // FILTER
  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const totalCount = todos.length;
  const remainingCount = todos.filter((t) => !t.completed).length;
  const completedCount = totalCount - remainingCount;

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Todo List</h1>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <TodoForm
        onCreate={onCreate}
        onUpdate={onUpdate}
        editingTodo={editingTodo}
        onCancelEdit={() => setEditingTodo(null)}
      />

      <FilterBar
        filter={filter}
        onChange={setFilter}
        totalCount={totalCount}
        remainingCount={remainingCount}
        completedCount={completedCount}
      />

      <TodoList
        todos={visibleTodos}
        onToggle={onToggle}
        onEdit={setEditingTodo}
        onDelete={onDelete}
      />
    </div>
  );
}
