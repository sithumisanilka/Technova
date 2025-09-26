import axios from 'axios';
import { Order, CheckoutRequest, OrderStatus, Cart } from '@/types/order';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const orderApi = {
  // Create order from cart (checkout)
  checkout: async (checkoutRequest: CheckoutRequest): Promise<Order> => {
    const response = await api.post('/orders/checkout', checkoutRequest);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: number): Promise<Order> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get order by order number
  getOrderByOrderNumber: async (orderNumber: string): Promise<Order> => {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  // Get orders by customer ID
  getOrdersByCustomerId: async (customerId: number): Promise<Order[]> => {
    const response = await api.get(`/orders/customer/${customerId}`);
    return response.data;
  },

  // Get orders by customer ID (paginated)
  getOrdersByCustomerIdPaginated: async (
    customerId: number,
    page: number = 0,
    size: number = 10
  ): Promise<{ content: Order[]; totalElements: number; totalPages: number }> => {
    const response = await api.get(`/orders/customer/${customerId}/paginated`, {
      params: { page, size }
    });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId: number, status: OrderStatus): Promise<Order> => {
    const response = await api.put(`/orders/${orderId}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  // Get all orders (admin)
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get orders by status
  getOrdersByStatus: async (status: OrderStatus): Promise<Order[]> => {
    const response = await api.get(`/orders/status/${status}`);
    return response.data;
  },

  // Get orders by date range
  getOrdersByDateRange: async (startDate: string, endDate: string): Promise<Order[]> => {
    const response = await api.get('/orders/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  },
};

export const cartApi = {
  // Get cart by customer ID
  getCartByCustomerId: async (customerId: number): Promise<Cart> => {
    const response = await api.get(`/cart/customer/${customerId}`);
    return response.data;
  },

  // Add item to cart
  addItemToCart: async (customerId: number, productId: number, quantity: number): Promise<Cart> => {
    const response = await api.post(`/cart/customer/${customerId}/items`, {
      productId,
      quantity
    });
    return response.data;
  },

  // Update cart item quantity
  updateCartItemQuantity: async (cartItemId: number, quantity: number): Promise<Cart> => {
    const response = await api.put(`/cart/items/${cartItemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeItemFromCart: async (cartItemId: number): Promise<void> => {
    await api.delete(`/cart/items/${cartItemId}`);
  },

  // Clear cart
  clearCart: async (customerId: number): Promise<void> => {
    await api.delete(`/cart/customer/${customerId}`);
  },
};

export const productApi = {
  // Get all products
  getAllProducts: async (): Promise<any[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get product by ID
  getProductById: async (productId: number): Promise<any> => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },
};

export default api;
