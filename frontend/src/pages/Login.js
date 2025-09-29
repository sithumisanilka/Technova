import React, { useState } from "react";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Backend sends plain text token, not JSON
        const token = await response.text();
        console.log("Received token:", token); // ✅ For debugging
        localStorage.setItem("token", token);

        alert("Login successful!");
        onLoginSuccess(token); // notify App.js
      } else {
        let errorMessage = "Unknown error";
        try {
          // Try parsing JSON error
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch {
          // If not JSON, fallback to plain text
          errorMessage = await response.text();
        }
        alert("Login failed: " + errorMessage);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;



