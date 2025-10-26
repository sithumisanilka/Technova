package com.solekta.solekta.dto;

import com.solekta.solekta.model.RentalService;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddServiceRequest {
    @NotNull
    private Long serviceId;

    @NotNull
    @Positive
    private Integer rentalPeriod;

    @NotNull
    private RentalService.RentalPeriodType rentalPeriodType;

    @NotNull
    @Positive
    private BigDecimal unitPrice;
}