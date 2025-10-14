package com.solekta.solekta.dto;

import com.solekta.solekta.model.Order;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class OrderStatusUpdateRequest {

    @NotNull(message = "Order status is required")
    private Order.OrderStatus status;

    private String notes;
    private String trackingNumber;
}