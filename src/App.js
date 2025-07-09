import React, { useState, useEffect } from "react";

const API_BASE_URL = "https://umet.onrender.com";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError("⚠️ Failed to load tasks");
    }
    setLoading(false);
  };

  const addTask = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input.trim() }),
      });
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setInput("");
    } catch {
      setError("⚠️ Failed to add task");
    }
    setLoading(false);
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch {
      setError("⚠️ Failed to delete task");
    }
    setLoading(false);
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditText(task.title);
  };

  const updateTask = async () => {
    if (!editText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editText.trim() }),
      });
      const updated = await res.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === editId ? updated.task : task))
      );
      setEditId(null);
      setEditText("");
    } catch {
      setError("⚠️ Failed to update task");
    }
    setLoading(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      return task.created_at?.startsWith(today);
    }
    if (["high", "medium", "low"].includes(filter)) return task.priority === filter;
    return true;
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "80px 60px 60px 60px",
        fontFamily: "Arial",
      }}
    >
      <div style={{ width: "100%", maxWidth: 600 }}>
        <h2 style={{ textAlign: "center" }}>ToDo App (Connected to API)</h2>

        {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}

        <div style={{ display: "flex", marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Enter task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{ padding: "8px", flex: 1, marginRight: "10px" }}
          />
          <button onClick={addTask} disabled={loading} style={{ padding: "8px 16px" }}>
            Add
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                style={{
                  marginBottom: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {editId === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateTask();
                      }}
                      style={{ padding: "4px", flex: 1 }}
                    />
                    <button onClick={updateTask} style={{ marginLeft: 8 }}>
                      ✅
                    </button>
                    <button onClick={() => setEditId(null)} style={{ marginLeft: 4 }}>
                      ❌
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1 }}>{task.title}</span>
                    <button onClick={() => startEdit(task)} style={{ marginLeft: 8 }}>
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        if (tasks[0] && task.id === tasks[0].id) return; // первый таск нельзя удалить
                        deleteTask(task.id);
                      }}
                      style={{
                        marginLeft: 4,
                        opacity: tasks[0] && task.id === tasks[0].id ? 0.5 : 1,
                        cursor:
                          tasks[0] && task.id === tasks[0].id ? "not-allowed" : "pointer",
                      }}
                      disabled={tasks[0] && task.id === tasks[0].id}
                    >
                      🗑
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        style={{
          width: 180,
          marginLeft: 40,
          paddingTop: 20,
        }}
      >
        <h4 style={{ marginBottom: 16 }}>Filters</h4>
        <div
          onClick={() => setFilter("all")}
          style={{ cursor: "pointer", marginBottom: 10 }}
        >
          🔹 All
        </div>
        <div
          onClick={() => setFilter("today")}
          style={{ cursor: "pointer", marginBottom: 10 }}
        >
          📅 Today
        </div>
        <div
          onClick={() => setFilter("completed")}
          style={{ cursor: "pointer", marginBottom: 10 }}
        >
          ✅ Completed
        </div>
        <div
          onClick={() => setFilter("high")}
          style={{ cursor: "pointer", marginBottom: 10 }}
        >
          🔥 High Priority
        </div>
        <div
          onClick={() => setFilter("medium")}
          style={{ cursor: "pointer", marginBottom: 10 }}
        >
          ⚡ Medium Priority
        </div>
        <div
          onClick={() => setFilter("low")}
          style={{ cursor: "pointer", marginBottom: 10 }}
        >
          🐢 Low Priority
        </div>
      </div>
    </div>
  );
}
