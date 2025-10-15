import { useState, useEffect } from 'react';
import { serviceAPI } from '../services/serviceAPI';

export const useServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadServices = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await serviceAPI.getAllServices();
            setServices(response.data);
        } catch (err) {
            setError(err.message || 'Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    return { services, loading, error, refreshServices: loadServices };
};
