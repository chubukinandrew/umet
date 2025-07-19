import React, { useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import TodoPage from "./components/TodoPage";

export default function App() {
  const [user, setUser] = useState(null); // хранит токен или инфу о юзере

  const handleLoginSuccess = (data) => {
    setUser(data);
    localStorage.setItem("token", data.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/todo" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path="/register"
          element={
            user ? <Navigate to="/todo" /> : <RegisterPage onRegisterSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path="/todo"
          element={user ? <TodoPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={user ? "/todo" : "/login"} />} />
      </Routes>
    </HashRouter>
  );
}
