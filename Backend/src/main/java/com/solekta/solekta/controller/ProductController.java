package com.solekta.solekta.controller;

import com.solekta.solekta.dto.ProductRequest;
import com.solekta.solekta.dto.ProductResponse;
import com.solekta.solekta.model.Product;
import com.solekta.solekta.repository.ProductRepository;
import com.solekta.solekta.service.CategoryService;
import com.solekta.solekta.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController @AllArgsConstructor
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // allow React
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final ProductRepository productRepository;

    @GetMapping
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ProductResponse::new)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody ProductRequest ProductRequest) {
        return productService.saveProduct(ProductRequest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody ProductRequest updatedProduct) {
        return productService.getProductById(id)
                .map(existing -> {
                    // Update all fields except the ID
                    existing.setProductName(updatedProduct.getProductName());
                    existing.setProductDescription(updatedProduct.getProductDescription());
                    existing.setLaptopSpec(updatedProduct.getLaptopSpec());
                    existing.setQuantity(updatedProduct.getQuantity());
                    existing.setIsAvailable(updatedProduct.getIsAvailable());
                    existing.setPrice(updatedProduct.getPrice());
                    existing.setImageUrls(updatedProduct.getImageUrls());
                    existing.setCategory(categoryService.getCategoryById(updatedProduct.getCategoryId()).get());
                    return ResponseEntity.ok(productRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProduct(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(p -> {
                    productService.deleteProduct(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Additional endpoints you might want to add:

    @GetMapping("/available")
    public List<Product> getAvailableProducts() {
        return productService.getAvailableProducts();
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        return productService.searchProducts(keyword);
    }
}