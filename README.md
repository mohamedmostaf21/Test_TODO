# Todo App

A simple full-stack Todo app built with React, Node.js/Express, and MongoDB.

## Run with Docker Compose

```bash
docker compose up --build
```

Then open:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Run locally without Docker

Start MongoDB first:

```bash
docker run -d --name local-mongo -p 27017:27017 mongo:7
```

Then in two terminals:

```bash
cd backend
npm install
PORT=5002 MONGO_URI=mongodb://127.0.0.1:27017/todo-app node server.js
```

```bash
cd frontend
npm install
VITE_API_URL=http://localhost:5002 npm run dev
```

## Seed MongoDB data

From the backend directory, run:

```bash
cd backend
npm run seed
```

This inserts initial todo items into your MongoDB instance if the collection is empty.
# Test_TODO
