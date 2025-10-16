package com.solekta.solekta.repository;

import com.solekta.solekta.model.Appointment;
import com.solekta.solekta.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    // Find appointments by date
    List<Appointment> findByAppointmentDate(LocalDate date);

    // Find appointments by status
    List<Appointment> findByStatus(AppointmentStatus status);

    // Find appointments by user
    List<Appointment> findByUserId(Integer userId);

    // Check for scheduling conflicts
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date AND a.appointmentTime = :time AND a.status != 'CANCELLED'")
    List<Appointment> findConflictingAppointments(@Param("date") LocalDate date, @Param("time") LocalTime time);

    // Find appointments in date range
    List<Appointment> findByAppointmentDateBetween(LocalDate startDate, LocalDate endDate);

    // Find appointments by date and status
    List<Appointment> findByAppointmentDateAndStatus(LocalDate date, AppointmentStatus status);
}