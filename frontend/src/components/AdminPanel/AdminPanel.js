import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import { APPOINTMENT_STATUS } from '../../constants/apiConfig';
import { formatDate, formatTime } from '../../utils/dateUtils';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import StatusBadge from '../common/StatusBadge';
import './AdminPanel.css';

const AdminPanel = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadAppointments();
    }, []);

    useEffect(() => {
        filterAppointments();
    }, [appointments, statusFilter, searchTerm]);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllAppointments();
            setAppointments(response.data);
        } catch (err) {
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const filterAppointments = () => {
        let filtered = appointments;

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(a => a.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(a => 
                a.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.service?.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredAppointments(filtered);
    };

    const handleStatusChange = async (appointmentId, newStatus) => {
        try {
            await adminAPI.updateAppointmentStatus(appointmentId, newStatus);
            alert('Status updated successfully!');
            loadAppointments();
        } catch (err) {
            setError('Failed to update status');
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) {
            return;
        }

        try {
            await adminAPI.deleteAppointment(appointmentId);
            alert('Appointment deleted successfully!');
            loadAppointments();
        } catch (err) {
            setError('Failed to delete appointment');
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading appointments..." />;
    }

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">📊 Manage All Bookings</h3>
                </div>
                <div className="card-body">
                    {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="🔍 Search by name, email, or service..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Status ({appointments.length})</option>
                                <option value={APPOINTMENT_STATUS.PENDING}>Pending</option>
                                <option value={APPOINTMENT_STATUS.CONFIRMED}>Confirmed</option>
                                <option value={APPOINTMENT_STATUS.COMPLETED}>Completed</option>
                                <option value={APPOINTMENT_STATUS.CANCELLED}>Cancelled</option>
                                <option value={APPOINTMENT_STATUS.NO_SHOW}>No Show</option>
                            </select>
                        </div>
                    </div>

                    {filteredAppointments.length === 0 ? (
                        <div className="alert alert-info">
                            No appointments found matching your criteria.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Service</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAppointments.map(appointment => (
                                        <tr key={appointment.id}>
                                            <td>{appointment.id}</td>
                                            <td>
                                                <strong>{appointment.customerName}</strong><br/>
                                                <small className="text-muted">{appointment.customerEmail}</small><br/>
                                                <small className="text-muted">{appointment.customerPhone}</small>
                                            </td>
                                            <td>
                                                {appointment.service?.serviceName}<br/>
                                                <small className="text-muted">${appointment.service?.price}</small>
                                            </td>
                                            <td>
                                                📅 {formatDate(appointment.appointmentDate)}<br/>
                                                🕐 {formatTime(appointment.appointmentTime)}
                                            </td>
                                            <td>
                                                <StatusBadge status={appointment.status} />
                                            </td>
                                            <td>
                                                <select
                                                    className="form-select form-select-sm mb-2"
                                                    value={appointment.status}
                                                    onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                                                >
                                                    <option value={APPOINTMENT_STATUS.PENDING}>Pending</option>
                                                    <option value={APPOINTMENT_STATUS.CONFIRMED}>Confirmed</option>
                                                    <option value={APPOINTMENT_STATUS.COMPLETED}>Completed</option>
                                                    <option value={APPOINTMENT_STATUS.CANCELLED}>Cancelled</option>
                                                    <option value={APPOINTMENT_STATUS.NO_SHOW}>No Show</option>
                                                </select>
                                                <button 
                                                    className="btn btn-danger btn-sm w-100"
                                                    onClick={() => handleDeleteAppointment(appointment.id)}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;