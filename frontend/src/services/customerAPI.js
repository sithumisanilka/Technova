import { appointmentAPI } from './appointmentAPI';

export const customerAPI = {
    getMyBookings: (userId) => appointmentAPI.getAppointmentsByUser(userId),
    createBooking: (bookingData) => appointmentAPI.createAppointment(bookingData),
    cancelMyBooking: (appointmentId) => appointmentAPI.deleteAppointment(appointmentId),
    getBookingDetails: (appointmentId) => appointmentAPI.getAppointmentById(appointmentId)
};