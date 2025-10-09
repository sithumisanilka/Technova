import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// User Components
import ProductList from "./components/UserProductList";

// Admin Components
import AdminCategoryList from "./components/Category";
import AdminProductList from "./components/Product";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<h1>Welcome to Technova Store</h1>} />
          <Route path="/products" element={<ProductList />} />

          {/* Admin Routes */}
          <Route path="/admin/products" element={<AdminProductList />} />
          <Route path="/admin/categories" element={<AdminCategoryList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
