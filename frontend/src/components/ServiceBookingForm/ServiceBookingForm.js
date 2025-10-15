import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../../services/serviceAPI';
import { appointmentAPI } from '../../services/appointmentAPI';
import { validateBookingForm } from '../../utils/validators';
import { getMinDate } from '../../utils/dateUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { useAuth } from '../../contexts/AuthContext';
import './ServiceBookingForm.css';

const ServiceBookingForm = () => {
    const { user, getUserId } = useAuth(); // ✅ Get userId
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        serviceId: '',
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: user?.phone || '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
    });
    
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            const response = await serviceAPI.getAllServices();
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
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const validation = validateBookingForm(formData);
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            return;
        }

        try {
            setLoading(true);
            
            // ✅ Create appointment with userId
            await appointmentAPI.createAppointment({
                ...formData,
                userId: getUserId(), // ✅ Use userId from auth
                status: 'PENDING'
            });
            
            // ✅ Show success message
            setSuccess(true);
            
            // ✅ Clear form inputs (keep user info)
            setFormData({
                serviceId: '',
                customerName: user?.name || '',
                customerEmail: user?.email || '',
                customerPhone: user?.phone || '',
                appointmentDate: '',
                appointmentTime: '',
                notes: ''
            });
            
            // ✅ Auto-hide success message after 5 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
            
            // ✅ Booking is now automatically in dashboard
            // Customer can switch to "My Bookings" tab to see it
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    if (loading && services.length === 0) {
        return <LoadingSpinner message="Loading services..." />;
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">📅 Book a Service</h3>
                        </div>
                        <div className="card-body">
                            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
                            
                            {/* ✅ Success Message */}
                            {success && (
                                <div className="alert alert-success alert-dismissible fade show">
                                    <strong>✅ Success!</strong> Your booking has been created successfully! 
                                    <br/>
                                    <small>Go to "My Bookings" tab to view your appointment.</small>
                                    <button type="button" className="btn-close" onClick={() => setSuccess(false)}></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Select Service *</label>
                                    <select
                                        className={`form-select ${formErrors.serviceId ? 'is-invalid' : ''}`}
                                        name="serviceId"
                                        value={formData.serviceId}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Choose a service...</option>
                                        {services.map(service => (
                                            <option key={service.id} value={service.id}>
                                                {service.serviceName} - ${service.price} ({service.duration} min)
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.serviceId && <div className="invalid-feedback">{formErrors.serviceId}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Full Name *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${formErrors.customerName ? 'is-invalid' : ''}`}
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                    />
                                    {formErrors.customerName && <div className="invalid-feedback">{formErrors.customerName}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className={`form-control ${formErrors.customerEmail ? 'is-invalid' : ''}`}
                                        name="customerEmail"
                                        value={formData.customerEmail}
                                        onChange={handleInputChange}
                                        placeholder="your.email@example.com"
                                    />
                                    {formErrors.customerEmail && <div className="invalid-feedback">{formErrors.customerEmail}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Phone Number *</label>
                                    <input
                                        type="tel"
                                        className={`form-control ${formErrors.customerPhone ? 'is-invalid' : ''}`}
                                        name="customerPhone"
                                        value={formData.customerPhone}
                                        onChange={handleInputChange}
                                        placeholder="1234567890"
                                    />
                                    {formErrors.customerPhone && <div className="invalid-feedback">{formErrors.customerPhone}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Appointment Date *</label>
                                    <input
                                        type="date"
                                        className={`form-control ${formErrors.appointmentDate ? 'is-invalid' : ''}`}
                                        name="appointmentDate"
                                        value={formData.appointmentDate}
                                        onChange={handleInputChange}
                                        min={getMinDate()}
                                    />
                                    {formErrors.appointmentDate && <div className="invalid-feedback">{formErrors.appointmentDate}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Appointment Time *</label>
                                    <input
                                        type="time"
                                        className={`form-control ${formErrors.appointmentTime ? 'is-invalid' : ''}`}
                                        name="appointmentTime"
                                        value={formData.appointmentTime}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.appointmentTime && <div className="invalid-feedback">{formErrors.appointmentTime}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Additional Notes (Optional)</label>
                                    <textarea
                                        className="form-control"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Any special requests or notes..."
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? 'Booking...' : '📅 Book Appointment'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceBookingForm;

