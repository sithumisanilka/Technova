import React, { createContext, useContext, useReducer, useEffect } from "react";
import { cartService } from '../services/cartService';

const CartContext = createContext(undefined);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.productId === product.productId
      );

      let updatedItems;

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem = {
          id: `${product.productId}-${Date.now()}`,
          product,
          quantity,
          price: product.price,
        };
        updatedItems = [...state.items, newItem];
      }

      const total = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        items: updatedItems,
        total,
        itemCount,
      };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.product.productId.toString() !== action.payload
      );
      const total = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        items: updatedItems,
        total,
        itemCount,
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: productId });
      }

      const updatedItems = state.items.map((item) =>
        item.product.productId === productId
          ? { ...item, quantity }
          : item
      );

      const total = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        items: updatedItems,
        total,
        itemCount,
      };
    }

    case "CLEAR_CART": {
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };
    }

    case "LOAD_CART": {
      const items = action.payload || [];
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        items,
        total,
        itemCount,
      };
    }

    default:
      return state;
  }
};

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // For now, using a dummy user ID. In a real app, this would come from authentication
  const userId = 1; // This should be replaced with actual user authentication

  // Load cart from backend on initialization
  useEffect(() => {
    const loadCart = async () => {
      try {
        // Try to load from backend first
        const serverCartItems = await cartService.getCartItems(userId);
        if (serverCartItems && serverCartItems.length > 0) {
          dispatch({ type: "LOAD_CART", payload: serverCartItems });
        } else {
          // Fallback to localStorage if backend is not available or empty
          const savedCart = localStorage.getItem("cart");
          if (savedCart) {
            try {
              const cartItems = JSON.parse(savedCart);
              dispatch({ type: "LOAD_CART", payload: cartItems });
              // Sync local cart to server
              if (cartItems.length > 0) {
                await cartService.syncCart(userId, cartItems);
              }
            } catch (error) {
              console.error("Error loading cart from localStorage:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error loading cart from server:", error);
        // Fallback to localStorage
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            const cartItems = JSON.parse(savedCart);
            dispatch({ type: "LOAD_CART", payload: cartItems });
          } catch (localError) {
            console.error("Error loading cart from localStorage:", localError);
          }
        }
      }
    };

    loadCart();
  }, [userId]);

  // Save cart to localStorage whenever it changes (as backup)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = async (product, quantity = 1) => {
    try {
      // Update local state first for immediate UI feedback
      dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
      
      // Then sync with backend
      await cartService.addToCart(userId, product.productId, quantity);
      
      console.log(`Added ${product.productName} to cart`);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      // Optionally revert the local change if backend fails
      // For now, we'll keep the local change as fallback
    }
  };

  const removeItem = async (productId) => {
    try {
      // Update local state first
      dispatch({ type: "REMOVE_ITEM", payload: productId.toString() });
      
      // Then sync with backend
      await cartService.removeFromCart(userId, productId);
      
      console.log("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      // Optionally revert the local change if backend fails
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      // Update local state first
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
      
      // Then sync with backend
      if (quantity > 0) {
        await cartService.updateCartItem(userId, productId, quantity);
      } else {
        await cartService.removeFromCart(userId, productId);
      }
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
      // Optionally revert the local change if backend fails
    }
  };

  const clearCart = async () => {
    try {
      // Update local state first
      dispatch({ type: "CLEAR_CART" });
      
      // Then sync with backend
      await cartService.clearCart(userId);
      
      console.log("Cart cleared");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      // Optionally revert the local change if backend fails
    }
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(
      (item) => item.product.productId === productId
    );
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        total: state.total,
        itemCount: state.itemCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};