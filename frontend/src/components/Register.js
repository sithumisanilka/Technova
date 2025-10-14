import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "USER", // default role
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", formData);
      setMessage(res.data);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        /><br />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
        /><br />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
        /><br />
        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
        /><br />
        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
        /><br />
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
        /><br />

        {/* Role Selection */}
        <label>Role:</label><br />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select><br /><br />

        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;




