import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/auth/forgot-password?email=${email}`);
      setMessage(res.data);
    } catch (err) {
      setMessage("Email not found");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => navigate("/login")}>Back to Login</button>
    </div>
  );
}

export default ForgotPassword;

