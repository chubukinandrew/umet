import React, { useState } from "react";

const API_BASE_URL = "https://umet.onrender.com";

export default function RegisterPage({ onRegisterSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Ошибка регистрации");
      const data = await res.json();
      onRegisterSuccess(data); // обычно юзера или токен
    } catch (e) {
      setError("Ошибка регистрации");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Регистрация</h2>
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

      <input
        type="password"
        placeholder="Подтвердите пароль"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      <button
        onClick={handleRegister}
        disabled={loading}
        style={{ width: "100%", padding: 10 }}
      >
        {loading ? "Регистрирую..." : "Зарегистрироваться"}
      </button>
    </div>
  );
}
