import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductList() {
  // States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [newProduct, setNewProduct] = useState({ id: null, name: "", price: "", category: "" });
  const [newCategory, setNewCategory] = useState({ id: null, name: "", description: "" });

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // ✅ Fetch data on load
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ✅ Category Handlers
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const cancelCategoryEdit = () => {
    setEditingCategory(null);
    setNewCategory({ id: null, name: "", description: "" });
  };

  const handleEditCategory = (category) => {
  setEditingCategory(category);
  setNewCategory({
    id: category.categoryId,
    name: category.name,
    description: category.description
  });
};

  const saveCategory = async () => {
    try {
      if (editingCategory) {
        await axios.put(`http://localhost:8080/api/categories/${newCategory.id}`, newCategory);
      } else {
        await axios.post("http://localhost:8080/api/categories", newCategory);
      }
      fetchCategories();
      cancelCategoryEdit();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // ✅ Product Handlers
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const cancelProductEdit = () => {
    setEditingProduct(null);
    setNewProduct({ id: null, name: "", price: "", category: "" });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      id: product.productId,
      name: product.name,
      price: product.price,
      category: product.category
    });
  };

  const saveProduct = async () => {
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:8080/api/products/${newProduct.id}`, newProduct);
      } else {
        await axios.post("http://localhost:8080/api/products", newProduct);
      }
      fetchProducts();
      cancelProductEdit();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // ✅ JSX
  return (
    <div style={{ padding: "20px" }}>
      <h2>Category Management</h2>
      <input
        type="text"
        name="name"
        placeholder="Category Name"
        value={newCategory.name}
        onChange={handleCategoryChange}
      />
      <input
        type="text"
        name="description"
        placeholder="Category Description"
        value={newCategory.description}
        onChange={handleCategoryChange}
      />
      <button onClick={saveCategory}>{editingCategory ? "Update" : "Add"} Category</button>
      {editingCategory && <button onClick={cancelCategoryEdit}>Cancel</button>}

      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            <strong>ID: {cat.categoryId}</strong> | {cat.name} - {cat.description}
            <button onClick={() => handleEditCategory(cat)}>Edit</button>
            <button onClick={() => deleteCategory(cat.categoryId)}>Delete</button>
          </li>
        ))}
      </ul>

      <hr />

      <h2>Product Management</h2>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={handleProductChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={newProduct.price}
        onChange={handleProductChange}
      />
      <select
        name="category"
        value={newProduct.category}
        onChange={handleProductChange}
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <button onClick={saveProduct}>{editingProduct ? "Update" : "Add"} Product</button>
      {editingProduct && <button onClick={cancelProductEdit}>Cancel</button>}

      <ul>
        {products.map((prod) => (
          <li key={prod.productId}>
            <strong>ID: {prod.productId}</strong> | {prod.name} - ${prod.price} ({prod.category})
            <button onClick={() => handleEditProduct(prod)}>Edit</button>
            <button onClick={() => deleteProduct(prod.productId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
