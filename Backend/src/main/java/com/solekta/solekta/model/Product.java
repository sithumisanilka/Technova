package com.solekta.solekta.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@ToString(exclude = "category")
@EqualsAndHashCode(exclude = "category")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(name = "product_name", nullable = false, unique = true, length = 200)
    private String productName;

    @Column(name = "product_description", nullable = false, columnDefinition = "TEXT")
    private String productDescription;

    @Column(name = "laptop_spec", nullable = false, columnDefinition = "TEXT")
    private String laptopSpec;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 0;

    @Column(name = "is_available")
    @Builder.Default
    private Boolean isAvailable = false;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String brand;

    @Column(name = "image_urls", columnDefinition = "LONGTEXT")
    private String imageUrls;

    // Product Image Storage (as binary data)
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @Column(length = 255)
    private String imageFileName;

    @Column(length = 100)
    private String imageContentType;

    // FIXED: Many products belong to one category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id") // Remove referencedColumnName or make it consistent
    @JsonIgnore
    private Category category;

    // Add a method to expose categoryId in JSON without exposing full category
    @JsonProperty("categoryId")
    public Long getCategoryId() {
        return category != null ? category.getCategoryId() : null;
    }

    // Add a method to expose category name in JSON
    @JsonProperty("categoryName")
    public String getCategoryName() {
        return category != null ? category.getCategoryName() : null;
    }
}