package com.solekta.solekta.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
    private Integer quantity = 0;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String brand;

    @Column(name = "image_urls", columnDefinition = "TEXT")
    private String imageUrls;

    // FIXED: Many products belong to one category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id") // Remove referencedColumnName or make it consistent
    @JsonIgnore
    private Category category;
}