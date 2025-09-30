package com.solekta.solekta.repository;

import com.solekta.solekta.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Custom query examples:
    // List<Product> findByCategoryId(Long categoryId);
    // Optional<Product> findByName(String name);
}
