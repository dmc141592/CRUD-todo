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
