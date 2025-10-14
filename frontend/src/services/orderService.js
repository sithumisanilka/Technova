import { api } from './api';

export const orderService = {
  // Checkout from cart (matches backend endpoint)
  checkout: async (checkoutData) => {
    const response = await api.post('/orders/checkout', checkoutData);
    return response.data;
  },

  // Get order by ID (matches backend endpoint)
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Get order by order number (matches backend endpoint)
  getOrderByNumber: async (orderNumber) => {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  // Get orders by customer ID (matches backend endpoint)
  getOrdersByCustomer: async (customerId) => {
    const response = await api.get(`/orders/customer/${customerId}`);
    return response.data;
  },

  // Get orders by customer ID with pagination (matches backend endpoint)
  getOrdersByCustomerPaginated: async (
    customerId,
    page = 0,
    size = 10
  ) => {
    const response = await api.get(
      `/orders/customer/${customerId}/paginated?page=${page}&size=${size}`
    );
    return response.data;
  },

  // Update order status (matches backend endpoint)
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status?status=${status}`);
    return response.data;
  },

  // Get all orders (matches backend endpoint)
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get orders by status (matches backend endpoint)
  getOrdersByStatus: async (status) => {
    const response = await api.get(`/orders/status/${status}`);
    return response.data;
  },

  // Get orders by date range (matches backend endpoint)
  getOrdersByDateRange: async (startDate, endDate) => {
    const response = await api.get(
      `/orders/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  // Legacy methods for compatibility
  createOrder: async (orderData) => {
    // This would need to be adapted to work with the cart-based checkout
    throw new Error('Use checkout method instead of createOrder');
  },

  getMyOrders: async (pagination) => {
    // This would need a customer ID - for now return empty
    throw new Error('Use getOrdersByCustomer with customer ID instead');
  },

  cancelOrder: async (id) => {
    // Update status to CANCELLED
    return this.updateOrderStatus(id, 'CANCELLED');
  },

  updateTrackingNumber: async (id, trackingNumber) => {
    // This would require updating the order entity - not implemented in backend yet
    throw new Error('Tracking number update not implemented in backend');
  },
};
