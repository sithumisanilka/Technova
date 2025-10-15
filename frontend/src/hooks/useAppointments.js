import { useState, useEffect } from 'react';
import { appointmentAPI } from '../services/appointmentAPI';

export const useAppointments = (userId = null) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = userId 
                ? await appointmentAPI.getAppointmentsByUser(userId)
                : await appointmentAPI.getAllAppointments();
            setAppointments(response.data);
        } catch (err) {
            setError(err.message || 'Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, [userId]);

    return { appointments, loading, error, refreshAppointments: loadAppointments };
};