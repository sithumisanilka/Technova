import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "#fff",
      }}
    >
      <h2>Technova Store</h2>
      <div>
        {/* User Links */}
        <Link to="/" style={{ color: "#fff", marginRight: "15px", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/products" style={{ color: "#fff", marginRight: "15px", textDecoration: "none" }}>
          Products
        </Link>

        {/* Admin Links */}
        <Link to="/admin/products" style={{ color: "#fff", marginLeft: "20px", textDecoration: "none" }}>
          Admin Products
        </Link>
        <Link to="/admin/categories" style={{ color: "#fff", marginLeft: "15px", textDecoration: "none" }}>
          Admin Categories
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
