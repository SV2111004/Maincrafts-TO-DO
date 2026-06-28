# MERN To-Do Application

A full-stack To-Do application built using the MERN stack that allows users to create, view, modify, complete, and delete tasks.

## Features

* Add new tasks
* View all saved tasks
* Mark tasks as completed or incomplete
* Delete tasks
* Real-time UI updates
* Responsive and modern user interface
* MongoDB Atlas integration

  ## Preview

<img width="514" height="379" alt="image" src="https://github.com/user-attachments/assets/c8966429-badf-41f5-8a33-97c4afa46047" />


## Tech Stack

### Frontend

* React
* Vite
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* CORS
* dotenv

## Project Structure

```text
mern-todo-app/
├── client/
├── server/
└── README.md
```

## Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/mern-todo-app.git
cd mern-todo-app
```

### Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend server:

```bash
npm start
```

### Frontend setup

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| POST   | `/add`              | Add a new task     |
| GET    | `/tasks`            | Get all tasks      |
| PATCH  | `/tasks/:id/toggle` | Toggle task status |
| DELETE | `/tasks/:id`        | Delete a task      |

## Environment Variables

### Server

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```




