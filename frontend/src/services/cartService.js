import { api } from './api';

export const cartService = {
  // Get cart items for the current user
  getCartItems: async (userId) => {
    try {
      const response = await api.get(`/cart/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (userId, productId, quantity) => {
    try {
      const response = await api.post('/cart', {
        userId,
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (userId, productId, quantity) => {
    try {
      const response = await api.put('/cart', {
        userId,
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (userId, productId) => {
    try {
      await api.delete(`/cart/${userId}/${productId}`);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async (userId) => {
    try {
      await api.delete(`/cart/${userId}`);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Sync local cart with server (for when user logs in)
  syncCart: async (userId, localCartItems) => {
    try {
      const response = await api.post(`/cart/sync/${userId}`, {
        items: localCartItems
      });
      return response.data;
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  }
};

export default cartService;