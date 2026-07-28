# Task Management Application

A full-stack task management app with user authentication, real-time updates, and data visualization.

## Features

- **Task CRUD** — Create, read, update (inline edit + status toggle), and delete tasks
- **User Authentication** — JWT-based registration and login with bcrypt password hashing
- **Real-Time Updates** — Socket.io pushes task changes to all connected clients instantly
- **Data Visualization** — Pie chart and bar chart for task statistics (status distribution, overdue count)
- **Responsive Design** — Adapts to mobile, tablet, and desktop viewports with dark mode support

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, React Hook Form, Zod, Recharts, Socket.IO Client |
| Backend | Node.js, Express 5, TypeScript, Mongoose, Socket.IO, JWT, bcryptjs |
| Database | MongoDB |

## Project Structure

```
├── backend/
│   ├── auth/              # Auth module (controller, service, repository, interfaces)
│   ├── config/            # DB connection, env vars, Socket.IO setup
│   ├── middleware/        # JWT authentication middleware
│   ├── task/              # Task module (controller, service, repository, interfaces, model)
│   ├── user/              # User model and types
│   ├── server.ts          # Express + HTTP + Socket.IO entry point
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── api/           # API client functions (auth, tasks, socket)
│   │   ├── context/       # Auth context with token persistence
│   │   ├── hooks/         # Socket connection hook
│   │   ├── pages/         # Login, Signup, Tasks, Stats
│   │   ├── schemas/       # Zod validation schemas
│   │   └── shared/        # Reusable Input, PasswordField, Button components
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB connection string

### Backend Setup

```bash
cd backend
cp .env .env.example   # Review and update MONGO_URI and JWT_SECRET
npm install
npm run dev
```

The server starts on `http://localhost:3000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The dev server starts on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login and receive JWT |
| GET | `/api/tasks` | JWT | List user's tasks |
| POST | `/api/tasks` | JWT | Create a task |
| PUT | `/api/tasks/:id` | JWT | Update a task |
| DELETE | `/api/tasks/:id` | JWT | Delete a task |
| GET | `/api/tasks/stats` | JWT | Get task statistics |

## WebSocket Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `task:created` | Server → Client | `Task` | A new task was created |
| `task:updated` | Server → Client | `Task` | A task was updated |
| `task:deleted` | Server → Client | `string` (task ID) | A task was deleted |
