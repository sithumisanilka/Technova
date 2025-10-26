import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, total, itemCount, updateQuantity, removeItem, removeServiceFromCart, clearCart } = useCart();

  // Separate products and services
  const products = cartItems.filter(item => !item.itemType || item.itemType === 'PRODUCT');
  const services = cartItems.filter(item => item.itemType === 'SERVICE');

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h1>Your cart is empty</h1>
          <p>Looks like you haven't added any products or services to your cart yet.</p>
          <div className="empty-cart-actions">
            <Link to="/products" className="btn btn-primary">
              Shop Products →
            </Link>
            <Link to="/services" className="btn btn-secondary">
              Browse Services →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleServiceRemove = (serviceId) => {
    removeServiceFromCart(serviceId);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          
          {/* Products Section */}
          {products.length > 0 && (
            <div className="cart-section">
              <h2 className="section-title">Products ({products.length})</h2>
              {products.map((item) => (
                <ProductCartItem 
                  key={item.id} 
                  item={item} 
                  onQuantityChange={handleQuantityChange}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}

          {/* Services Section */}
          {services.length > 0 && (
            <div className="cart-section">
              <h2 className="section-title">Services ({services.length})</h2>
              {services.map((item) => (
                <ServiceCartItem 
                  key={item.id} 
                  item={item} 
                  onRemove={handleServiceRemove}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <div className="summary-header">
            <h2>Order Summary</h2>
          </div>
          
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal ({itemCount} items)</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Rs. 500.00</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>Rs. {(total * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs. {(total + 500 + (total * 0.1)).toFixed(2)}</span>
            </div>
          </div>

          <div className="cart-actions">
            <Link to="/checkout" className="btn btn-primary btn-full">
              Proceed to Checkout →
            </Link>
            <button onClick={clearCart} className="btn btn-outline btn-full">
              Clear Cart
            </button>
          </div>

          <div className="continue-shopping">
            <Link to="/products">← Continue Shopping Products</Link>
            <Link to="/services">← Browse More Services</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Cart Item Component
const ProductCartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="cart-item">
      <div className="item-image">
        {item.product?.imageUrl ? (
          <img src={item.product.imageUrl} alt={item.product?.productName} />
        ) : (
          <div className="no-image">📦</div>
        )}
      </div>

      <div className="item-details">
        <h3>{item.product?.productName}</h3>
        <p className="item-price">Rs. {item.price.toFixed(2)} each</p>
      </div>

      <div className="item-controls">
        <div className="quantity-controls">
          <button 
            onClick={() => onQuantityChange(item.product.productId, item.quantity - 1)}
            className="quantity-btn"
          >
            -
          </button>
          <span className="quantity">{item.quantity}</span>
          <button 
            onClick={() => onQuantityChange(item.product.productId, item.quantity + 1)}
            className="quantity-btn"
          >
            +
          </button>
        </div>
      </div>

      <div className="item-total">
        <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
      </div>

      <button 
        onClick={() => onRemove(item.product.productId)}
        className="remove-btn"
        title="Remove item"
      >
        ×
      </button>
    </div>
  );
};

// Service Cart Item Component
const ServiceCartItem = ({ item, onRemove }) => {
  const formatPeriodType = (type) => {
    return type === 'HOURLY' ? 'hour(s)' : 'day(s)';
  };

  return (
    <div className="cart-item service-item">
      <div className="item-image">
        <div className="service-icon">🔧</div>
      </div>

      <div className="item-details">
        <h3>{item.serviceName}</h3>
        <p className="service-details">
          Rs. {item.unitPrice.toFixed(2)} per {formatPeriodType(item.rentalPeriodType).slice(0, -3)}
        </p>
        <p className="rental-info">
          Rental Period: {item.rentalPeriod} {formatPeriodType(item.rentalPeriodType)}
        </p>
      </div>

      <div className="item-controls">
        <span className="service-period">
          {item.rentalPeriod} {formatPeriodType(item.rentalPeriodType)}
        </span>
      </div>

      <div className="item-total">
        <span>Rs. {item.totalPrice.toFixed(2)}</span>
      </div>

      <button 
        onClick={() => onRemove(item.serviceId)}
        className="remove-btn"
        title="Remove service"
      >
        ×
      </button>
    </div>
  );
};

export default Cart;