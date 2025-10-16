package com.solekta.solekta.repository;

import com.solekta.solekta.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Find products by name containing (case insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Find products by brand
    List<Product> findByBrand(String brand);
    
    // Find products with quantity greater than specified amount
    List<Product> findByQuantityGreaterThan(int quantity);
    
    // Find products by category
    List<Product> findByCategory_CategoryId(Long categoryId);
    
    // Find product by exact name
    Optional<Product> findByName(String name);
}
