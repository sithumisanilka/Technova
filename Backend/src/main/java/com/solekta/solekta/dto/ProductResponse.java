package com.solekta.solekta.dto;

import com.solekta.solekta.model.Product;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class ProductResponse {

    private Long productId;
    private String productName;
    private String productDescription;
    private String laptopSpec;
    private Integer quantity;
    private Boolean isAvailable;
    private Double price;
    private String brand;
    private String imageUrls;
    private Long categoryId;  // Only include categoryId

    public ProductResponse(Product product) {
        this.productId = product.getProductId();
        this.productName = product.getProductName();
        this.productDescription = product.getProductDescription();
        this.laptopSpec = product.getLaptopSpec();
        this.quantity = product.getQuantity();
        this.isAvailable = product.getIsAvailable();
        this.price = product.getPrice();
        this.brand = product.getBrand();
        this.imageUrls = product.getImageUrls();
        this.categoryId = product.getCategory() != null ? product.getCategory().getCategoryId() : null;
    }
}
