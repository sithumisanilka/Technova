import api from './api';

export const appointmentAPI = {
    getAllAppointments: () => api.get('/appointments'),
    getAppointmentById: (id) => api.get(`/appointments/${id}`),
    getAppointmentsByUser: (userId) => api.get(`/appointments/user/${userId}`),
    getAppointmentsByDate: (date) => api.get(`/appointments/date/${date}`),
    getAppointmentsByStatus: (status) => api.get(`/appointments/status/${status}`),
    createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
    updateAppointment: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
    updateAppointmentStatus: (id, status) => api.patch(`/appointments/${id}/status?status=${status}`),
    deleteAppointment: (id) => api.delete(`/appointments/${id}`)
};
