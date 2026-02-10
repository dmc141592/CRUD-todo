# CRUD Todo Application

A full-stack CRUD Todo application built entirely with JavaScript.

The project consists of a React-based frontend and a Node.js/Express backend
communicating via a REST API. It follows a clear separation of concerns and is
designed to be extended with persistent storage, Docker and authentication in
later stages.

---

## Tech Stack

### Frontend
- JavaScript
- React (Create React App)
- Component-based architecture
- REST API integration
- Client-side state management and filtering

### Backend
- JavaScript (Node.js)
- Express.js
- RESTful API
- In-memory data storage
- CORS enabled

---

## Features

- Create, read, update and delete todos
- Mark todos as completed
- Filter todos (all / active / completed)
- Support for priority, due dates, tags and notes
- Clean separation between frontend and backend

---

## Project Structure

```text
crud-todo/
├─ src/               # React frontend
├─ public/
├─ todo-backend/      # Express backend
│  └─ server.js
├─ package.json
└─ README.md

```



## Getting Started

### Frontend

```bash
npm install
npm start
````

The frontend runs by default on:

```
http://localhost:3000
```

---

### Backend

```bash
cd todo-backend
npm install
npm run dev
```

The backend REST API runs on:

```
http://localhost:3001
```

---

## API Overview

* `GET /todos` – Get all todos
* `POST /todos` – Create a new todo
* `PUT /todos/:id` – Update an existing todo
* `DELETE /todos/:id` – Delete a todo

---

## Notes

This project currently uses in-memory storage for simplicity.
The backend is intentionally structured so that it can be replaced with a
database-backed implementation (e.g. PostgreSQL or MongoDB using Docker)
without changing the frontend.

---

## Roadmap

- [x] Initial project setup
- [x] React frontend (CRUD UI)
- [x] Express REST API
- [x] Frontend–backend integration
- [ ] Replace in-memory storage with a database
- [ ] Add Docker and Docker Compose support
- [ ] Add authentication and authorization

---

## Tooling
- npm
- Git & GitHub
- Visual Studio Code


