import { api } from './api';
import { Cart, CartItem } from '@/types';

export const cartService = {
  // Get cart by customer ID (matches backend endpoint)
  getCart: async (customerId: number): Promise<Cart> => {
    const response = await api.get<Cart>(`/cart/${customerId}`);
    return response.data;
  },

  // Add item to cart (matches backend endpoint)
  addItemToCart: async (
    customerId: number,
    productId: number,
    quantity: number,
    unitPrice: number
  ): Promise<Cart> => {
    const response = await api.post<Cart>(
      `/cart/${customerId}/items?productId=${productId}&quantity=${quantity}&unitPrice=${unitPrice}`
    );
    return response.data;
  },

  // Update cart item quantity (matches backend endpoint)
  updateCartItem: async (
    customerId: number,
    productId: number,
    quantity: number
  ): Promise<Cart> => {
    const response = await api.put<Cart>(
      `/cart/${customerId}/items/${productId}?quantity=${quantity}`
    );
    return response.data;
  },

  // Remove item from cart (matches backend endpoint)
  removeItemFromCart: async (customerId: number, productId: number): Promise<void> => {
    await api.delete(`/cart/${customerId}/items/${productId}`);
  },

  // Clear entire cart (matches backend endpoint)
  clearCart: async (customerId: number): Promise<void> => {
    await api.delete(`/cart/${customerId}`);
  },
};
