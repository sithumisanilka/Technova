import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import OrderManagement from './admin/OrderManagement';
import ProductManagement from './admin/ProductManagement';
import ServiceManagement from './admin/ServiceManagement';
import UserManagement from './admin/UserManagement';
import CategoryManagement from './admin/CategoryManagement';
import './AdminPanel.css';

function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'orders', label: '📦 Orders', icon: '📦' },
    { id: 'products', label: '📱 Products', icon: '📱' },
    { id: 'services', label: '🛠️ Services', icon: '🛠️' },
    { id: 'categories', label: '📂 Categories', icon: '📂' },
    { id: 'users', label: '👥 Users', icon: '👥' }
  ];

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="admin-dashboard">
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>📦 Orders Overview</h3>
                <p>Manage customer orders, update statuses, and track payments</p>
                <button onClick={() => setActiveTab('orders')} className="dashboard-btn">
                  Go to Orders
                </button>
              </div>
              <div className="dashboard-card">
                <h3>📱 Products Management</h3>
                <p>Add, edit, and remove products from your catalog</p>
                <button onClick={() => setActiveTab('products')} className="dashboard-btn">
                  Manage Products
                </button>
              </div>
              <div className="dashboard-card">
                <h3>🛠️ Services Management</h3>
                <p>Manage rental services and pricing</p>
                <button onClick={() => setActiveTab('services')} className="dashboard-btn">
                  Manage Services
                </button>
              </div>
              <div className="dashboard-card">
                <h3>� Categories Management</h3>
                <p>Organize products into categories for better navigation</p>
                <button onClick={() => setActiveTab('categories')} className="dashboard-btn">
                  Manage Categories
                </button>
              </div>
              <div className="dashboard-card">
                <h3>�👥 Users Management</h3>
                <p>View and manage user accounts and permissions</p>
                <button onClick={() => setActiveTab('users')} className="dashboard-btn">
                  Manage Users
                </button>
              </div>
            </div>
            <div className="admin-info">
              <h3>Admin Information</h3>
              <p><strong>Logged in as:</strong> {user?.username}</p>
              <p><strong>Role:</strong> {user?.role}</p>
              <p><strong>Access Level:</strong> Administrator</p>
            </div>
          </div>
        );
      case 'orders':
        return <OrderManagement />;
      case 'products':
        return <ProductManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <div>Select a tab to manage</div>;
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      
      <div className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default AdminPanel;