import React, { useState, useEffect } from 'react';
import productService from '../../services/ProductService';
import { categoryService } from '../../services/categoryService';
import { IMAGE_UPLOAD_CONFIG, validateImageFile } from '../../config/imageUpload';

// Component to handle product image thumbnails
const ProductImageThumbnail = ({ productId, productName }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const imageUrl = await productService.getProductImage(productId);
        setImageSrc(imageUrl);
      } catch (error) {
        console.log('No image found for product:', productId);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadImage();
    } else {
      setLoading(false);
    }
  }, [productId]);

  // Cleanup effect for revoking blob URLs
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  if (loading) {
    return <div className="image-placeholder">⏳</div>;
  }

  if (!imageSrc) {
    return <div className="image-placeholder">📱</div>;
  }

  return (
    <img 
      src={imageSrc} 
      alt={productName}
      className="product-thumbnail"
      onError={() => setImageSrc(null)}
    />
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    price: '',
    quantity: '',
    brand: '',
    laptopSpec: '',
    imageUrls: '',
    categoryId: '',
    isAvailable: true
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback to extracting from products if category service fails
      try {
        const products = await productService.getProducts();
        const uniqueCategories = [...new Set(products.map(p => p.categoryName || p.category?.categoryName).filter(Boolean))];
        setCategories(uniqueCategories.map(name => ({ categoryId: name, categoryName: name })));
      } catch (fallbackErr) {
        console.error('Error fetching categories fallback:', fallbackErr);
      }
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        setProducts(products.filter(p => p.productId !== productId));
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName || '',
      productDescription: product.productDescription || '',
      price: product.price || '',
      quantity: product.quantity || '',
      brand: product.brand || '',
      laptopSpec: product.laptopSpec || '',
      imageUrls: product.imageUrls || '',
      categoryId: product.categoryId || product.category?.categoryId || '',
      isAvailable: product.isAvailable ?? true
    });
    setShowProductForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      productName: '',
      productDescription: '',
      price: '',
      quantity: '',
      brand: '',
      laptopSpec: '',
      imageUrls: '',
      categoryId: '',
      isAvailable: true
    });
    setSelectedImages([]);
    setImagePreview([]);
    setShowProductForm(true);
  };

  // Image compression function
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files using the config
    const validFiles = [];
    const allErrors = [];
    
    files.forEach(file => {
      const errors = validateImageFile(file);
      if (errors.length > 0) {
        allErrors.push(...errors);
      } else {
        validFiles.push(file);
      }
    });
    
    if (allErrors.length > 0) {
      alert('Image Upload Errors:\n' + allErrors.join('\n'));
    }
    
    try {
      // Compress images that are larger than 2MB
      const processedFiles = await Promise.all(
        validFiles.map(async (file) => {
          if (file.size > 2 * 1024 * 1024) { // 2MB
            console.log(`Compressing large image: ${file.name}`);
            const compressed = await compressImage(file);
            console.log(`Image compressed: ${file.size} → ${compressed.size} bytes`);
            // Preserve original file name
            return new File([compressed], file.name, { type: compressed.type });
          }
          return file;
        })
      );
      
      setSelectedImages(processedFiles);
      
      // Create preview URLs for processed files
      const previews = processedFiles.map(file => URL.createObjectURL(file));
      setImagePreview(previews);
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Failed to process images. Please try again.');
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    // Clean up the URL object to prevent memory leaks
    URL.revokeObjectURL(imagePreview[index]);
    
    setSelectedImages(newImages);
    setImagePreview(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        imageUrls: formData.imageUrls || ''
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.productId, productData);
      } else {
        // Use the multipart upload for new products with images
        if (selectedImages.length > 0) {
          await productService.createProductWithImage(productData, selectedImages[0]);
        } else {
          await productService.createProduct(productData);
        }
      }

      setShowProductForm(false);
      setSelectedImages([]);
      setImagePreview([]);
      fetchProducts();
    } catch (err) {
      setError(`Failed to ${editingProduct ? 'update' : 'create'} product`);
      console.error('Error saving product:', err);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || 
      (product.categoryId && product.categoryId === parseInt(filterCategory)) ||
      (product.categoryName === filterCategory);

    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h3>📱 Product Management</h3>
        <button onClick={handleAdd} className="btn-primary">
          ➕ Add Product
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Filter by Category:</label>
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group search-box">
          <label>Search Products:</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Search by name, brand, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Brand</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.productId}>
                <td>
                  <div className="product-info">
                    <div className="product-image-container">
                      <ProductImageThumbnail productId={product.productId} productName={product.productName} />
                    </div>
                    <div>
                      <strong>{product.productName}</strong>
                      {product.productDescription && (
                        <div className="product-description">
                          {product.productDescription.length > 100 
                            ? product.productDescription.substring(0, 100) + '...'
                            : product.productDescription
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>{product.categoryName || product.category?.categoryName || 'Uncategorized'}</td>
                <td><strong>{formatPrice(product.price)}</strong></td>
                <td>
                  <span className={`stock-badge ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.quantity} units
                  </span>
                </td>
                <td>{product.brand || 'N/A'}</td>
                <td>
                  <span className={`availability-badge ${product.isAvailable ? 'available' : 'unavailable'}`}>
                    {product.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                    <button 
                      onClick={() => handleEdit(product)}
                      className="btn-secondary btn-small"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.productId)}
                      className="btn-danger btn-small"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
            {searchTerm || filterCategory ? 'No products match your search criteria.' : 'No products found.'}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="modal-overlay" onClick={() => {
          imagePreview.forEach(url => URL.revokeObjectURL(url));
          setShowProductForm(false);
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button 
                className="close-btn" 
                onClick={() => {
                  imagePreview.forEach(url => URL.revokeObjectURL(url));
                  setShowProductForm(false);
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.productDescription}
                  onChange={(e) => setFormData({...formData, productDescription: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Specifications</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Intel Core i7, 16GB RAM, 512GB SSD"
                  value={formData.laptopSpec}
                  onChange={(e) => setFormData({...formData, laptopSpec: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Product Images</label>
                <input
                  type="file"
                  className="form-control"
                  accept={IMAGE_UPLOAD_CONFIG.ALLOWED_MIME_TYPES_STRING}
                  onChange={handleImageChange}
                />
                <small className="form-text">
                  <strong>📋 Upload Requirements:</strong><br/>
                  • <strong>Max Size:</strong> {IMAGE_UPLOAD_CONFIG.MAX_SIZE_DISPLAY} per image<br/>
                  • <strong>Formats:</strong> {IMAGE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(', ').toUpperCase()}<br/>
                  • <strong>Storage:</strong> {IMAGE_UPLOAD_CONFIG.STORAGE_TYPE}<br/>
                  • <strong>Limit:</strong> {IMAGE_UPLOAD_CONFIG.MAX_DATABASE_SIZE}
                </small>
                
                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div className="image-preview-container">
                    <label>Image Previews:</label>
                    <div className="image-preview-grid">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="image-preview-item">
                          <img src={preview} alt={`Preview ${index + 1}`} className="preview-image" />
                          <button 
                            type="button" 
                            className="remove-image-btn"
                            onClick={() => removeImage(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Or Image URLs (Legacy)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Separate multiple URLs with commas"
                  value={formData.imageUrls}
                  onChange={(e) => setFormData({...formData, imageUrls: e.target.value})}
                />
                <small className="form-text">Use this if you have existing image URLs</small>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                  />
                  {' '}Available for sale
                </label>
              </div>

              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                <button type="submit" className="btn-primary">
                  {editingProduct ? '💾 Update Product' : '➕ Create Product'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    imagePreview.forEach(url => URL.revokeObjectURL(url));
                    setShowProductForm(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;