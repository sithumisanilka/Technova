package com.solekta.solekta.dto;

import lombok.Data;

@Data
public class ProductRequest {
    private String productName;
    private String productDescription;
    private String laptopSpec;
    private Integer quantity;
    private Boolean isAvailable;
    private Double price;
    private String brand;
    private String imageUrls;
    private Long categoryId;
}