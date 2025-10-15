import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const ServiceDashboard = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    
    const [formData, setFormData] = useState({
        serviceName: '',
        description: '',
        duration: '',
        price: '',
        availableSlots: '',
        category: ''
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllServices();
            setServices(response.data);
        } catch (err) {
            setError('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingService) {
                await adminAPI.updateService(editingService.id, formData);
                alert('Service updated successfully!');
            } else {
                await adminAPI.createService(formData);
                alert('Service created successfully!');
            }
            
            resetForm();
            loadServices();
        } catch (err) {
            setError('Failed to save service');
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            serviceName: service.serviceName,
            description: service.description,
            duration: service.duration,
            price: service.price,
            availableSlots: service.availableSlots,
            category: service.category || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            await adminAPI.deleteService(serviceId);
            alert('Service deleted successfully!');
            loadServices();
        } catch (err) {
            setError('Failed to delete service');
        }
    };

    const resetForm = () => {
        setFormData({
            serviceName: '',
            description: '',
            duration: '',
            price: '',
            availableSlots: '',
            category: ''
        });
        setEditingService(null);
        setShowForm(false);
    };

    if (loading) {
        return <LoadingSpinner message="Loading services..." />;
    }

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">⚙️ Manage Services</h3>
                    <button 
                        className="btn btn-light"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '❌ Cancel' : '➕ Add Service'}
                    </button>
                </div>
                <div className="card-body">
                    {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

                    {showForm && (
                        <div className="card mb-4 bg-light">
                            <div className="card-body">
                                <h5>{editingService ? 'Edit Service' : 'Add New Service'}</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Service Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="serviceName"
                                                value={formData.serviceName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Category</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Description *</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Duration (minutes) *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Price ($) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Available Slots *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="availableSlots"
                                                value={formData.availableSlots}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-success me-2">
                                        {editingService ? '💾 Update Service' : '➕ Create Service'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="row">
                        {services.map(service => (
                            <div key={service.id} className="col-md-6 col-lg-4 mb-3">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{service.serviceName}</h5>
                                        {service.category && (
                                            <span className="badge bg-info mb-2">{service.category}</span>
                                        )}
                                        <p className="card-text">{service.description}</p>
                                        <ul className="list-unstyled">
                                            <li>⏱️ Duration: {service.duration} min</li>
                                            <li>💵 Price: ${service.price}</li>
                                            <li>📅 Slots: {service.availableSlots}</li>
                                        </ul>
                                        <div className="btn-group w-100">
                                            <button 
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleEdit(service)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(service.id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {services.length === 0 && (
                        <div className="alert alert-info">
                            No services found. Add your first service!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceDashboard;

