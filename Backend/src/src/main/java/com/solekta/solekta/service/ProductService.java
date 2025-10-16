package com.solekta.solekta.service;

import com.solekta.solekta.model.Product;
import com.solekta.solekta.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get a product by ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Save a product (create or update)
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Delete a product by ID
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Check if a product exists
    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }

    // Count total products
    public long countProducts() {
        return productRepository.count();
    }

    // Find products by name containing (case insensitive)
    public List<Product> findProductsByNameContaining(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    // Find products by brand
    public List<Product> findProductsByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    // Find products with quantity greater than specified amount
    public List<Product> findProductsInStock(int minQuantity) {
        return productRepository.findByQuantityGreaterThan(minQuantity);
    }
}