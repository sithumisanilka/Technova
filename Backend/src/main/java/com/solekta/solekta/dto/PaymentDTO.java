package com.solekta.solekta.dto;

import com.solekta.solekta.model.PaymentTransaction;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private String paymentNumber;
    private BigDecimal amount;
    private PaymentTransaction.PaymentMethod method;
    private PaymentTransaction.PaymentStatus status;
    private String transactionId;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
}

