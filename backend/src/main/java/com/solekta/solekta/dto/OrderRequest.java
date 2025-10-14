package com.solekta.solekta.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotEmpty(message = "Order items cannot be empty")
    private List<OrderItemRequest> orderItems;

    @NotBlank(message = "Shipping name is required")
    private String shippingName;

    @NotBlank(message = "Shipping address is required")
    @Size(max = 500, message = "Shipping address cannot exceed 500 characters")
    private String shippingAddress;

    @NotBlank(message = "Shipping city is required")
    private String shippingCity;

    @NotBlank(message = "Shipping postal code is required")
    private String shippingPostalCode;

    @NotBlank(message = "Shipping phone is required")
    private String shippingPhone;

    @Size(max = 1000, message = "Customer notes cannot exceed 1000 characters")
    private String notes;
}
