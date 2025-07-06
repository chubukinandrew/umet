import React, { useState, useEffect } from "react";

// const API_BASE_URL = "https://...";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Функция загрузки задач — сейчас моковые данные
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      // Здесь потом будет fetch с API
      setTasks([
        { id: 1, title: "Sample Task 1", completed: false },
        { id: 2, title: "Sample Task 2", completed: true },
      ]);
    } catch {
      setError("Failed to load tasks");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Добавление задачи
  const addTask = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Здесь будет POST запрос к API
      const newTask = {
        id: Date.now(),
        title: input.trim(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setInput("");
    } catch {
      setError("Failed to add task");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>ToDo App with API hooks (MVP)</h2>
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
              {task.title} {task.completed ? "(done)" : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
