import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import './AdminPanel.css';

function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSeedProducts = async () => {
    if (!isAdmin()) {
      setError('Only administrators can perform this action.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/admin/seed-products');
      setMessage(response.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to seed products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="admin-panel">
        <h2>Admin Panel</h2>
        <p>Please log in to access the admin panel.</p>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="admin-panel">
        <h2>Admin Panel</h2>
        <p>Access denied. This area is restricted to administrators only.</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="admin-section">
        <h3>Database Management</h3>
        <div className="admin-card">
          <h4>Seed Products</h4>
          <p>Add sample products to the database (only if no products exist)</p>
          
          <button 
            onClick={handleSeedProducts}
            disabled={loading}
            className={`seed-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Adding Products...' : 'Add Fake Products'}
          </button>

          {message && (
            <div className="success-message">
              ✅ {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
        </div>
      </div>

      <div className="admin-info">
        <h3>Admin Information</h3>
        <p><strong>Logged in as:</strong> {user.username}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>
    </div>
  );
}

export default AdminPanel;