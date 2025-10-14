import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/auth/update-profile", form);
      setMessage(res.data);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setMessage("Failed to update profile");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Update Profile</h2>
      <form onSubmit={handleUpdate}>
        <input
          name="email"
          type="email"
          placeholder="New Email (optional)"
          onChange={handleChange}
        /><br />
        <input
          name="password"
          type="password"
          placeholder="New Password (optional)"
          onChange={handleChange}
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
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => navigate("/profile")}>Back to Profile</button>
    </div>
  );
}

export default UpdateProfile;
