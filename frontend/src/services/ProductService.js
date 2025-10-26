import { api } from './api';

export const productService = {
  // Get all products (matches backend endpoint)
  getProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get a single product by ID (matches backend endpoint)
  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Create a new product (matches backend endpoint)
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Create product with file upload
  createProductWithImage: async (productData, imageFile = null) => {
    try {
      const formData = new FormData();
      
      // Append all product fields
      formData.append('productName', productData.productName);
      formData.append('productDescription', productData.productDescription || '');
      formData.append('laptopSpec', productData.laptopSpec || '');
      formData.append('quantity', productData.quantity || 0);
      formData.append('isAvailable', productData.isAvailable || false);
      formData.append('price', productData.price || 0);
      formData.append('brand', productData.brand || '');
      formData.append('imageUrls', productData.imageUrls || '');
      
      if (productData.category?.categoryId) {
        formData.append('categoryId', productData.category.categoryId);
      } else if (productData.categoryId) {
        formData.append('categoryId', productData.categoryId);
      }
      
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const response = await api.post('/products/with-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product with image:', error);
      throw error;
    }
  },

  // Update an existing product (matches backend endpoint)
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Delete a product (matches backend endpoint)
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  // Get product image
  getProductImage: async (id) => {
    try {
      const response = await api.get(`/products/${id}/image`, {
        responseType: 'blob'
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error(`Error fetching product image ${id}:`, error);
      return null;
    }
  },

  // Legacy methods for compatibility
  getAllProducts: async () => {
    return productService.getProducts();
  },

  getProductById: async (id) => {
    return productService.getProduct(id);
  }
};

export default productService;
