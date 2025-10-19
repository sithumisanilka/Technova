package com.solekta.solekta.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddCartItemRequest {
    private Long productId;
    private Integer quantity;
    private BigDecimal unitPrice;
}