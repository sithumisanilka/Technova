import { api } from './api';
import { Order, PaginatedResponse, PaginationParams, CheckoutRequest } from '@/types';

export const orderService = {
  // Checkout from cart (matches backend endpoint)
  checkout: async (checkoutData: CheckoutRequest): Promise<Order> => {
    const response = await api.post<Order>('/orders/checkout', checkoutData);
    return response.data;
  },

  // Get order by ID (matches backend endpoint)
  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Get order by order number (matches backend endpoint)
  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/number/${orderNumber}`);
    return response.data;
  },

  // Get orders by customer ID (matches backend endpoint)
  getOrdersByCustomer: async (customerId: number): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/orders/customer/${customerId}`);
    return response.data;
  },

  // Get orders by customer ID with pagination (matches backend endpoint)
  getOrdersByCustomerPaginated: async (
    customerId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>(
      `/orders/customer/${customerId}/paginated?page=${page}&size=${size}`
    );
    return response.data;
  },

  // Update order status (matches backend endpoint)
  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/status?status=${status}`);
    return response.data;
  },

  // Get all orders (matches backend endpoint)
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  // Get orders by status (matches backend endpoint)
  getOrdersByStatus: async (status: string): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/orders/status/${status}`);
    return response.data;
  },

  // Get orders by date range (matches backend endpoint)
  getOrdersByDateRange: async (startDate: string, endDate: string): Promise<Order[]> => {
    const response = await api.get<Order[]>(
      `/orders/date-range?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  // Legacy methods for compatibility
  createOrder: async (orderData: {
    items: Array<{ productId: string; quantity: number; price: number }>;
    shippingAddress: any;
    paymentMethod: string;
  }): Promise<Order> => {
    // This would need to be adapted to work with the cart-based checkout
    throw new Error('Use checkout method instead of createOrder');
  },

  getMyOrders: async (pagination?: PaginationParams): Promise<PaginatedResponse<Order>> => {
    // This would need a customer ID - for now return empty
    throw new Error('Use getOrdersByCustomer with customer ID instead');
  },

  cancelOrder: async (id: number): Promise<Order> => {
    // Update status to CANCELLED
    return this.updateOrderStatus(id, 'CANCELLED');
  },

  updateTrackingNumber: async (id: number, trackingNumber: string): Promise<Order> => {
    // This would require updating the order entity - not implemented in backend yet
    throw new Error('Tracking number update not implemented in backend');
  },
};