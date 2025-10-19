import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h1>Your cart is empty</h1>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping →
          </Link>
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

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.productName} />
                ) : (
                  <div className="no-image">📦</div>
                )}
              </div>

              <div className="item-details">
                <h3 className="item-name">{item.product.productName}</h3>
                
                {item.product.brand && (
                  <p className="item-brand">{item.product.brand}</p>
                )}
                
                {item.product.category && (
                  <span className="badge item-category">
                    {item.product.category.categoryName}
                  </span>
                )}
                
                <p className="item-description">{item.product.description}</p>
              </div>

              <div className="item-controls">
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(item.product.productId, item.quantity - 1)}
                    className="quantity-btn"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product.productId, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>

                <div className="item-price">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>

                <button
                  onClick={() => removeItem(item.product.productId)}
                  className="remove-btn"
                  title="Remove from cart"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          <div className="cart-actions">
            <button
              onClick={clearCart}
              className="btn btn-danger clear-cart-btn"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal ({itemCount} items)</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div className="summary-row">
              <span>Tax</span>
              <span>Rs. {Math.round(total * 0.1).toLocaleString()}</span>
            </div>
            
            <hr />
            
            <div className="summary-row total-row">
              <span>Total</span>
              <span>Rs. {Math.round(total * 1.1).toLocaleString()}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary checkout-btn">
              Proceed to Checkout
            </Link>

            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;