import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  const [page, setPage] = useState("login"); // default page
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome 👋</h1>

      {/* Navigation buttons */}
      {!token && (
        <>
          <button onClick={() => setPage("login")}>Login</button>
          <button
            onClick={() => setPage("register")}
            style={{ marginLeft: "10px" }}
          >
            Register
          </button>
        </>
      )}

      {token && (
        <>
          <button onClick={() => setPage("profile")}>Profile</button>
          <button
            onClick={handleLogout}
            style={{ marginLeft: "10px", color: "red" }}
          >
            Logout
          </button>
        </>
      )}

      {/* Render the selected page */}
      {page === "login" && <Login onLoginSuccess={(t) => { setToken(t); setPage("profile"); }} />}
      {page === "register" && <Register />}
      {page === "profile" && token && <Profile />}
    </div>
  );
}

export default App;






