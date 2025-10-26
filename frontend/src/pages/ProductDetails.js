import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/ProductService';
import api from '../api/axiosConfig';
import './ProductDetails.css';

// Component to handle product images from database
const ProductDetailImage = ({ productId, productName }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
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

  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  if (loading) {
    return (
      <div className="image-loading">
        <span>⏳ Loading image...</span>
      </div>
    );
  }

  if (hasError || !imageSrc) {
    return (
      <div className="no-image">
        <span>📱</span>
        <p>No Image Available</p>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc} 
      alt={productName}
      onError={() => setHasError(true)}
    />
  );
};

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      setMessage('Please login to add items to cart');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setAddingToCart(true);
    setMessage('');

    try {
      const success = await addItem(product, quantity);
      if (success) {
        setMessage(`Added ${quantity} ${product.productName} to cart!`);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to add item to cart');
      }
    } catch (err) {
      setMessage('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= product.quantity) {
      setQuantity(value);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated()) {
      setMessage('Please login to purchase items');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    handleAddToCart();
    setTimeout(() => navigate('/cart'), 1000);
  };

  if (loading) {
    return (
      <div className="product-details-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-container">
        <div className="error-message">
          <h2>Product Not Found</h2>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <div className="product-details">
        <button onClick={() => navigate('/products')} className="back-button">
          ← Back to Products
        </button>

        <div className="product-content">
          <div className="product-image-section">
            <div className="product-image">
              <ProductDetailImage productId={product.productId} productName={product.productName} />
            </div>
          </div>

          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.productName}</h1>
              <div className="product-brand">
                <span className="brand-label">Brand:</span>
                <span className="brand-name">{product.brand}</span>
              </div>
            </div>

            <div className="product-price">
              <span className="price">${product.price}</span>
              <div className="availability">
                {product.isAvailable && product.quantity > 0 ? (
                  <span className="in-stock">✅ In Stock ({product.quantity} available)</span>
                ) : (
                  <span className="out-of-stock">❌ Out of Stock</span>
                )}
              </div>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.productDescription || 'No description available.'}</p>
            </div>

            <div className="product-specifications">
              <h3>Specifications</h3>
              <p>{product.laptopSpec || 'No specifications available.'}</p>
            </div>

            {product.isAvailable && product.quantity > 0 && (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <select 
                    id="quantity" 
                    value={quantity} 
                    onChange={handleQuantityChange}
                    className="quantity-select"
                  >
                    {[...Array(Math.min(10, product.quantity))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="action-buttons">
                  <button 
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="btn btn-outline"
                  >
                    {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
                  </button>
                  
                  <button 
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="btn btn-primary"
                  >
                    🚀 Buy Now
                  </button>
                </div>

                {message && (
                  <div className={`message ${message.includes('Failed') || message.includes('login') ? 'error' : 'success'}`}>
                    {message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;