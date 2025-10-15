import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/appointmentAPI';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate, formatTime } from '../../utils/dateUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import StatusBadge from '../common/StatusBadge';
import './CalendarInterface.css';

const CalendarInterface = ({ role }) => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAppointments();
    }, [selectedDate, role]);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            let response;
            
            if (role === 'ADMIN') {
                response = await appointmentAPI.getAppointmentsByDate(selectedDate);
            } else {
                response = await appointmentAPI.getAppointmentsByUser(user?.id);
                response.data = response.data.filter(apt => apt.appointmentDate === selectedDate);
            }
            
            setAppointments(response.data);
        } catch (err) {
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">🗓️ Calendar View</h3>
                </div>
                <div className="card-body">
                    {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

                    <div className="mb-4">
                        <label className="form-label fw-bold">Select Date:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <LoadingSpinner message="Loading appointments..." />
                    ) : (
                        <>
                            <h5 className="mb-3">
                                Appointments for {formatDate(selectedDate)}
                                <span className="badge bg-primary ms-2">{appointments.length}</span>
                            </h5>

                            {appointments.length === 0 ? (
                                <div className="alert alert-info">
                                    No appointments scheduled for this date.
                                </div>
                            ) : (
                                <div className="row">
                                    {appointments.map(apt => (
                                        <div key={apt.id} className="col-md-6 col-lg-4 mb-3">
                                            <div className="card calendar-appointment-card">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <strong>🕐 {formatTime(apt.appointmentTime)}</strong>
                                                        <StatusBadge status={apt.status} />
                                                    </div>
                                                    <h6 className="mb-2">{apt.service?.serviceName}</h6>
                                                    {role === 'ADMIN' && (
                                                        <>
                                                            <p className="mb-0 small">👤 {apt.customerName}</p>
                                                            <p className="mb-0 small text-muted">{apt.customerEmail}</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarInterface;