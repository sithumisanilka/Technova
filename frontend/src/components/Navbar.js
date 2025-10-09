// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Solekta Admin</h1>
      <div className="space-x-4">
        <Link to="/products" className="hover:text-blue-300">Products</Link>
        <Link to="/categories" className="hover:text-blue-300">Categories</Link>
      </div>
    </nav>
  );
}

export default Navbar;
