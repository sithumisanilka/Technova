import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '@/types/order';
import { cartApi } from '@/services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItemQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, user]);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const cartData = await cartApi.getCartByCustomerId(user.id);
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
      // If cart doesn't exist, create an empty one
      setCart({
        id: 0,
        customerId: user.id,
        items: [],
        subtotal: 0,
        tax: 0,
        shippingCost: 0,
        totalAmount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number): Promise<void> => {
    if (!user) {
      throw new Error('You must be logged in to add items to cart');
    }

    try {
      setIsLoading(true);
      const updatedCart = await cartApi.addItemToCart(user.id, productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemQuantity = async (cartItemId: number, quantity: number): Promise<void> => {
    if (!user) return;

    try {
      setIsLoading(true);
      if (quantity <= 0) {
        await cartApi.removeItemFromCart(cartItemId);
      } else {
        await cartApi.updateCartItemQuantity(cartItemId, quantity);
      }
      await loadCart(); // Refresh cart after update
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number): Promise<void> => {
    if (!user) return;

    try {
      setIsLoading(true);
      await cartApi.removeItemFromCart(cartItemId);
      await loadCart(); // Refresh cart after removal
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!user) return;

    try {
      setIsLoading(true);
      await cartApi.clearCart(user.id);
      setCart({
        id: 0,
        customerId: user.id,
        items: [],
        subtotal: 0,
        tax: 0,
        shippingCost: 0,
        totalAmount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async (): Promise<void> => {
    await loadCart();
  };

  const getCartItemCount = (): number => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = (): number => {
    if (!cart) return 0;
    return cart.totalAmount;
  };

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    getCartItemCount,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
