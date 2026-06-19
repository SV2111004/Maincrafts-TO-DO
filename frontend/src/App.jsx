import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatId(n) {
  return `T-${String(n).padStart(3, "0")}`;
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setError("");
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      setError("Couldn't reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/add`, { text: trimmed });
      setTasks((prev) => [res.data, ...prev]);
      setText("");
    } catch (err) {
      setError("Couldn't add that task. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTask = async (id) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      await axios.patch(`${API_URL}/tasks/${id}/toggle`);
    } catch (err) {
      fetchTasks();
    }
  };

  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
    } catch (err) {
      fetchTasks();
    }
  };

  const openCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="page">
      <div className="panel">
        <div className="eyebrow">T-DO // SESSION LOG</div>
        <h1>Task Tracker</h1>
        <p className="subhead">
          {openCount === 0
            ? "Nothing in motion right now."
            : `${openCount} task${openCount === 1 ? "" : "s"} in motion`}
        </p>

        <form className="add-row" onSubmit={addTask}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs doing?"
            aria-label="New task"
            disabled={submitting}
          />
          <button type="submit" disabled={submitting || !text.trim()}>
            Add
          </button>
        </form>

        {error && <div className="error-banner">{error}</div>}

        <div className="ticket-list">
          {loading ? (
            <div className="empty-state">Loading tasks…</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              Nothing logged yet — add your first task above.
            </div>
          ) : (
            tasks.map((task, i) => (
              <div
                key={task._id}
                className={`ticket ${task.completed ? "is-done" : ""}`}
              >
                <button
                  className="check"
                  onClick={() => toggleTask(task._id)}
                  aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {task.completed && <span className="check-mark">✓</span>}
                </button>
                <span className="ticket-id">{formatId(tasks.length - i)}</span>
                <span className="ticket-text">{task.text}</span>
                <button
                  className="remove"
                  onClick={() => deleteTask(task._id)}
                  aria-label="Delete task"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
