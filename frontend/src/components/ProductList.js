import React, { useState } from "react";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category) return;

    setProducts([...products, newProduct]);
    setNewProduct({ name: "", price: "", category: "" });
  };

  return (
    <div className="product-container">
      <h2>Product Management System</h2>

      {/* Product Form */}
      <form className="product-form" onSubmit={handleAddProduct}>
        <input
          type="text"
          name="name"
          placeholder="Enter product name"
          value={newProduct.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Enter price"
          value={newProduct.price}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Enter category"
          value={newProduct.category}
          onChange={handleChange}
        />
        <button type="submit">Add Product</button>
      </form>

      {/* Product List Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price ($)</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>No products added yet</td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
