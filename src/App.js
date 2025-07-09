import React, { useState, useEffect } from "react";

const API_BASE_URL = "https://umet.onrender.com";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
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
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input.trim() }),
      });

      if (!res.ok) throw new Error();

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setInput("");
    } catch {
      setError("⚠️ Failed to add task");
    }
    setLoading(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      return task.created_at?.startsWith(today);
    }
    if (filter === "high") return task.priority === "high";
    return true;
  });

  return (
    <div style={{ display: "flex", fontFamily: "Arial", padding: 20 }}>
      {/* Основной контент */}
      <div style={{ flex: 1, maxWidth: 600 }}>
        <h2>ToDo App</h2>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <input
          type="text"
          placeholder="Enter task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          style={{ padding: "8px", width: "65%", marginRight: "10px" }}
        />
        <button onClick={addTask} disabled={loading} style={{ padding: "8px" }}>
          Add
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul style={{ marginTop: 20 }}>
            {filteredTasks.map((task) => (
              <li key={task.id} style={{ padding: "6px 0" }}>
                {task.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Правое меню */}
      <div style={{ width: 180, paddingLeft: 40 }}>
        <h4>Filters</h4>
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
      </div>
    </div>
  );
}
