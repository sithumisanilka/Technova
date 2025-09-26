package com.solekta.solekta.service;

import com.solekta.solekta.model.Product;
import com.solekta.solekta.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        log.info("Retrieving all products");
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        log.info("Retrieving product with ID: {}", id);
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        log.info("Saving product: {}", product.getName());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        log.info("Deleting product with ID: {}", id);
        productRepository.deleteById(id);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        log.info("Retrieving products by category ID: {}", categoryId);
        return productRepository.findByCategoryCategoryId(categoryId);
    }

    public List<Product> getProductsByName(String name) {
        log.info("Retrieving products by name: {}", name);
        return productRepository.findByNameContainingIgnoreCase(name);
    }
}

