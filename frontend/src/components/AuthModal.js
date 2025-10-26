import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  // Update mode when initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Reset form when modal opens/closes or mode changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
      });
      setMessage('');
      setError('');
    }
  }, [isOpen, mode]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      setMessage('Login successful! Welcome back.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
    
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const result = await register(formData);
    
    if (result.success) {
      setMessage('Registration successful! You can now login.');
      setTimeout(() => {
        setMode('login');
        setFormData({
          username: formData.username,
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phoneNumber: ''
        });
      }, 2000);
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-modal-header">
          <button className="auth-modal-close" onClick={onClose}>
            ✕
          </button>
          <h2 className="auth-modal-title">
            {mode === 'login' ? 'Welcome Back' : 'Join TECHNOVA'}
          </h2>
          <p className="auth-modal-subtitle">
            {mode === 'login' 
              ? 'Sign in to access your account' 
              : 'Create your account to get started'
            }
          </p>
        </div>

        {/* Body */}
        <div className="auth-modal-body">
          {mode === 'login' ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="auth-form-group">
                <label className="auth-form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="auth-form-input"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="auth-form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {error && (
                <div className="auth-error">
                  ❌ {error}
                </div>
              )}

              {message && (
                <div className="auth-success">
                  ✅ {message}
                </div>
              )}

              <button
                type="submit"
                className={`auth-form-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? '' : 'Sign In'}
              </button>

              <button 
                type="button"
                className="forgot-password-link"
                onClick={() => {
                  // TODO: Implement forgot password functionality
                  alert('Forgot password functionality will be implemented soon!');
                }}
              >
                Forgot your password?
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="auth-form-group">
                <label className="auth-form-label">Username *</label>
                <input
                  type="text"
                  name="username"
                  className="auth-form-input"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="auth-form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label className="auth-form-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  className="auth-form-input"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="auth-form-row">
                <div className="auth-form-group">
                  <label className="auth-form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="auth-form-input"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="auth-form-input"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="auth-form-input"
                  placeholder="Your phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              {error && (
                <div className="auth-error">
                  ❌ {error}
                </div>
              )}

              {message && (
                <div className="auth-success">
                  ✅ {message}
                </div>
              )}

              <button
                type="submit"
                className={`auth-form-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? '' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="auth-modal-footer">
          <div className="auth-modal-switch">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <span className="auth-modal-link" onClick={() => switchMode('register')}>
                  Sign up now
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span className="auth-modal-link" onClick={() => switchMode('login')}>
                  Sign in here
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;