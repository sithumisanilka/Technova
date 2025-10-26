import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const roles = ['USER', 'ADMIN'];
  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'USER', label: 'Users' },
    { value: 'ADMIN', label: 'Administrators' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        setError('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      ));
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (err) {
      setError('Failed to update user role');
      console.error('Error updating user role:', err);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filterRole || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeClass = (role) => {
    return role === 'ADMIN' ? 'role-admin' : 'role-user';
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h3>👥 User Management</h3>
        <button onClick={fetchUsers} className="btn-primary">
          🔄 Refresh Users
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Filter by Role:</label>
          <select
            className="filter-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group search-box">
          <label>Search Users:</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Search by username, email, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Registered</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {(user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}
                    </div>
                    <div>
                      <strong>{user.username}</strong>
                      {(user.firstName || user.lastName) && (
                        <div className="user-full-name">
                          {user.firstName} {user.lastName}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                    className={`role-select ${getRoleBadgeClass(user.role)}`}
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>{formatDate(user.lastLoginAt)}</td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                    <button 
                      onClick={() => viewUserDetails(user)}
                      className="btn-secondary btn-small"
                    >
                      👁️ View
                    </button>
                    {user.role !== 'ADMIN' && (
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="btn-danger btn-small"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
            {searchTerm || filterRole ? 'No users match your search criteria.' : 'No users found.'}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details - {selectedUser.username}</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowUserDetails(false)}
              >
                ✕
              </button>
            </div>

            <div className="user-details">
              <div className="details-section">
                <h4>Basic Information</h4>
                <p><strong>Username:</strong> {selectedUser.username}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>First Name:</strong> {selectedUser.firstName || 'Not provided'}</p>
                <p><strong>Last Name:</strong> {selectedUser.lastName || 'Not provided'}</p>
                <p><strong>Role:</strong> 
                  <span className={`role-badge ${getRoleBadgeClass(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </p>
              </div>

              <div className="details-section">
                <h4>Account Status</h4>
                <p><strong>Account Created:</strong> {formatDate(selectedUser.createdAt)}</p>
                <p><strong>Last Updated:</strong> {formatDate(selectedUser.updatedAt)}</p>
                <p><strong>Last Login:</strong> {formatDate(selectedUser.lastLoginAt)}</p>
                <p><strong>Account Status:</strong> 
                  <span className="status-badge active">Active</span>
                </p>
              </div>

              {selectedUser.phoneNumber && (
                <div className="details-section">
                  <h4>Contact Information</h4>
                  <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
                </div>
              )}

              {selectedUser.address && (
                <div className="details-section">
                  <h4>Address</h4>
                  <p>{selectedUser.address}</p>
                </div>
              )}

              <div className="details-section">
                <h4>Account Statistics</h4>
                <p><strong>User ID:</strong> {selectedUser.id}</p>
                <p><strong>Account Age:</strong> {
                  selectedUser.createdAt 
                    ? Math.floor((new Date() - new Date(selectedUser.createdAt)) / (1000 * 60 * 60 * 24)) + ' days'
                    : 'Unknown'
                }</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;