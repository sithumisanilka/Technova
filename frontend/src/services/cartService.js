import { api } from './api';

export const cartService = {
  // Get cart items for the current user
  getCartItems: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity, unitPrice) => {
    try {
      const response = await api.post('/cart/items', {
        productId,
        quantity,
        unitPrice
      });
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (productId, quantity) => {
    try {
      const response = await api.put(`/cart/items/${productId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      await api.delete(`/cart/items/${productId}`);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      await api.delete('/cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Sync local cart with server (for when user logs in)
  syncCart: async (localCartItems) => {
    try {
      const response = await api.post('/cart/sync', {
        items: localCartItems
      });
      return response.data;
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  },

  // Add service to cart
  addServiceToCart: async (serviceId, rentalPeriod, rentalPeriodType, unitPrice) => {
    try {
      const requestData = {
        serviceId,
        rentalPeriod,
        rentalPeriodType,
        unitPrice
      };
      
      console.log('🔍 Adding service to cart with data:', requestData);
      
      const response = await api.post('/cart/add-service', requestData);
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

export default cartService;