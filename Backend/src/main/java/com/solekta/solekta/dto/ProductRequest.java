package com.solekta.solekta.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    private String productName;
    private String productDescription;
    private String laptopSpec;
    private Integer quantity;
    private Boolean isAvailable;
    private Double price;
    private String brand;
    private Long categoryId; // Just the category ID, not the whole Category object
    private String imageUrls; // Optional, can be null
}
