import api from './api';

export const serviceAPI = {
    getAllServices: () => api.get('/services'),
    getServiceById: (id) => api.get(`/services/${id}`),
    searchServices: (searchTerm) => api.get(`/services/search?name=${searchTerm}`),
    createService: (serviceData) => api.post('/services', serviceData),
    updateService: (id, serviceData) => api.put(`/services/${id}`, serviceData),
    deleteService: (id) => api.delete(`/services/${id}`)
};

