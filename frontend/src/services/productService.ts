import { api } from './api';
import { Product, ProductFilters, PaginatedResponse, PaginationParams } from '@/types';

export const productService = {
  // Get all products (matches backend endpoint)
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  // Get a single product by ID (matches backend endpoint)
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Create a new product (matches backend endpoint)
  createProduct: async (productData: Omit<Product, 'productId'>): Promise<Product> => {
    const response = await api.post<Product>('/products', productData);
    return response.data;
  },

  // Update an existing product (matches backend endpoint)
  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response.data;
  },

  // Delete a product (matches backend endpoint)
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Additional methods that can be implemented later
  getFeaturedProducts: async (): Promise<Product[]> => {
    // For now, return all products. Can be enhanced when backend supports filtering
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getPopularProducts: async (): Promise<Product[]> => {
    // For now, return all products. Can be enhanced when backend supports filtering
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    // For now, return all products. Can be enhanced when backend supports search
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    // For now, return all products. Can be enhanced when backend supports category filtering
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getProductsByBrand: async (brand: string): Promise<Product[]> => {
    // For now, return all products. Can be enhanced when backend supports brand filtering
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  updateProductStock: async (id: number, stock: number): Promise<Product> => {
    // This would require updating the product with new stock
    const product = await api.get<Product>(`/products/${id}`);
    const updatedProduct = { ...product.data, quantity: stock };
    const response = await api.put<Product>(`/products/${id}`, updatedProduct);
    return response.data;
  },
};