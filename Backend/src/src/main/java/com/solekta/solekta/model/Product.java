package com.solekta.solekta.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Product") @Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    private String brand;

    @Column(nullable = false)
    private Integer quantity = 0;

    // Many products belong to one category
    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "categoryId")
    private Category category;

    // Getters and setters

}
