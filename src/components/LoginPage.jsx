import React, { useState } from "react";
import { Link } from "react-router-dom";  // <-- вот это добавь

const API_BASE_URL = "https://umet.onrender.com";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      onLoginSuccess(data); // передаём токен или юзера наверх
    } catch (e) {
      setError("Ошибка при входе");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Вход</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: 10 }}>
        {loading ? "Вхожу..." : "Войти"}
      </button>

      <p style={{ marginTop: 16, textAlign: "center" }}>
        Нет аккаунта?{" "}
        <Link to="/register" style={{ color: "blue", textDecoration: "underline" }}>
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
