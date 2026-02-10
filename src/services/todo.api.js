import { fromApiTodo, toApiTodo } from "../models/todo.model";

const BASE_URL = "http://localhost:3001";
const TODOS_URL = `${BASE_URL}/todos`;

async function handle(res) {
  if (!res.ok) throw new Error(`API error ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

export async function fetchTodos() {
  const res = await fetch(TODOS_URL);
  const data = await handle(res);
  return Array.isArray(data) ? data.map(fromApiTodo) : [];
}

export async function createTodoApi(todo) {
  const res = await fetch(TODOS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiTodo(todo)),
  });
  return fromApiTodo(await handle(res));
}

export async function updateTodoApi(todo) {
  const res = await fetch(`${TODOS_URL}/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toApiTodo(todo)),
  });
  return fromApiTodo(await handle(res));
}

export async function deleteTodoApi(id) {
  const res = await fetch(`${TODOS_URL}/${id}`, { method: "DELETE" });
  await handle(res);
}
