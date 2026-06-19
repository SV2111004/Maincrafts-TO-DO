# MERN To-Do List — Maincrafts Internship, Task 2

A To-Do List app built with the MERN stack: React (Vite) frontend, Express
backend, MongoDB Atlas for storage.

Meets the brief exactly:
- `POST /add` → adds a task
- `GET /tasks` → returns all tasks
- React input + "Add Task" button, list fetched from the backend

Plus two small bonus routes that come almost for free once `/add` and
`/tasks` exist, so the app feels like a real to-do list instead of a
write-only log:
- `PATCH /tasks/:id/toggle` → mark a task done / not done
- `DELETE /tasks/:id` → remove a task

## Folder structure

```
mern-todo-task2/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── index.css
```

## 1. Set up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free
   account / cluster (the M0 free tier is enough).
2. Under **Database Access**, create a user with a username + password.
3. Under **Network Access**, add your current IP (or `0.0.0.0/0` for "allow
   from anywhere" while developing).
4. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/todoapp?retryWrites=true&w=majority
   ```
   Replace `<username>` / `<password>` with your actual values, and add a
   database name (here, `todoapp`) before the `?`.

## 2. Run the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and paste your connection string:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/todoapp?retryWrites=true&w=majority
PORT=5000
```

Start the server:

```bash
npm run dev      # with nodemon, auto-restarts on changes
# or
npm start
```

You should see:

```
Server running on port 5000
MongoDB Connected
```

Quick sanity check in the browser or Postman: `GET http://localhost:5000/tasks`
should return `[]` on a fresh database.

## 3. Run the frontend

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

This starts Vite at `http://localhost:5173`. The `.env` file points the
frontend at the backend:

```
VITE_API_URL=http://localhost:5000
```

Open `http://localhost:5173` — type a task, hit **Add**, and it should show
up in the list immediately (and still be there if you refresh, since it's
coming straight from MongoDB).

## 4. Testing the API directly (Postman)

| Method | URL                              | Body                          |
|--------|-----------------------------------|--------------------------------|
| GET    | `http://localhost:5000/tasks`     | —                               |
| POST   | `http://localhost:5000/add`       | `{ "text": "Finish task 2" }`   |
| PATCH  | `http://localhost:5000/tasks/:id/toggle` | —                       |
| DELETE | `http://localhost:5000/tasks/:id` | —                               |

## Notes / things you could mention in your submission

- The schema stores `text`, `completed`, and `createdAt` — `completed` is
  what powers the bonus toggle feature, and tasks are returned newest-first.
- CORS is open (`app.use(cors())`) since this is a local dev task; for a
  deployed version you'd lock `origin` down to your frontend's URL.
- Error handling is in place on every route (try/catch + proper status
  codes), and the frontend shows a banner if it can't reach the backend —
  small things, but they're the kind of detail reviewers notice.
- If you want to deploy: backend → Render/Railway (set `MONGO_URI` as an env
  var there), frontend → Vercel/Netlify (set `VITE_API_URL` to your deployed
  backend's URL).
