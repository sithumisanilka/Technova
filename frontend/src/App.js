// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Product from "./components/Product";
import Category from "./components/Category";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/products" element={<Product />} />
          <Route path="/categories" element={<Category />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
