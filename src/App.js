import React, { useState, useEffect } from "react";

const API_BASE_URL = "https://umet.onrender.com";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Получение задач с API
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

  useEffect(() => {
    fetchTasks();
  }, []);

  // Добавление задачи в API
  const addTask = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: input.trim() }),
      });

      if (!res.ok) throw new Error();

      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setInput("");
    } catch (err) {
      setError("⚠️ Failed to add task");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>ToDo App (Connected to API)</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <input
        type="text"
        placeholder="Enter task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "8px", width: "70%", marginRight: "10px" }}
        disabled={loading}
      />
      <button onClick={addTask} style={{ padding: "8px 16px" }} disabled={loading}>
        Add
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ marginTop: 20 }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ padding: "6px 0" }}>
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
