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

  // Get service image URL
  getServiceImageUrl: (serviceId) => {
    return `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api'}/services/${serviceId}/image`;
  },

  // Get service image as blob
  getServiceImage: async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}/image`, {
        responseType: 'blob'
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error(`Error fetching service image ${serviceId}:`, error);
      return null;
    }
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
  },

  // Admin CRUD Operations
  
  // Create service
  createService: async (serviceData) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Create service with image upload
  createServiceWithImage: async (serviceData, imageFile = null) => {
    try {
      const formData = new FormData();
      
      // Append all service fields
      formData.append('serviceName', serviceData.serviceName);
      formData.append('description', serviceData.description || '');
      formData.append('pricePerDay', serviceData.pricePerDay || serviceData.price || 0);
      formData.append('pricePerHour', serviceData.pricePerHour || 0);
      formData.append('category', serviceData.category || '');
      formData.append('isAvailable', serviceData.isAvailable || true);
      formData.append('minRentalPeriod', serviceData.minRentalPeriod || 1);
      formData.append('maxRentalPeriod', serviceData.maxRentalPeriod || 720);
      
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const response = await api.post('/services/with-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating service with image:', error);
      throw error;
    }
  },

  // Update service
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await api.put(`/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  // Delete service
  deleteService: async (serviceId) => {
    try {
      await api.delete(`/services/${serviceId}`);
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
};