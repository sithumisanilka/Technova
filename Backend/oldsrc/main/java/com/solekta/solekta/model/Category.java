package com.solekta.solekta.model;

import jakarta.persistence.*;
import lombok.*;
import com.solekta.solekta.model.Product;

import java.util.List;

@Entity
@Table(name = "category") @Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Category {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long categoryId;

        @Column(nullable = false, unique = true, length = 100)
        private String categoryName;

        // One category can have many products
        @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
        private List<Product> products;


}
