import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'BANK_TRANSFER'
  });

  const [receiptFile, setReceiptFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReceiptUpload = (e) => {
    setReceiptFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // If payment method is bank transfer and no receipt file, show error
      if (formData.paymentMethod === 'BANK_TRANSFER' && !receiptFile) {
        alert('Please upload a bank transfer receipt for bank transfer payments.');
        setIsProcessing(false);
        return;
      }

      // Use multipart endpoint if receipt file is provided
      if (receiptFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('customerId', user?.id || 1);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('shippingName', `${formData.firstName} ${formData.lastName}`);
        formDataToSend.append('shippingAddress', formData.address);
        formDataToSend.append('shippingCity', formData.city);
        formDataToSend.append('shippingPostalCode', formData.postalCode);
        formDataToSend.append('shippingPhone', formData.phone);
        formDataToSend.append('paymentMethod', formData.paymentMethod);
        formDataToSend.append('notes', '');
        formDataToSend.append('receiptFile', receiptFile);

        const response = await fetch('http://localhost:8081/api/orders/with-receipt', {
          method: 'POST',
          body: formDataToSend
        });

        if (!response.ok) {
          throw new Error('Failed to place order');
        }

        const order = await response.json();
        
        // Clear cart after successful order
        await clearCart();
        
        alert(`Order placed successfully! Order Number: ${order.orderNumber}`);
        navigate('/products');
      } else {
        // Use regular JSON endpoint for orders without receipt
        const orderData = {
          customerId: user?.id || 1,
          email: formData.email,
          shippingName: `${formData.firstName} ${formData.lastName}`,
          shippingAddress: formData.address,
          shippingCity: formData.city,
          shippingPostalCode: formData.postalCode,
          shippingPhone: formData.phone,
          paymentMethod: formData.paymentMethod,
          notes: ''
        };

        const order = await orderService.createOrder(orderData);
        
        // Clear cart after successful order
        await clearCart();
        
        alert(`Order placed successfully! Order Number: ${order.orderNumber}`);
        navigate('/products');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h1>No items to checkout</h1>
          <p>Your cart is empty. Please add some items before proceeding to checkout.</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const tax = Math.round((parseFloat(total) || 0) * 0.1);
  const finalTotal = (parseFloat(total) || 0) + tax;

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your purchase</p>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Contact Information</h2>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Shipping Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="input"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={formData.paymentMethod === 'BANK_TRANSFER'}
                    onChange={handleInputChange}
                  />
                  <span>🏦 Bank Transfer</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={handleInputChange}
                  />
                  <span>💵 Cash on Delivery</span>
                </label>
              </div>

              {formData.paymentMethod === 'BANK_TRANSFER' && (
                <div className="bank-transfer-section">
                  <h3>Bank Transfer Details</h3>
                  <div className="bank-info">
                    <p><strong>Bank Name:</strong> Technova Bank</p>
                    <p><strong>Account Number:</strong> 1234567890</p>
                    <p><strong>Account Name:</strong> Technova E-Commerce</p>
                    <p><strong>Branch:</strong> Main Branch</p>
                  </div>
                  <div className="receipt-upload">
                    <label htmlFor="receipt" className="file-label">
                      Upload Bank Transfer Receipt <span className="required">*</span>
                    </label>
                    <input
                      type="file"
                      id="receipt"
                      accept="image/*,.pdf"
                      onChange={handleReceiptUpload}
                      className="file-input"
                      required={formData.paymentMethod === 'BANK_TRANSFER'}
                    />
                    {receiptFile && (
                      <div className="file-preview">
                        <span>� {receiptFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="btn btn-primary submit-btn"
            >
              {isProcessing ? 'Processing...' : `Place Order - Rs. ${isNaN(finalTotal) ? '0' : finalTotal.toLocaleString()}`}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <div className="summary-card">
            <h2>Order Summary</h2>
            
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    {item.itemType === 'SERVICE' ? (
                      <>
                        <h4>{item.serviceName || 'Service'}</h4>
                        <p>Rental: {item.rentalPeriod || 0} {item.rentalPeriodType === 'HOURLY' ? 'hours' : 'days'}</p>
                      </>
                    ) : (
                      <>
                        <h4>{item.product?.productName || 'Product'}</h4>
                        <p>Qty: {item.quantity || 0}</p>
                      </>
                    )}
                  </div>
                  <div className="item-total">
                    {item.itemType === 'SERVICE' ? (
                      <span>Rs. {(parseFloat(item.totalPrice) || 0).toLocaleString()}</span>
                    ) : (
                      <span>Rs. {((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-calculations">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs. {isNaN(total) ? '0' : total.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%)</span>
                <span>Rs. {isNaN(tax) ? '0' : tax.toLocaleString()}</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total</span>
                <span>Rs. {isNaN(finalTotal) ? '0' : finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;