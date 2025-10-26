package com.solekta.solekta.model;

import com.solekta.solekta.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity @Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
@Table(name = "Appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "contact_info", nullable = false, length = 100)
    private String contactInfo;

    @Column(name = "device", length = 100)
    private String device;

    @Column(name = "issue_description", columnDefinition = "TEXT")
    private String issueDescription;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointmentTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Utility methods
    public boolean isPending() {
        return AppointmentStatus.PENDING.equals(this.status);
    }

    public boolean isConfirmed() {
        return AppointmentStatus.CONFIRMED.equals(this.status);
    }

    public boolean isCompleted() {
        return AppointmentStatus.COMPLETED.equals(this.status);
    }

    public boolean isCancelled() {
        return AppointmentStatus.CANCELLED.equals(this.status);
    }

    // PrePersist and PreUpdate methods
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = AppointmentStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Appointment that = (Appointment) o;
        return Objects.equals(appointmentId, that.appointmentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(appointmentId);
    }

    // toString
    @Override
    public String toString() {
        return "Appointment{" +
                "appointmentId=" + appointmentId +
                ", customerName='" + customerName + '\'' +
                ", appointmentDate=" + appointmentDate +
                ", appointmentTime=" + appointmentTime +
                ", status=" + status +
                '}';
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Integer serviceId;
        private Integer userId;
        private String customerName;
        private String contactInfo;
        private String device;
        private String issueDescription;
        private LocalDate appointmentDate;
        private LocalTime appointmentTime;
        private AppointmentStatus status;

        public Builder serviceId(Integer serviceId) {
            this.serviceId = serviceId;
            return this;
        }

        public Builder userId(Integer userId) {
            this.userId = userId;
            return this;
        }

        public Builder customerName(String customerName) {
            this.customerName = customerName;
            return this;
        }

        public Builder contactInfo(String contactInfo) {
            this.contactInfo = contactInfo;
            return this;
        }

        public Builder device(String device) {
            this.device = device;
            return this;
        }

        public Builder issueDescription(String issueDescription) {
            this.issueDescription = issueDescription;
            return this;
        }

        public Builder appointmentDate(LocalDate appointmentDate) {
            this.appointmentDate = appointmentDate;
            return this;
        }

        public Builder appointmentTime(LocalTime appointmentTime) {
            this.appointmentTime = appointmentTime;
            return this;
        }

        public Builder status(AppointmentStatus status) {
            this.status = status;
            return this;
        }
    }
}












