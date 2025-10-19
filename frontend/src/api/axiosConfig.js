import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getToken = () => {
  return localStorage.getItem('auth_token');
};

const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

const removeToken = () => {
  localStorage.removeItem('auth_token');
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

// User API endpoints
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/me', userData),
};

// Product API endpoints
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

// Cart API endpoints
export const cartAPI = {
  getCart: (customerId) => api.get(`/cart/${customerId}`),
  addItem: (customerId, productId, quantity, unitPrice) => 
    api.post(`/cart/${customerId}/add`, { productId, quantity, unitPrice }),
  updateItem: (customerId, productId, quantity) => 
    api.put(`/cart/${customerId}/update`, { productId, quantity }),
  removeItem: (customerId, productId) => 
    api.delete(`/cart/${customerId}/remove/${productId}`),
  clearCart: (customerId) => api.delete(`/cart/${customerId}/clear`),
};

// Order API endpoints
export const orderAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export { api, getToken, setToken, removeToken };
export default api;