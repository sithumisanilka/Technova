import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setError('');
    } catch (err) {
      setError(`Failed to fetch categories: ${err.response?.data?.message || err.message}`);
      console.error('Error fetching categories:', err);
      // Set empty array as fallback
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await categoryService.deleteCategory(categoryId);
        setCategories(categories.filter(c => c.categoryId !== categoryId));
      } catch (err) {
        setError('Failed to delete category');
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName || '',
      description: category.description || ''
    });
    setShowCategoryForm(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({
      categoryName: '',
      description: ''
    });
    setShowCategoryForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.categoryId, formData);
      } else {
        await categoryService.createCategory(formData);
      }

      setShowCategoryForm(false);
      fetchCategories();
    } catch (err) {
      setError(`Failed to ${editingCategory ? 'update' : 'create'} category`);
      console.error('Error saving category:', err);
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = !searchTerm || 
      category.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h3>📂 Category Management</h3>
        <button onClick={handleAdd} className="btn-primary">
          ➕ Add Category
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="filter-section">
        <div className="filter-group search-box">
          <label>Search Categories:</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th>Products Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map(category => (
              <tr key={category.categoryId}>
                <td>
                  <div className="category-info">
                    <div className="category-icon">📂</div>
                    <strong>{category.categoryName}</strong>
                  </div>
                </td>
                <td>
                  <div className="category-description">
                    {category.description || 'No description provided'}
                  </div>
                </td>
                <td>
                  <span className="product-count-badge">
                    {category.productCount || 0} products
                  </span>
                </td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                    <button 
                      onClick={() => handleEdit(category)}
                      className="btn-secondary btn-small"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(category.categoryId)}
                      className="btn-danger btn-small"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCategories.length === 0 && (
          <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
            {searchTerm ? 'No categories match your search criteria.' : 'No categories found. Create your first category!'}
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="modal-overlay" onClick={() => setShowCategoryForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowCategoryForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                  required
                  placeholder="e.g., Electronics, Clothing, Books"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what products belong to this category..."
                />
              </div>

              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                <button type="submit" className="btn-primary">
                  {editingCategory ? '💾 Update Category' : '➕ Create Category'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowCategoryForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;