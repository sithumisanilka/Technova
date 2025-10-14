import { api } from './api';

export const cartService = {
  // Get cart by customer ID (matches backend endpoint)
  getCart: async (customerId) => {
    const response = await api.get(`/cart/${customerId}`);
    return response.data;
  },

  // Add item to cart (matches backend endpoint)
  addItemToCart: async (
    customerId,
    productId,
    quantity,
    unitPrice
  ) => {
    const response = await api.post(
      `/cart/${customerId}/items?productId=${productId}&quantity=${quantity}&unitPrice=${unitPrice}`
    );
    return response.data;
  },

  // Update cart item quantity (matches backend endpoint)
  updateCartItem: async (
    customerId,
    productId,
    quantity
  ) => {
    const response = await api.put(
      `/cart/${customerId}/items/${productId}?quantity=${quantity}`
    );
    return response.data;
  },

  // Remove item from cart (matches backend endpoint)
  removeItemFromCart: async (customerId, productId) => {
    await api.delete(`/cart/${customerId}/items/${productId}`);
  },

  // Clear entire cart (matches backend endpoint)
  clearCart: async (customerId) => {
    await api.delete(`/cart/${customerId}`);
  },
};
