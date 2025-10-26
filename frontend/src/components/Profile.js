import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setProfile(res.data);
      } catch (err) {
        setError("Failed to fetch profile. Please log in again.");
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error) {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>User Profile</h2>
      <p><b>Username:</b> {profile.username}</p>
      <p><b>Email:</b> {profile.email}</p>
      <p><b>Role:</b> {profile.role}</p> {/* ✅ Added */}
      <p><b>First Name:</b> {profile.firstName || "—"}</p>
      <p><b>Last Name:</b> {profile.lastName || "—"}</p>
      <p><b>Phone Number:</b> {profile.phoneNumber || "—"}</p>

      <button onClick={() => navigate("/update-profile")}>Update Profile</button>
      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
    </div>
  );
}

export default Profile;


