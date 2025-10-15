import { appointmentAPI } from './appointmentAPI';
import { serviceAPI } from './serviceAPI';

export const adminAPI = {
    getAllAppointments: () => appointmentAPI.getAllAppointments(),
    updateAppointmentStatus: (id, status) => appointmentAPI.updateAppointmentStatus(id, status),
    deleteAppointment: (id) => appointmentAPI.deleteAppointment(id),
    getAllServices: () => serviceAPI.getAllServices(),
    createService: (serviceData) => serviceAPI.createService(serviceData),
    updateService: (id, serviceData) => serviceAPI.updateService(id, serviceData),
    deleteService: (id) => serviceAPI.deleteService(id)
};