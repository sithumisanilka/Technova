package com.solekta.solekta.dto;

import com.solekta.solekta.model.Order;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private Long customerId;
    private Order.OrderStatus status;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal shippingCost;
    private BigDecimal totalAmount;
    private String notes;
    private String shippingName;
    private String shippingAddress;
    private String shippingCity;
    private String shippingPostalCode;
    private String shippingPhone;
    private List<OrderItemDTO> orderItems;
    private PaymentDTO payment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

