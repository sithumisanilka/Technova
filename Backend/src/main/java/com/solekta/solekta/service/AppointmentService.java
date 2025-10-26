package com.solekta.solekta.service;

import com.solekta.solekta.model.Appointment;
import com.solekta.solekta.enums.AppointmentStatus;
import com.solekta.solekta.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ServiceService serviceService;

    // CREATE - Book new appointment
    public Appointment createAppointment(Appointment appointment) throws RuntimeException {
        // Validate service exists
        if (!serviceService.serviceExists(appointment.getServiceId())) {
            throw new RuntimeException("Service not found with id: " + appointment.getServiceId());
        }

        // Check for scheduling conflicts
        List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Time slot already booked. Please select another time.");
        }

        return appointmentRepository.save(appointment);
    }

    // READ - Get all appointments
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // READ - Get appointment by ID
    public Optional<Appointment> getAppointmentById(Integer id) {
        return appointmentRepository.findById(id);
    }

    // READ - Get appointments by date
    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    // READ - Get appointments by status
    public List<Appointment> getAppointmentsByStatus(AppointmentStatus status) {
        return appointmentRepository.findByStatus(status);
    }

    // READ - Get user's appointments
    public List<Appointment> getUserAppointments(Integer userId) {
        return appointmentRepository.findByUserId(userId);
    }

    // UPDATE - Update appointment
    public Appointment updateAppointment(Integer id, Appointment updatedAppointment) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    // Check conflicts if date/time changed
                    if (!appointment.getAppointmentDate().equals(updatedAppointment.getAppointmentDate()) ||
                            !appointment.getAppointmentTime().equals(updatedAppointment.getAppointmentTime())) {

                        List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
                                updatedAppointment.getAppointmentDate(),
                                updatedAppointment.getAppointmentTime()
                        );

                        if (!conflicts.isEmpty() && !conflicts.get(0).getAppointmentId().equals(id)) {
                            throw new RuntimeException("Time slot already booked. Please select another time.");
                        }
                    }

                    // Update all fields using your Appointment's setter methods
                    appointment.setServiceId(updatedAppointment.getServiceId());
                    appointment.setUserId(updatedAppointment.getUserId());
                    appointment.setCustomerName(updatedAppointment.getCustomerName());
                    appointment.setContactInfo(updatedAppointment.getContactInfo());
                    appointment.setDevice(updatedAppointment.getDevice());
                    appointment.setIssueDescription(updatedAppointment.getIssueDescription());
                    appointment.setAppointmentDate(updatedAppointment.getAppointmentDate());
                    appointment.setAppointmentTime(updatedAppointment.getAppointmentTime());
                    appointment.setStatus(updatedAppointment.getStatus());

                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    // UPDATE - Change appointment status only
    public Appointment updateAppointmentStatus(Integer id, AppointmentStatus status) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setStatus(status);
                    return appointmentRepository.save(appointment);
                })
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    // DELETE - Cancel/Delete appointment
    public void deleteAppointment(Integer id) {
        appointmentRepository.deleteById(id);
    }

    // UTILITY - Check availability
    public boolean isTimeSlotAvailable(LocalDate date, LocalTime time) {
        List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(date, time);
        return conflicts.isEmpty();
    }

    // UTILITY - Get pending appointments
    public List<Appointment> getPendingAppointments() {
        return appointmentRepository.findByStatus(AppointmentStatus.PENDING);
    }

    // UTILITY - Get confirmed appointments
    public List<Appointment> getConfirmedAppointments() {
        return appointmentRepository.findByStatus(AppointmentStatus.CONFIRMED);
    }

    // UTILITY - Get completed appointments
    public List<Appointment> getCompletedAppointments() {
        return appointmentRepository.findByStatus(AppointmentStatus.COMPLETED);
    }

    // UTILITY - Get cancelled appointments (for owner to clean up)
    public List<Appointment> getCancelledAppointments() {
        return appointmentRepository.findByStatus(AppointmentStatus.CANCELLED);
    }
}