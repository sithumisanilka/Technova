package com.solekta.solekta.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@ToString(exclude = "order")
@EqualsAndHashCode(exclude = "order")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    // Item type - PRODUCT or SERVICE
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ItemType itemType = ItemType.PRODUCT;

    // Product fields (used when itemType = PRODUCT)
    @Column(name = "product_id", nullable = true)
    private Long productId;

    @Column(name = "product_name", nullable = true)
    private String productName;

    @Column(name = "product_sku", nullable = true)
    private String productSku;

    @Column(name = "quantity", nullable = true)
    private Integer quantity;

    // Service fields (used when itemType = SERVICE)
    @Column(name = "service_id", nullable = true)
    private Long serviceId;

    @Column(name = "service_name", nullable = true)
    private String serviceName;

    @Column(name = "rental_period", nullable = true)
    private Integer rentalPeriod; // in hours

    @Enumerated(EnumType.STRING)
    @Column(name = "rental_period_type", nullable = true)
    private RentalService.RentalPeriodType rentalPeriodType;

    // Common fields
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    // Calculate total price and validate item type
    @PrePersist
    @PreUpdate
    public void processOrderItem() {
        // First validate item type and set dummy values
        if (itemType == ItemType.PRODUCT) {
            if (productId == null || productId <= 0) {
                throw new IllegalStateException("Product ID is required for product items");
            }
            if (quantity == null || quantity <= 0) {
                throw new IllegalStateException("Valid quantity is required for product items");
            }
            // For product items, set dummy values for service fields if they're required by DB constraints
            if (serviceId == null) {
                serviceId = -1L;  // Sentinel value for product items
            }
        } else if (itemType == ItemType.SERVICE) {
            if (serviceId == null) {
                throw new IllegalStateException("Service ID is required for service items");
            }
            if (rentalPeriod == null || rentalPeriod <= 0) {
                throw new IllegalStateException("Valid rental period is required for service items");
            }
            // For service items, set dummy values for product fields if they're required by DB constraints
            if (productId == null) {
                productId = -1L;  // Sentinel value for service items
            }
            if (quantity == null) {
                quantity = 1;  // Dummy value for service items
            }
        }
        
        // Then calculate total price
        if (unitPrice != null) {
            if (itemType == ItemType.PRODUCT && quantity != null) {
                totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
            } else if (itemType == ItemType.SERVICE && rentalPeriod != null) {
                totalPrice = unitPrice.multiply(BigDecimal.valueOf(rentalPeriod));
            }
        }
    }

    // Helper methods
    public boolean isProduct() {
        return itemType == ItemType.PRODUCT;
    }

    public boolean isService() {
        return itemType == ItemType.SERVICE;
    }

    public enum ItemType {
        PRODUCT,
        SERVICE
    }
}