import React, { useState, useEffect } from 'react';
import { customerAPI } from '../../services/customerAPI';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate, formatTime } from '../../utils/dateUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import StatusBadge from '../common/StatusBadge';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    const { getUserId } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        loadBookings();
    }, []);

    // ✅ FIXED: Remove filterBookings from dependencies
    useEffect(() => {
        if (statusFilter === 'ALL') {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(bookings.filter(b => b.status === statusFilter));
        }
    }, [bookings, statusFilter]); // ✅ Only these dependencies

    const loadBookings = async () => {
        try {
            setLoading(true);
            const response = await customerAPI.getMyBookings(getUserId());
            setBookings(response.data);
        } catch (err) {
            setError('Failed to load your bookings');
        } finally {
            setLoading(false);
        }
    };

    // ✅ You can actually REMOVE this entire function now since we moved the logic to useEffect
    // const filterBookings = () => {
    //     if (statusFilter === 'ALL') {
    //         setFilteredBookings(bookings);
    //     } else {
    //         setFilteredBookings(bookings.filter(b => b.status === statusFilter));
    //     }
    // };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await customerAPI.cancelMyBooking(bookingId);
            alert('✅ Booking cancelled successfully!');
            loadBookings();
        } catch (err) {
            setError('Failed to cancel booking');
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading your bookings..." />;
    }

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">📋 My Bookings</h3>
                </div>
                <div className="card-body">
                    {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

                    {/* Filter Buttons */}
                    <div className="mb-4">
                        <div className="btn-group" role="group">
                            <button 
                                className={`btn ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setStatusFilter('ALL')}
                            >
                                All ({bookings.length})
                            </button>
                            <button 
                                className={`btn ${statusFilter === 'PENDING' ? 'btn-warning' : 'btn-outline-warning'}`}
                                onClick={() => setStatusFilter('PENDING')}
                            >
                                Pending
                            </button>
                            <button 
                                className={`btn ${statusFilter === 'CONFIRMED' ? 'btn-success' : 'btn-outline-success'}`}
                                onClick={() => setStatusFilter('CONFIRMED')}
                            >
                                Confirmed
                            </button>
                            <button 
                                className={`btn ${statusFilter === 'COMPLETED' ? 'btn-info' : 'btn-outline-info'}`}
                                onClick={() => setStatusFilter('COMPLETED')}
                            >
                                Completed
                            </button>
                        </div>
                    </div>

                    {/* Bookings List */}
                    {filteredBookings.length === 0 ? (
                        <div className="alert alert-info">
                            <h5>📭 No bookings found</h5>
                            <p>You don't have any {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} bookings yet.</p>
                            <p>Go to "Book Service" tab to create your first booking!</p>
                        </div>
                    ) : (
                        <div className="row">
                            {filteredBookings.map(booking => (
                                <div key={booking.id} className="col-md-6 mb-3">
                                    <div className="card booking-card">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="card-title mb-0">
                                                    {booking.service?.serviceName || 'Service'}
                                                </h5>
                                                <StatusBadge status={booking.status} />
                                            </div>
                                            
                                            <div className="booking-details">
                                                <p className="mb-1">
                                                    <strong>📅 Date:</strong> {formatDate(booking.appointmentDate)}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>🕐 Time:</strong> {formatTime(booking.appointmentTime)}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>💵 Price:</strong> ${booking.service?.price}
                                                </p>
                                                {booking.notes && (
                                                    <p className="mb-1">
                                                        <strong>📝 Notes:</strong> {booking.notes}
                                                    </p>
                                                )}
                                            </div>

                                            {booking.status === 'PENDING' && (
                                                <button 
                                                    className="btn btn-danger btn-sm mt-3 w-100"
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                >
                                                    ❌ Cancel Booking
                                                </button>
                                            )}
                                            
                                            {booking.status === 'CONFIRMED' && (
                                                <div className="alert alert-success mt-3 mb-0">
                                                    ✅ Your booking is confirmed!
                                                </div>
                                            )}
                                            {booking.status === 'COMPLETED' && (
                                                <div className="alert alert-info mt-3 mb-0">
                                                    ✔️ Service completed
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;