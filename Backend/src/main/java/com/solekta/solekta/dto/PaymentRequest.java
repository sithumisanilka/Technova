package com.solekta.solekta.dto;

import com.solekta.solekta.model.PaymentTransaction;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long orderId;
    private PaymentTransaction.PaymentMethod paymentMethod;
    private String cardNumber; // For simulation
    private String cardHolderName; // For simulation
    private String expiryDate; // For simulation
    private String cvv; // For simulation
    private String notes;
}