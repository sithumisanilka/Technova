import React, { useState, useEffect } from 'react';
import { serviceService } from '../services/serviceService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Services.css';

// Component to handle service images with proper error handling
const ServiceImage = ({ serviceId, serviceName }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // First try to load the image to check if it exists
        const response = await fetch(`http://localhost:8081/api/services/${serviceId}/image`);
        if (response.ok) {
          setImageSrc(`http://localhost:8081/api/services/${serviceId}/image`);
        } else {
          setHasError(true);
        }
      } catch (error) {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      loadImage();
    } else {
      setLoading(false);
      setHasError(true);
    }
  }, [serviceId]);

  if (loading) {
    return <div className="service-image-placeholder">⏳</div>;
  }

  if (hasError || !imageSrc) {
    return <div className="service-image-placeholder">🛠️</div>;
  }

  return (
    <img 
      src={imageSrc} 
      alt={serviceName}
      onError={() => setHasError(true)}
    />
  );
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const { addServiceToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getAvailableServices();
      setServices(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(service => service.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const data = await serviceService.searchServices(searchTerm);
        setServices(data);
      } catch (error) {
        console.error('Error searching services:', error);
      } finally {
        setLoading(false);
      }
    } else {
      loadServices();
    }
  };

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    try {
      setLoading(true);
      let data;
      if (category === 'all') {
        data = await serviceService.getAvailableServices();
      } else {
        data = await serviceService.getServicesByCategory(category);
      }
      setServices(data);
    } catch (error) {
      console.error('Error filtering services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (service, rentalPeriod, periodType) => {
    if (!isAuthenticated()) {
      alert('Please log in to add services to your cart!');
      return;
    }

    try {
      // Validate rental period
      const validRentalPeriod = parseInt(rentalPeriod);
      if (!validRentalPeriod || validRentalPeriod <= 0) {
        alert('Please enter a valid rental period.');
        return;
      }

      // Calculate unitPrice with proper null checks
      let unitPrice;
      if (periodType === 'HOURLY') {
        unitPrice = service.pricePerHour;
        if (!unitPrice || unitPrice <= 0) {
          alert('Hourly pricing is not available for this service. Please select daily rental.');
          return;
        }
      } else {
        unitPrice = service.pricePerDay;
        if (!unitPrice || unitPrice <= 0) {
          alert('Invalid pricing for this service.');
          return;
        }
      }

      // Ensure unitPrice is a number
      unitPrice = parseFloat(unitPrice);

      await addServiceToCart(service.serviceId, validRentalPeriod, periodType, unitPrice);
      alert(`${service.serviceName} added to cart for ${validRentalPeriod} ${periodType.toLowerCase()}(s)!`);
    } catch (error) {
      console.error('Error adding service to cart:', error);
      alert('Failed to add service to cart. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Rent professional services for your business needs</p>
      </div>

      <div className="services-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="category-filters">
          <button 
            className={selectedCategory === 'all' ? 'active' : ''}
            onClick={() => handleCategoryFilter('all')}
          >
            All Services
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={selectedCategory === category ? 'active' : ''}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="services-grid">
        {services.length === 0 ? (
          <div className="no-services">No services found</div>
        ) : (
          services.map(service => (
            <ServiceCard 
              key={service.serviceId} 
              service={service} 
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>
    </div>
  );
};

const ServiceCard = ({ service, onAddToCart }) => {
  const [rentalPeriod, setRentalPeriod] = useState(service.minRentalPeriod || 1);
  const [periodType, setPeriodType] = useState('DAILY');

  const calculateTotal = () => {
    const unitPrice = periodType === 'HOURLY' ? service.pricePerHour : service.pricePerDay;
    return (unitPrice * rentalPeriod).toFixed(2);
  };

  return (
    <div className="service-card">
      <div className="service-image">
        <ServiceImage serviceId={service.serviceId} serviceName={service.serviceName} />
      </div>
      
      <div className="service-details">
        <h3>{service.serviceName}</h3>
        <p className="service-description">{service.description}</p>
        
        {service.category && (
          <span className="service-category">{service.category}</span>
        )}

        <div className="pricing">
          <div className="price-info">
            {service.pricePerHour && (
              <span>₹{service.pricePerHour}/hour</span>
            )}
            <span>₹{service.pricePerDay}/day</span>
          </div>
        </div>

        <div className="rental-options">
          <div className="rental-period">
            <label>Rental Period:</label>
            <input
              type="number"
              min={service.minRentalPeriod || 1}
              max={service.maxRentalPeriod || 720}
              value={rentalPeriod}
              onChange={(e) => setRentalPeriod(parseInt(e.target.value))}
            />
          </div>

          <div className="period-type">
            <label>Period Type:</label>
            <select 
              value={periodType} 
              onChange={(e) => setPeriodType(e.target.value)}
            >
              {service.pricePerHour && <option value="HOURLY">Hours</option>}
              <option value="DAILY">Days</option>
            </select>
          </div>
        </div>

        <div className="total-price">
          <strong>Total: ₹{calculateTotal()}</strong>
        </div>

        <button 
          className="add-to-cart-btn"
          onClick={() => onAddToCart(service, rentalPeriod, periodType)}
          disabled={!service.isAvailable}
        >
          {service.isAvailable ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default Services;