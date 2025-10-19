import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();

  return (
    <div className="landing-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Technova</h1>
          <p className="hero-subtitle">Your One-Stop Shop for Premium Products</p>
          
          {!isAuthenticated() ? (
            <div className="hero-actions">
              <p className="hero-description">
                Browse our amazing collection of products. Sign up or log in to add items to your cart and make purchases!
              </p>
              <div className="action-buttons">
                <Link to="/register" className="btn btn-primary">Get Started</Link>
                <Link to="/login" className="btn btn-secondary">Sign In</Link>
              </div>
            </div>
          ) : (
            <div className="hero-actions">
              <p className="hero-description">
                Welcome back, {user?.username}! {user?.role === 'ADMIN' ? '(Administrator)' : ''}
              </p>
              <div className="action-buttons">
                <Link to="/products" className="btn btn-primary">Shop Now</Link>
                <Link to="/cart" className="btn btn-secondary">View Cart</Link>
                {isAdmin() && (
                  <Link to="/admin" className="btn btn-admin">Admin Panel</Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Why Choose Technova?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛍️</div>
              <h3>Premium Products</h3>
              <p>Carefully curated selection of high-quality products</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Shopping</h3>
              <p>Your data and payments are protected with advanced security</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💯</div>
              <h3>Quality Guarantee</h3>
              <p>100% satisfaction guarantee on all products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <h2>Ready to Start Shopping?</h2>
          <p>Browse our products even without an account, or create one to unlock full features!</p>
          <div className="cta-buttons">
            <Link to="/products" className="btn btn-outline">Browse Products</Link>
            {!isAuthenticated() && (
              <Link to="/register" className="btn btn-primary">Create Account</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;