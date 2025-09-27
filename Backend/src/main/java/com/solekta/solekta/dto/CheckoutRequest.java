package com.solekta.solekta.dto;

import com.solekta.solekta.model.PaymentTransaction;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    @NotNull
    private Long customerId;

    @NotBlank
    private String shippingName;

    @NotBlank
    private String shippingAddress;

    @NotBlank
    private String shippingCity;

    @NotBlank
    private String shippingPostalCode;

    @NotBlank
    private String shippingPhone;

    @NotNull
    private PaymentTransaction.PaymentMethod paymentMethod;

    private String notes;
}

