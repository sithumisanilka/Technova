import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data); // JWT token
      navigate("/profile");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Don’t have an account?{" "}
        <button
          style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </p>

      <p>
        Forgot password?{" "}
        <button
          style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/forgot-password")}
        >
          Reset here
        </button>
      </p>
    </div>
  );
}

export default Login;





