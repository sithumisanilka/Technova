import React, { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product && item.product.productId === product.productId
      );

      let updatedItems;

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.product && item.product.productId === product.productId
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
        (sum, item) => {
          if (item.itemType === 'SERVICE') {
            const servicePrice = parseFloat(item.totalPrice) || 0;
            return sum + servicePrice;
          } else if (item.price && item.quantity) {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return sum + (price * quantity);
          }
          return sum;
        },
        0
      );
      const itemCount = updatedItems.reduce(
        (sum, item) => {
          if (item.itemType === 'SERVICE') {
            return sum + 1;
          } else if (item.quantity) {
            const quantity = parseInt(item.quantity) || 0;
            return sum + quantity;
          }
          return sum;
        },
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
        (item) => item.product && item.product.productId.toString() !== action.payload
      );
      const total = updatedItems.reduce(
        (sum, item) => {
          if (item.itemType === 'SERVICE') {
            const servicePrice = parseFloat(item.totalPrice) || 0;
            return sum + servicePrice;
          } else if (item.price && item.quantity) {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return sum + (price * quantity);
          }
          return sum;
        },
        0
      );
      const itemCount = updatedItems.reduce(
        (sum, item) => {
          if (item.itemType === 'SERVICE') {
            return sum + 1;
          } else if (item.quantity) {
            const quantity = parseInt(item.quantity) || 0;
            return sum + quantity;
          }
          return sum;
        },
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
        item.product && item.product.productId === productId
          ? { ...item, quantity }
          : item
      );

      const total = updatedItems.reduce(
        (sum, item) => {
          if (item.itemType === 'SERVICE') {
            const servicePrice = parseFloat(item.totalPrice) || 0;
            return sum + servicePrice;
          } else if (item.price && item.quantity) {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return sum + (price * quantity);
          }
          return sum;
        },
        0
      );
      const itemCount = updatedItems.reduce(
        (sum, item) => {
          if (item.itemType === 'SERVICE') {
            return sum + 1;
          } else if (item.quantity) {
            const quantity = parseInt(item.quantity) || 0;
            return sum + quantity;
          }
          return sum;
        },
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
        (sum, item) => {
          if (item.itemType === 'SERVICE') {
            const servicePrice = parseFloat(item.totalPrice) || 0;
            return sum + servicePrice;
          } else if (item.price && item.quantity) {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return sum + (price * quantity);
          }
          return sum;
        },
        0
      );
      const itemCount = items.reduce(
        (sum, item) => {
          if (item.itemType === 'SERVICE') {
            return sum + 1;
          } else if (item.quantity) {
            const quantity = parseInt(item.quantity) || 0;
            return sum + quantity;
          }
          return sum;
        },
        0
      );

      return {
        items,
        total,
        itemCount,
      };
    }

    case "ADD_SERVICE": {
      const serviceItem = action.payload;
      const existingServiceIndex = state.items.findIndex(
        (item) => item.itemType === 'SERVICE' && item.serviceId === serviceItem.serviceId
      );

      let updatedItems;
      if (existingServiceIndex !== -1) {
        // Update existing service rental
        updatedItems = state.items.map((item, index) =>
          index === existingServiceIndex ? serviceItem : item
        );
      } else {
        // Add new service rental
        updatedItems = [...state.items, serviceItem];
      }

      const total = updatedItems.reduce(
        (sum, item) => {
          if (item.itemType === 'SERVICE') {
            const servicePrice = parseFloat(item.totalPrice) || 0;
            return sum + servicePrice;
          } else if (item.price && item.quantity) {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return sum + (price * quantity);
          }
          return sum;
        },
        0
      );
      const itemCount = updatedItems.reduce(
        (sum, item) => {
          if (item.itemType === 'SERVICE') {
            return sum + 1;
          } else if (item.quantity) {
            const quantity = parseInt(item.quantity) || 0;
            return sum + quantity;
          }
          return sum;
        },
        0
      );

      return {
        items: updatedItems,
        total,
        itemCount,
      };
    }

    case "REMOVE_SERVICE": {
      const serviceId = action.payload;
      const updatedItems = state.items.filter(
        (item) => !(item.itemType === 'SERVICE' && item.serviceId === serviceId)
      );

      const total = updatedItems.reduce(
        (sum, item) => sum + (item.totalPrice || (item.price * item.quantity)),
        0
      );
      const itemCount = updatedItems.reduce(
        (sum, item) => sum + (item.itemType === 'SERVICE' ? 1 : item.quantity),
        0
      );

      return {
        items: updatedItems,
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
  const { user, isAuthenticated } = useAuth();
  const prevAuthStatus = useRef(isAuthenticated());

  // Get user ID from authentication context
  const userId = user?.id;

  // Load cart from backend on initialization (only if authenticated)
  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated() || !userId) {
        // If not authenticated, load from localStorage as guest
        const savedCart = localStorage.getItem("guestCart");
        if (savedCart) {
          try {
            const cartItems = JSON.parse(savedCart);
            dispatch({ type: "LOAD_CART", payload: cartItems });
          } catch (error) {
            console.error("Error loading guest cart from localStorage:", error);
          }
        }
        return;
      }

      try {
        // For authenticated users, try to load from backend first
        const serverCartItems = await cartService.getCartItems();
        
        // Check if we have a local cart (from before login or previous session)
        const localCart = localStorage.getItem("cart") || localStorage.getItem("guestCart");
        let localCartItems = [];
        if (localCart) {
          try {
            localCartItems = JSON.parse(localCart);
          } catch (error) {
            console.error("Error parsing local cart:", error);
          }
        }

        // If server has items, use server cart
        if (serverCartItems && serverCartItems.cartItems && serverCartItems.cartItems.length > 0) {
          // Convert server format to local format
          const convertedItems = serverCartItems.cartItems.map(item => {
            if (item.itemType === 'SERVICE') {
              return {
                id: `service-${item.serviceId}-${Date.now()}`,
                itemType: 'SERVICE',
                serviceId: item.serviceId,
                serviceName: item.serviceName,
                rentalPeriod: item.rentalPeriod,
                rentalPeriodType: item.rentalPeriodType,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice
              };
            } else {
              return {
                id: `${item.productId}-${Date.now()}`,
                product: {
                  productId: item.productId,
                  productName: item.productName,
                  price: item.unitPrice
                },
                quantity: item.quantity,
                price: item.unitPrice
              };
            }
          });
          dispatch({ type: "LOAD_CART", payload: convertedItems });
        } 
        // If server is empty but we have local items, sync local to server
        else if (localCartItems.length > 0) {
          dispatch({ type: "LOAD_CART", payload: localCartItems });
          // Sync local cart to server in background
          try {
            for (const item of localCartItems) {
              if (item.itemType === 'SERVICE') {
                await cartService.addServiceToCart(
                  item.serviceId, 
                  item.rentalPeriod, 
                  item.rentalPeriodType, 
                  item.unitPrice
                );
              } else if (item.product && item.product.productId) {
                await cartService.addToCart(item.product.productId, item.quantity, item.product.price);
              }
            }
            // Remove guest cart after successful sync
            localStorage.removeItem("guestCart");
          } catch (syncError) {
            console.error("Error syncing cart to server:", syncError);
          }
        }
        // If both server and local are empty, keep empty cart
        else {
          dispatch({ type: "CLEAR_CART" });
        }
      } catch (error) {
        console.error("Error loading cart from server:", error);
        // If server fails, fallback to local cart
        const fallbackCart = localStorage.getItem("cart") || localStorage.getItem("guestCart");
        if (fallbackCart) {
          try {
            const cartItems = JSON.parse(fallbackCart);
            dispatch({ type: "LOAD_CART", payload: cartItems });
          } catch (localError) {
            console.error("Error loading fallback cart:", localError);
          }
        }
      }
    };

    loadCart();
  }, [isAuthenticated, userId]);

  // Save cart to localStorage whenever it changes (as backup)
  useEffect(() => {
    if (isAuthenticated()) {
      // For authenticated users, save to "cart" key
      localStorage.setItem("cart", JSON.stringify(state.items));
      // Clean up guest cart when user is authenticated
      if (localStorage.getItem("guestCart")) {
        localStorage.removeItem("guestCart");
      }
    } else {
      // For guest users, save to "guestCart" key
      localStorage.setItem("guestCart", JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated]);

  // Handle authentication state changes to preserve cart
  useEffect(() => {
    const currentAuthStatus = isAuthenticated();
    
    // Only act when authentication status actually changes
    if (prevAuthStatus.current !== currentAuthStatus) {
      const currentCart = state.items;
      
      if (currentCart && currentCart.length > 0) {
        if (currentAuthStatus) {
          // User just logged in - save current cart as authenticated cart
          localStorage.setItem("cart", JSON.stringify(currentCart));
        } else {
          // User just logged out - save current cart as guest cart
          localStorage.setItem("guestCart", JSON.stringify(currentCart));
        }
      }
      
      // Update the ref to the new authentication status
      prevAuthStatus.current = currentAuthStatus;
    }
  }, [isAuthenticated, state.items]); // Now properly include state.items in dependencies

  const addItem = async (product, quantity = 1) => {
    if (!isAuthenticated()) {
      // Show message that login is required for cart operations
      alert("Please log in to add items to your cart!");
      return false;
    }

    try {
      // Update local state first for immediate UI feedback
      dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
      
      // Then sync with backend
      await cartService.addToCart(product.productId, quantity, product.price);
      
      console.log(`Added ${product.productName} to cart`);
      return true;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      // Optionally revert the local change if backend fails
      // For now, we'll keep the local change as fallback
      return false;
    }
  };

  const removeItem = async (productId) => {
    if (!isAuthenticated()) {
      alert("Please log in to manage your cart!");
      return false;
    }

    try {
      // Update local state first
      dispatch({ type: "REMOVE_ITEM", payload: productId.toString() });
      
      // Then sync with backend
      await cartService.removeFromCart(productId);
      
      console.log("Item removed from cart");
      return true;
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      // Optionally revert the local change if backend fails
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      // Update local state first
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
      
      // Then sync with backend
      if (quantity > 0) {
        await cartService.updateCartItem(productId, quantity);
      } else {
        await cartService.removeFromCart(productId);
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
      await cartService.clearCart();
      
      console.log("Cart cleared");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      // Optionally revert the local change if backend fails
    }
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(
      (item) => item.product && item.product.productId === productId
    );
    return item ? item.quantity : 0;
  };

  const addServiceToCart = async (serviceId, rentalPeriod, rentalPeriodType, unitPrice) => {
    if (!isAuthenticated()) {
      alert("Please log in to add services to your cart!");
      return false;
    }

    try {
      // Update local state first for immediate UI feedback
      const serviceItem = {
        id: `service-${serviceId}-${Date.now()}`,
        itemType: 'SERVICE',
        serviceId,
        serviceName: `Service ${serviceId}`, // Temporary name, should be fetched from server
        rentalPeriod: parseInt(rentalPeriod) || 1,
        rentalPeriodType,
        unitPrice: parseFloat(unitPrice) || 0,
        totalPrice: (parseFloat(unitPrice) || 0) * (parseInt(rentalPeriod) || 1)
      };
      
      dispatch({ type: "ADD_SERVICE", payload: serviceItem });
      
      // Then sync with backend
      await cartService.addServiceToCart(serviceId, rentalPeriod, rentalPeriodType, unitPrice);
      
      console.log(`Added service ${serviceId} to cart`);
      return true;
    } catch (error) {
      console.error("Failed to add service to cart:", error);
      // Optionally revert the local change if backend fails
      return false;
    }
  };

  const removeServiceFromCart = async (serviceId) => {
    if (!isAuthenticated()) {
      alert("Please log in to manage your cart!");
      return false;
    }

    try {
      // Update local state first
      dispatch({ type: "REMOVE_SERVICE", payload: serviceId });
      
      // Then sync with backend
      await cartService.removeServiceFromCart(serviceId);
      
      console.log(`Removed service ${serviceId} from cart`);
      return true;
    } catch (error) {
      console.error("Failed to remove service from cart:", error);
      return false;
    }
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
        addServiceToCart,
        removeServiceFromCart,
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