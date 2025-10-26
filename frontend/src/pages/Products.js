import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/ProductService';
import './Products.css';

// Component to handle product images from database
const ProductImage = ({ productId, productName }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Try to get image from database first
        const imageUrl = await productService.getProductImage(productId);
        if (imageUrl) {
          setImageSrc(imageUrl);
        } else {
          setHasError(true);
        }
      } catch (error) {
        console.log('No database image found for product:', productId);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadImage();
    } else {
      setLoading(false);
      setHasError(true);
    }

  }, [productId]);

  // Cleanup effect for revoking blob URLs
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  if (loading) {
    return <div className="product-image-placeholder">⏳</div>;
  }

  if (hasError || !imageSrc) {
    return <div className="product-image-placeholder">📦</div>;
  }

  return (
    <img 
      src={imageSrc} 
      alt={productName}
      onError={() => setHasError(true)}
    />
  );
};

const brands = ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Microsoft'];
const categories = ['Gaming', 'Business', 'Premium', 'Budget'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'popularity';

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsData = await productService.getProducts();
        console.log('✅ Products loaded:', productsData);
        setProducts(productsData);
      } catch (err) {
        console.error('❌ Error loading products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleBrandChange = (brand, checked) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleSortChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    setSearchParams(newParams);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBrand =
      selectedBrands.length === 0 || 
      (product.brand && selectedBrands.includes(product.brand));
    const matchesCategory =
      selectedCategories.length === 0 ||
      (product.category &&
        selectedCategories.includes(product.category.categoryName));
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name':
        return a.productName.localeCompare(b.productName);
      default:
        return 0;
    }
  });

  const handleAddToCart = (product, event) => {
    event.stopPropagation(); // Prevent navigation when clicking add to cart
    if (!isAuthenticated()) {
      alert("Please log in to add items to your cart!");
      return;
    }
    addItem(product, 1);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">
          <div className="loading-spinner">⏳</div>
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      {!isAuthenticated() && (
        <div className="guest-notice">
          <p>
            🛍️ You're browsing as a guest. 
            <Link to="/login" className="login-link"> Log in </Link> 
            or 
            <Link to="/register" className="register-link"> sign up </Link> 
            to add items to your cart and make purchases!
          </p>
        </div>
      )}
      
      <div className="products-header">
        <h1 className="products-title">Products</h1>
        
        <div className="products-controls">
          <div className="view-controls">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            >
              List
            </button>
          </div>

          <div className="sort-control">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="select"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary filter-toggle"
          >
            🔍 Filters {showFilters ? '✕' : ''}
          </button>
        </div>
      </div>

      <div className="products-layout">
        {/* Filters Sidebar */}
        <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
          <div className="filters-content">
            <h3>Filters</h3>

            {/* Price Range */}
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="input price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="input price-input"
                />
              </div>
            </div>

            {/* Brands */}
            <div className="filter-group">
              <h4>Brands</h4>
              <div className="checkbox-group">
                {brands.map((brand) => (
                  <label key={brand} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) =>
                        handleBrandChange(brand, e.target.checked)
                      }
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="filter-group">
              <h4>Categories</h4>
              <div className="checkbox-group">
                {categories.map((category) => (
                  <label key={category} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={(e) =>
                        handleCategoryChange(category, e.target.checked)
                      }
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="products-main">
          <div className="products-count">
            Showing {sortedProducts.length} products
          </div>

          <div className={`products-grid ${viewMode}`}>
            {sortedProducts.map((product) => (
              <div 
                key={product.productId} 
                className="product-card"
                onClick={() => handleProductClick(product.productId)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image">
                  <ProductImage productId={product.productId} productName={product.productName} />
                </div>
                
                <div className="product-info">
                  <h3 className="product-name">{product.productName}</h3>
                  
                  {product.brand && (
                    <span className="product-brand">{product.brand}</span>
                  )}
                  
                  {product.category && (
                    <span className="badge product-category">
                      {product.category.categoryName}
                    </span>
                  )}
                  
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-footer">
                    <span className="product-price">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="btn btn-primary add-to-cart-btn"
                      title={!isAuthenticated() ? "Please log in to add to cart" : "Add to cart"}
                    >
                      {isAuthenticated() ? "Add to Cart" : "Login to Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;