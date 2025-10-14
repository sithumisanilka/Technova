import axios from 'axios';
import { toast } from '@/hooks/use-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getToken = () => {
  return localStorage.getItem('auth_token');
};

const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

const removeToken = () => {
  localStorage.removeItem('auth_token');
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - remove token and redirect to login
          removeToken();
          window.location.href = '/login';
          break;
        case 403:
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access this resource.',
            variant: 'destructive',
          });
          break;
        case 404:
          toast({
            title: 'Not Found',
            description: 'The requested resource was not found.',
            variant: 'destructive',
          });
          break;
        case 422:
          // Validation errors
          const errorData = data;
          if (errorData.errors) {
            Object.values(errorData.errors).flat().forEach((message) => {
              toast({
                title: 'Validation Error',
                description: message,
                variant: 'destructive',
              });
            });
          }
          break;
        case 500:
          toast({
            title: 'Server Error',
            description: 'An internal server error occurred. Please try again later.',
            variant: 'destructive',
          });
          break;
        default:
          toast({
            title: 'Error',
            description: 'An unexpected error occurred.',
            variant: 'destructive',
          });
      }
    } else if (error.code === 'ECONNABORTED') {
      toast({
        title: 'Timeout',
        description: 'Request timed out. Please check your connection.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Network Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
        variant: 'destructive',
      });
    }
    
    return Promise.reject(error);
  }
);

export { api, setToken, removeToken, getToken };
export default api;
