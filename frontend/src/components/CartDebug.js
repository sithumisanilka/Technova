import React from 'react';
import { useCart } from '../context/CartContext';

const CartDebug = () => {
  const { cartItems, total, itemCount, addItem } = useCart();

  const testProduct = {
    productId: 1,
    productName: "Test Laptop",
    price: 50000,
    description: "Test product for debugging",
    brand: "Test Brand"
  };

  const handleAddTestItem = () => {
    addItem(testProduct, 1);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: '#f0f0f0', 
      padding: '20px', 
      border: '1px solid #ccc',
      borderRadius: '8px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4>Cart Debug Info</h4>
      <p><strong>Items:</strong> {itemCount}</p>
      <p><strong>Total:</strong> Rs. {total.toLocaleString()}</p>
      <button onClick={handleAddTestItem} style={{
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '10px'
      }}>
        Add Test Item
      </button>
      <div>
        <strong>Cart Items:</strong>
        {cartItems.length === 0 ? (
          <p>No items</p>
        ) : (
          <ul style={{ fontSize: '12px', margin: '10px 0' }}>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.product.productName} (Qty: {item.quantity})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CartDebug;