import { api } from './api';

export const serviceService = {
  // Get all services
  getAllServices: async () => {
    try {
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Get available services
  getAvailableServices: async () => {
    try {
      const response = await api.get('/services/available');
      return response.data;
    } catch (error) {
      console.error('Error fetching available services:', error);
      throw error;
    }
  },

  // Get service by ID
  getServiceById: async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  },

  // Search services
  searchServices: async (keyword) => {
    try {
      const response = await api.get(`/services/search?keyword=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching services:', error);
      throw error;
    }
  },

  // Get services by category
  getServicesByCategory: async (category) => {
    try {
      const response = await api.get(`/services/category/${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching services by category:', error);
      throw error;
    }
  },

  // Get service image
  getServiceImageUrl: (serviceId) => {
    return `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api'}/services/${serviceId}/image`;
  },

  // Add service to cart
  addServiceToCart: async (serviceId, rentalPeriod, rentalPeriodType, unitPrice) => {
    try {
      const response = await api.post('/cart/add-service', {
        serviceId,
        rentalPeriod,
        rentalPeriodType,
        unitPrice
      });
      return response.data;
    } catch (error) {
      console.error('Error adding service to cart:', error);
      throw error;
    }
  },

  // Remove service from cart
  removeServiceFromCart: async (serviceId) => {
    try {
      const response = await api.delete(`/cart/remove-service/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing service from cart:', error);
      throw error;
    }
  }
};