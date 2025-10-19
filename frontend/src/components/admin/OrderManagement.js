import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const orderStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status?status=${newStatus}`);
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = !filterStatus || order.status === filterStatus;
    const matchesSearch = !searchTerm || 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'PENDING': 'status-pending',
      'CONFIRMED': 'status-confirmed',
      'PROCESSING': 'status-processing',
      'SHIPPED': 'status-shipped',
      'DELIVERED': 'status-delivered',
      'CANCELLED': 'status-cancelled'
    };
    return statusClasses[status] || 'status-default';
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const downloadReceipt = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/receipt`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `order-${orderId}-receipt.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading receipt:', err);
      setError('Failed to download receipt');
    }
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h3>📦 Order Management</h3>
        <button onClick={fetchOrders} className="btn-primary">
          🔄 Refresh Orders
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
          <label>Filter by Status:</label>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {orderStatuses.map(status => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group search-box">
          <label>Search Orders:</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Search by order number, email, or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <strong>{order.orderNumber}</strong>
                </td>
                <td>
                  <div>
                    <div>{order.shippingName}</div>
                    <small style={{color: '#666'}}>{order.customerEmail}</small>
                  </div>
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td><strong>{formatPrice(order.totalAmount)}</strong></td>
                <td>
                  <select
                    className={`status-select ${getStatusBadgeClass(order.status)}`}
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <span className={`payment-method ${order.paymentMethod?.toLowerCase().replace('_', '-') || 'unknown'}`}>
                    {order.paymentMethod?.replace('_', ' ') || 'Unknown'}
                  </span>
                </td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                    <button 
                      onClick={() => viewOrderDetails(order)}
                      className="btn-secondary btn-small"
                    >
                      📋 View
                    </button>
                    {order.paymentMethod === 'BANK_TRANSFER' && (
                      <button 
                        onClick={() => downloadReceipt(order.id)}
                        className="btn-secondary btn-small"
                      >
                        📄 Receipt
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
            {searchTerm || filterStatus ? 'No orders match your search criteria.' : 'No orders found.'}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - {selectedOrder.orderNumber}</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowOrderDetails(false)}
              >
                ✕
              </button>
            </div>

            <div className="order-details">
              <div className="details-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.shippingName}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingPhone}</p>
              </div>

              <div className="details-section">
                <h4>Shipping Address</h4>
                <p>{selectedOrder.shippingAddress}</p>
                <p>{selectedOrder.shippingCity}, {selectedOrder.shippingPostalCode}</p>
              </div>

              <div className="details-section">
                <h4>Order Items</h4>
                {selectedOrder.orderItems?.map((item, index) => (
                  <div key={index} className="order-item">
                    <div>
                      <strong>
                        {item.itemType === 'PRODUCT' ? item.productName : item.serviceName}
                      </strong>
                    </div>
                    <div>
                      {item.itemType === 'PRODUCT' ? (
                        <>Quantity: {item.quantity} × {formatPrice(item.unitPrice)}</>
                      ) : (
                        <>Rental: {item.rentalPeriod} {item.rentalPeriodType?.toLowerCase()} × {formatPrice(item.unitPrice)}</>
                      )}
                    </div>
                    <div><strong>Total: {formatPrice(item.totalPrice)}</strong></div>
                  </div>
                ))}
              </div>

              <div className="details-section">
                <h4>Order Summary</h4>
                <p><strong>Subtotal:</strong> {formatPrice(selectedOrder.subtotal)}</p>
                <p><strong>Tax:</strong> {formatPrice(selectedOrder.tax)}</p>
                <p><strong>Shipping:</strong> {formatPrice(selectedOrder.shippingCost)}</p>
                <p><strong>Total:</strong> {formatPrice(selectedOrder.totalAmount)}</p>
              </div>

              {selectedOrder.notes && (
                <div className="details-section">
                  <h4>Notes</h4>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;