package com.solekta.solekta.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import org.hibernate.annotations.CreationTimestamp;
import lombok.*;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@ToString(exclude = "order")
@EqualsAndHashCode(exclude = "order")
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    @Column(unique = true, nullable = false)
    private String paymentNumber;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column
    private String transactionId; // For simulation purposes

    @Column(length = 500)
    private String notes;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime processedAt;



    // Generate payment number
    @PrePersist
    public void generatePaymentNumber() {
        if (paymentNumber == null) {
            paymentNumber = "PAY-" + System.currentTimeMillis();
        }
    }

    public enum PaymentMethod {
        CASH_ON_DELIVERY,
        BANK_TRANSFER,
        CREDIT_CARD,
        DEBIT_CARD,
        DIGITAL_WALLET
    }

    public enum PaymentStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED,
        REFUNDED,
        CANCELLED
    }

    public enum TransactionType {
        PAYMENT,
        REFUND,
        PARTIAL_REFUND
    }

    public enum TransactionStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED,
        CANCELLED
    }
}
