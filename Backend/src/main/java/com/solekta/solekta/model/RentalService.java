package com.solekta.solekta.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "service")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@ToString
@EqualsAndHashCode
public class RentalService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    @Column(name = "service_name", nullable = false, length = 200)
    private String serviceName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price_per_day", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDay;

    @Column(name = "price_per_hour", precision = 10, scale = 2)
    private BigDecimal pricePerHour;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "is_available")
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(name = "min_rental_period")
    @Builder.Default
    private Integer minRentalPeriod = 1; // in hours

    @Column(name = "max_rental_period")
    @Builder.Default
    private Integer maxRentalPeriod = 720; // in hours (30 days)

    // Service Image Storage (as binary data)
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @Column(length = 255)
    private String imageFileName;

    @Column(length = 100)
    private String imageContentType;

    // Helper method to get price (backward compatibility)
    public BigDecimal getPrice() {
        return pricePerDay;
    }

    public void setPrice(BigDecimal price) {
        this.pricePerDay = price;
    }

    public enum RentalPeriodType {
        HOURLY,
        DAILY
    }
}

