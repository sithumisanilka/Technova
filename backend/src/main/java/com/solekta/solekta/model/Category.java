package com.solekta.solekta.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Table(name = "category")
public class Category {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long categoryId;

        @Column(nullable = false, unique = true, length = 100)
        private String categoryName;

        // One category can have many products
        @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
        @JsonIgnore
        private List<Product> products;

        // Constructors
        public Category() { //JPA Need this
        }

        public Category(Long categoryId, String categoryName, List<Product> products) {
                this.categoryId = categoryId;
                this.categoryName = categoryName;
                this.products = products;
        }

        // Getters & Setters
        public Long getCategoryId() {
                return categoryId;
        }

        public void setCategoryId(Long categoryId) {
                this.categoryId = categoryId;
        }

        public String getCategoryName() {
                return categoryName;
        }

        public void setCategoryName(String categoryName) {
                this.categoryName = categoryName;
        }

        public List<Product> getProducts() {
                return products;
        }

        public void setProducts(List<Product> products) {
                this.products = products;
        }
}
