require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in .env — copy .env.example to .env and add your connection string.");
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// ----- Schema -----
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

// ----- Routes (as specified in the task brief) -----

// POST /add -> add a new task
app.post("/add", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Task text is required" });
    }
    const newTask = new Task({ text: text.trim() });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add task" });
  }
});

// GET /tasks -> get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// ----- Bonus routes (not required by the brief, but small + useful additions) -----

// PATCH /tasks/:id/toggle -> mark a task complete / incomplete
app.patch("/tasks/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE /tasks/:id -> remove a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.get("/", (req, res) => res.send("MERN To-Do API is running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
