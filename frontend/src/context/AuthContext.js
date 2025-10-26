import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken, setToken, removeToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode JWT token to extract user information
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          // Decode token to get user info
          const decodedToken = decodeToken(token);
          if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
            // Token is valid and not expired
            setUser({
              id: decodedToken.userId,
              username: decodedToken.sub,
              role: decodedToken.role,
              exp: decodedToken.exp
            });
          } else {
            // Token expired
            logout();
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const token = response.data;
      
      setToken(token);
      
      // Decode token to get user info
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setUser({
          id: decodedToken.userId,
          username: decodedToken.sub,
          role: decodedToken.role,
          exp: decodedToken.exp
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, message: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && user.exp * 1000 > Date.now();
  };

  const isAdmin = () => {
    return isAuthenticated() && user?.role === 'ADMIN';
  };

  const isUser = () => {
    return isAuthenticated() && user?.role === 'USER';
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    isUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};