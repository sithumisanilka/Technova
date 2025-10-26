import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api',
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

// Request interceptor for logging and auth
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log all requests for debugging
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // Log error responses
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      removeToken();
      // Redirect to login page if needed
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export { api, getToken, setToken, removeToken };