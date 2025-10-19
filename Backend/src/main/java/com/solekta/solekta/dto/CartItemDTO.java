package com.solekta.solekta.dto;

import com.solekta.solekta.model.CartItem;
import com.solekta.solekta.model.RentalService;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long id;
    
    // Item type
    private CartItem.ItemType itemType;
    
    // Product fields
    private Long productId;
    private String productName;
    private String productSku;
    private Integer quantity;
    
    // Service fields
    private Long serviceId;
    private String serviceName;
    private Integer rentalPeriod;
    private RentalService.RentalPeriodType rentalPeriodType;
    
    // Common fields
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    
    // Helper methods
    public boolean isProduct() {
        return itemType == CartItem.ItemType.PRODUCT;
    }
    
    public boolean isService() {
        return itemType == CartItem.ItemType.SERVICE;
    }
}
