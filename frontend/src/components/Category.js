// src/components/Category.js
import React, { useEffect, useState } from "react";

function Category() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryDescription: "",
  });
  const [editId, setEditId] = useState(null);

  // ✅ Fetch categories
  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add / Update category
  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:8080/api/categories/${editId}`
      : "http://localhost:8080/api/categories";

    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (editId) {
          setCategories((prev) =>
            prev.map((c) => (c.categoryId === editId ? data : c))
          );
        } else {
          setCategories((prev) => [...prev, data]);
        }
        setFormData({ categoryName: "", categoryDescription: "" });
        setEditId(null);
      })
      .catch((err) => console.error("Error saving category:", err));
  };

  // ✅ Delete category
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/categories/${id}`, { method: "DELETE" })
      .then(() =>
        setCategories((prev) => prev.filter((c) => c.categoryId !== id))
      )
      .catch((err) => console.error("Error deleting category:", err));
  };

  // ✅ Edit category
  const handleEdit = (category) => {
    setFormData({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription,
    });
    setEditId(category.categoryId);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Category Management</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          name="categoryName"
          placeholder="Category Name"
          value={formData.categoryName}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="categoryDescription"
          placeholder="Category Description"
          value={formData.categoryDescription}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Category" : "Add Category"}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Category List</h3>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="border w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.categoryId}>
                <td className="border p-2">{c.categoryId}</td>
                <td className="border p-2">{c.categoryName}</td>
                <td className="border p-2">{c.categoryDescription}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.categoryId)}
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

export default Category;
