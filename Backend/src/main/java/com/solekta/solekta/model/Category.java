package com.solekta.solekta.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "category")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@ToString(exclude = "products")
@EqualsAndHashCode(exclude = "products")
public class Category {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "category_id") // Make sure this matches
        private Long categoryId;

        @Column(name = "category_name", nullable = false, unique = true, length = 100)
        private String categoryName;

        @Column(name = "description", length = 255)
        private String description;

        // One-to-Many relationship with Product
        @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        @JsonIgnore
        private List<Product> products;
}