import React, { useState, useEffect } from 'react';
import { serviceService } from '../../services/serviceService';
import { IMAGE_UPLOAD_CONFIG, validateImageFile } from '../../config/imageUpload';

// Component to handle service image thumbnails
const ServiceImageThumbnail = ({ serviceId, serviceName }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const imageUrl = await serviceService.getServiceImage(serviceId);
        setImageSrc(imageUrl);
      } catch (error) {
        console.log('No image found for service:', serviceId);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      loadImage();
    } else {
      setLoading(false);
    }
  }, [serviceId]);

  // Cleanup effect for revoking blob URLs
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  if (loading) {
    return (
      <div 
        className="image-placeholder"
        style={{
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #ddd',
          fontSize: '24px'
        }}
      >
        ⏳
      </div>
    );
  }

  if (!imageSrc) {
    return (
      <div 
        className="image-placeholder"
        style={{
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #ddd',
          fontSize: '24px'
        }}
      >
        🛠️
      </div>
    );
  }

  return (
    <img 
      src={imageSrc} 
      alt={serviceName}
      className="service-thumbnail"
      style={{
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}
      onError={() => setImageSrc(null)}
    />
  );
};

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    pricePerHour: '',
    pricePerDay: '',
    category: '',
    isAvailable: true,
    minRentalPeriod: '1',
    maxRentalPeriod: '720'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const categories = ['Equipment Rental', 'Vehicle Rental', 'Property Rental', 'Service Rental', 'Other'];
  const availabilityOptions = [
    { value: '', label: 'All Services' },
    { value: 'true', label: 'Available' },
    { value: 'false', label: 'Unavailable' }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getAllServices();
      setServices(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.deleteService(serviceId);
        setServices(services.filter(s => s.serviceId !== serviceId));
      } catch (err) {
        setError('Failed to delete service');
        console.error('Error deleting service:', err);
      }
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      serviceName: service.serviceName || '',
      description: service.description || '',
      pricePerHour: service.pricePerHour || '',
      pricePerDay: service.pricePerDay || '',
      category: service.category || '',
      isAvailable: service.isAvailable ?? true,
      minRentalPeriod: service.minRentalPeriod || '1',
      maxRentalPeriod: service.maxRentalPeriod || '720'
    });
    setShowServiceForm(true);
  };

  const handleAdd = () => {
    setEditingService(null);
    setFormData({
      serviceName: '',
      description: '',
      pricePerHour: '',
      pricePerDay: '',
      category: '',
      isAvailable: true,
      minRentalPeriod: '1',
      maxRentalPeriod: '720'
    });
    setSelectedImage(null);
    setImagePreview('');
    setShowServiceForm(true);
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
    const file = e.target.files[0];
    if (file) {
      // Validate file using the config
      const errors = validateImageFile(file);
      if (errors.length > 0) {
        alert('Image Upload Error:\n' + errors.join('\n'));
        e.target.value = ''; // Clear the input
        return;
      }
      
      try {
        // Compress image if it's larger than 2MB
        let processedFile = file;
        if (file.size > 2 * 1024 * 1024) { // 2MB
          console.log('Compressing large image...');
          processedFile = await compressImage(file);
          console.log(`Image compressed: ${file.size} → ${processedFile.size} bytes`);
        }
        
        setSelectedImage(processedFile);
        setImagePreview(URL.createObjectURL(processedFile));
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process image. Please try a different image.');
        e.target.value = '';
      }
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceData = {
        ...formData,
        pricePerHour: formData.pricePerHour ? parseFloat(formData.pricePerHour) : null,
        pricePerDay: formData.pricePerDay ? parseFloat(formData.pricePerDay) : null,
        minRentalPeriod: parseInt(formData.minRentalPeriod),
        maxRentalPeriod: parseInt(formData.maxRentalPeriod)
      };

      // If editing service, use existing endpoint
      if (editingService) {
        await serviceService.updateService(editingService.serviceId, serviceData);
      } else {
        // For new service, use the service with image upload
        if (selectedImage) {
          await serviceService.createServiceWithImage(serviceData, selectedImage);
        } else {
          await serviceService.createService(serviceData);
        }
      }

      setShowServiceForm(false);
      setSelectedImage(null);
      setImagePreview('');
      fetchServices();
    } catch (err) {
      setError(`Failed to ${editingService ? 'update' : 'create'} service`);
      console.error('Error saving service:', err);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = !searchTerm || 
      service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || 
      service.category === filterCategory;

    const matchesAvailability = filterAvailability === '' || 
      service.isAvailable.toString() === filterAvailability;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="management-container">
        <div className="loading-spinner"></div>
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h3>🛠️ Service Management</h3>
        <button onClick={handleAdd} className="btn-primary">
          ➕ Add Service
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
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Availability:</label>
          <select
            className="filter-select"
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
          >
            {availabilityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group search-box">
          <label>Search Services:</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Search by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="table-container">
        <table 
          className="admin-table"
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Service</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Pricing</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Rental Period</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map(service => (
              <tr 
                key={service.serviceId}
                style={{ 
                  borderBottom: '1px solid #dee2e6',
                  '&:hover': { backgroundColor: '#f8f9fa' }
                }}
              >
                <td style={{ padding: '12px' }}>
                  <div 
                    className="service-info"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      maxWidth: '300px'
                    }}
                  >
                    <div className="service-image-container">
                      <ServiceImageThumbnail serviceId={service.serviceId} serviceName={service.serviceName} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ display: 'block', marginBottom: '4px' }}>
                        {service.serviceName}
                      </strong>
                      {service.description && (
                        <div 
                          className="service-description"
                          style={{
                            fontSize: '0.9em',
                            color: '#666',
                            lineHeight: '1.3',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {service.description.length > 50 
                            ? service.description.substring(0, 50) + '...'
                            : service.description
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>{service.category || 'Uncategorized'}</td>
                <td style={{ padding: '12px' }}>
                  <div className="pricing-info">
                    {service.pricePerHour && (
                      <div><strong>{formatPrice(service.pricePerHour)}</strong>/hour</div>
                    )}
                    {service.pricePerDay && (
                      <div><strong>{formatPrice(service.pricePerDay)}</strong>/day</div>
                    )}
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div className="rental-period">
                    <div>Min: {service.minRentalPeriod} hours</div>
                    <div>Max: {service.maxRentalPeriod} hours</div>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <span 
                    className={`availability-badge ${service.isAvailable ? 'available' : 'unavailable'}`}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: service.isAvailable ? '#d4edda' : '#f8d7da',
                      color: service.isAvailable ? '#155724' : '#721c24',
                      border: `1px solid ${service.isAvailable ? '#c3e6cb' : '#f5c6cb'}`
                    }}
                  >
                    {service.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <div 
                    style={{
                      display: 'flex', 
                      gap: '8px', 
                      flexWrap: 'wrap',
                      minWidth: '140px'
                    }}
                  >
                    <button 
                      onClick={() => handleEdit(service)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(service.serviceId)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredServices.length === 0 && (
          <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
            {searchTerm || filterCategory || filterAvailability ? 'No services match your search criteria.' : 'No services found.'}
          </div>
        )}
      </div>

      {/* Service Form Modal */}
      {showServiceForm && (
        <div className="modal-overlay" onClick={() => {
          if (imagePreview) URL.revokeObjectURL(imagePreview);
          setShowServiceForm(false);
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <button 
                className="close-btn" 
                onClick={() => {
                  if (imagePreview) URL.revokeObjectURL(imagePreview);
                  setShowServiceForm(false);
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Service Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.serviceName}
                    onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Service Image</label>
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
                  • <strong>Storage:</strong> {IMAGE_UPLOAD_CONFIG.STORAGE_TYPE}
                </small>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="image-preview-container">
                    <label>Image Preview:</label>
                    <div className="single-image-preview">
                      <img src={imagePreview} alt="Service preview" className="preview-image-large" />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={removeImage}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price per Hour</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Price per Day</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Min Rental Period (hours) *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={formData.minRentalPeriod}
                    onChange={(e) => setFormData({...formData, minRentalPeriod: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max Rental Period (hours) *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={formData.maxRentalPeriod}
                    onChange={(e) => setFormData({...formData, maxRentalPeriod: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                  />
                  {' '}Available for rental
                </label>
              </div>

              <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                <button type="submit" className="btn-primary">
                  {editingService ? '💾 Update Service' : '➕ Create Service'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    if (imagePreview) URL.revokeObjectURL(imagePreview);
                    setShowServiceForm(false);
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

export default ServiceManagement;