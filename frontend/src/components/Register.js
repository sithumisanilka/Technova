import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const result = await register(formData);
    
    if (result.success) {
      setMessage(result.message || "Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
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



        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <p>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "blue", textDecoration: "underline" }}>
          Login here
        </Link>
      </p>
    </div>
  );
}

export default Register;




