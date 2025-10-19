import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import AuthModal from '../AuthModal';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <h1>TECHNOVA</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`nav ${isMobileMenuOpen ? 'nav-mobile-open' : ''}`}>
            <Link to="/products" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Products
            </Link>
            <Link to="/services" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Services
            </Link>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                🔍
              </button>
            </form>

            {isAuthenticated() ? (
              <>
                <Link to="/cart" className="cart-link" onClick={() => setIsMobileMenuOpen(false)}>
                  🛒 Cart ({itemCount || 0})
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="nav-link admin-link" onClick={() => setIsMobileMenuOpen(false)}>
                    ⚙️ Admin
                  </Link>
                )}
                <Link to="/profile" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  👤 {user?.username} {user?.role === 'ADMIN' && '(Admin)'}
                </Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  className="nav-link" 
                  onClick={() => openAuthModal('login')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Login
                </button>
                <button 
                  className="nav-link register-btn" 
                  onClick={() => openAuthModal('register')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Register
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        initialMode={authModalMode} 
      />
    </header>
  );
};

export default Header;