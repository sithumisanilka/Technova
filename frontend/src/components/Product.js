// src/components/Product.js
import React, { useEffect, useState } from "react";

function Product() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    price: "",
    quantity: "",
    categoryId: "",
    brand:"",
    laptopSpec:"",
  });
  const [editId, setEditId] = useState(null);

  // ✅ Fetch all products on load
  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // ✅ Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add new product
  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:8080/api/products/${editId}`
      : "http://localhost:8080/api/products";

    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (editId) {
          // Update local list
          setProducts((prev) =>
            prev.map((p) => (p.productId === editId ? data : p))
          );
        } else {
          // Add new to list
          setProducts((prev) => [...prev, data]);
        }
        setFormData({
          productName: "",
          productDescription: "",
          price: "",
          quantity: "",
          categoryId: "",
          brand:"",
          laptopSpec:""
        });
        setEditId(null);
      })
      .catch((err) => console.error("Error saving product:", err));
  };

  // ✅ Delete product
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" })
      .then(() => setProducts((prev) => prev.filter((p) => p.productId !== id)))
      .catch((err) => console.error("Error deleting product:", err));
  };

  // ✅ Edit existing product
  const handleEdit = (product) => {
    setFormData({
      productName: product.productName,
      productDescription: product.productDescription,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.category?.categoryId || "",
      brand:product.brand,
      laptopSpec:product.laptopSpec,
    });
    setEditId(product.productId);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Product Management</h2>

      {/* 🧾 Form for Add / Update */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="productDescription"
          placeholder="Product Description"
          value={formData.productDescription}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="categoryId"
          placeholder="Category ID"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="laptopSpec"
          placeholder="Laptop Specification"
          value={formData.laptopSpec}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* 📋 Product List */}
      <h3 className="text-xl font-semibold mb-2">Product List</h3>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table className="border w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.productId}>
                <td className="border p-2">{p.productId}</td>
                <td className="border p-2">{p.productName}</td>
                <td className="border p-2">{p.productDescription}</td>
                <td className="border p-2">{p.price}</td>
                <td className="border p-2">{p.quantity}</td>
                <td className="border p-2">{p.categoryId}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.productId)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Product;
