import React, { useState, useEffect } from "react";

const API_BASE_URL = "https://umet.onrender.com";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // Получение задач с API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/tasks`;

      if (filter === "today") {
        url += `?filter=today`;
      } else if (filter === "completed") {
        url += `?filter=completed`;
      } else if (["high", "medium", "low"].includes(filter)) {
        url += `?priority=${filter}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError("⚠️ Failed to load tasks");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  // Добавление задачи
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
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setInput("");
    } catch {
      setError("⚠️ Failed to add task");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>ToDo App (with Filters)</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <input
        type="text"
        placeholder="Enter task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "8px", width: "70%", marginRight: "10px" }}
        disabled={loading}
      />
      <button onClick={addTask} disabled={loading} style={{ padding: "8px 16px" }}>
        Add
      </button>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginTop: "20px", padding: "8px", width: "100%" }}
      >
        <option value="all">All Tasks</option>
        <option value="today">Today</option>
        <option value="completed">Completed</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ marginTop: 20 }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ padding: "6px 0" }}>
              {task.title}
              {task.priority && (
                <span style={{ marginLeft: 8, fontSize: 12, color: "#999" }}>
                  [{task.priority}]
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
