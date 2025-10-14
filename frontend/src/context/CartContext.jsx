import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

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
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        const updatedItems = state.items.filter((item) => item.id !== id);
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

      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
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

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    case "LOAD_CART":
      return action.payload;

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

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: cart });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addItem = (product, quantity = 1) => {
    if (product.quantity < quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.quantity} items available in stock.`,
        variant: "destructive",
      });
      return;
    }

    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeItem = (productId) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(
      (item) => item.product.productId.toString() === productId
    );
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
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
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
