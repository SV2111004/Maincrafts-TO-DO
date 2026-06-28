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
  // Task 3: edit state — which task is being edited and its draft value
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

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

  // ── ADD ────────────────────────────────────────────────────────────
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

  // ── TOGGLE (checkbox) ──────────────────────────────────────────────
  const toggleTask = async (id, currentCompleted) => {
    // optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      // Task 3 route: PUT /update/:id
      await axios.put(`${API_URL}/update/${id}`, {
        completed: !currentCompleted,
      });
    } catch (err) {
      fetchTasks(); // rollback on failure
    }
  };

  // ── EDIT ───────────────────────────────────────────────────────────
  const startEdit = (task) => {
    setEditId(task._id);
    setEditText(task.text);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    // optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, text: trimmed } : t))
    );
    setEditId(null);
    try {
      // Task 3 route: PUT /update/:id
      await axios.put(`${API_URL}/update/${id}`, { text: trimmed });
    } catch (err) {
      fetchTasks(); // rollback on failure
    }
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") cancelEdit();
  };

  // ── DELETE ─────────────────────────────────────────────────────────
  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      // Task 3 route: DELETE /delete/:id
      await axios.delete(`${API_URL}/delete/${id}`);
    } catch (err) {
      fetchTasks(); // rollback on failure
    }
  };

  const openCount = tasks.filter((t) => !t.completed).length;
  const doneCount = tasks.length - openCount;

  return (
    <div className="page">
      <div className="panel">
        <div className="eyebrow">T-DO // SESSION LOG</div>
        <h1>Task Tracker</h1>
        <p className="subhead">
          {tasks.length === 0
            ? "Nothing logged yet."
            : openCount === 0
            ? `All ${tasks.length} task${tasks.length === 1 ? "" : "s"} done 🎉`
            : `${openCount} open · ${doneCount} done`}
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
                className={`ticket ${task.completed ? "is-done" : ""} ${
                  editId === task._id ? "is-editing" : ""
                }`}
              >
                {/* Checkbox */}
                <button
                  className="check"
                  onClick={() => toggleTask(task._id, task.completed)}
                  aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  disabled={editId === task._id}
                >
                  {task.completed && <span className="check-mark">✓</span>}
                </button>

                {/* Ticket ID */}
                <span className="ticket-id">{formatId(tasks.length - i)}</span>

                {/* Text or inline edit input */}
                {editId === task._id ? (
                  <input
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, task._id)}
                    autoFocus
                    aria-label="Edit task text"
                  />
                ) : (
                  <span className="ticket-text">{task.text}</span>
                )}

                {/* Action buttons */}
                <div className="ticket-actions">
                  {editId === task._id ? (
                    <>
                      <button
                        className="action-btn save"
                        onClick={() => saveEdit(task._id)}
                        aria-label="Save edit"
                      >
                        ✓
                      </button>
                      <button
                        className="action-btn cancel"
                        onClick={cancelEdit}
                        aria-label="Cancel edit"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="action-btn edit"
                        onClick={() => startEdit(task)}
                        aria-label="Edit task"
                        disabled={task.completed}
                      >
                        ✎
                      </button>
                      <button
                        className="action-btn remove"
                        onClick={() => deleteTask(task._id)}
                        aria-label="Delete task"
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
