import { api } from './api';

export const productService = {
  // Get all products (matches backend endpoint)
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get a single product by ID (matches backend endpoint)
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create a new product (matches backend endpoint)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update an existing product (matches backend endpoint)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete a product (matches backend endpoint)
  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`);
  },

  // Additional methods that can be implemented later
  getFeaturedProducts: async () => {
    // For now, return all products. Can be enhanced when backend supports filtering
    const response = await api.get('/products');
    return response.data;
  },

  getPopularProducts: async () => {
    // For now, return all products. Can be enhanced when backend supports filtering
    const response = await api.get('/products');
    return response.data;
  },

  searchProducts: async (query) => {
    // For now, return all products. Can be enhanced when backend supports search
    const response = await api.get('/products');
    return response.data;
  },

  getProductsByCategory: async (categoryId) => {
    // For now, return all products. Can be enhanced when backend supports category filtering
    const response = await api.get('/products');
    return response.data;
  },

  getProductsByBrand: async (brand) => {
    // For now, return all products. Can be enhanced when backend supports brand filtering
    const response = await api.get('/products');
    return response.data;
  },

  updateProductStock: async (id, stock) => {
    // This would require updating the product with new stock
    const product = await api.get(`/products/${id}`);
    const updatedProduct = { ...product.data, quantity: stock };
    const response = await api.put(`/products/${id}`, updatedProduct);
    return response.data;
  },
};
