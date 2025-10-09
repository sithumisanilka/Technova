package com.solekta.solekta.service;

import com.solekta.solekta.dto.ProductRequest;
import com.solekta.solekta.dto.ProductResponse;
import com.solekta.solekta.model.Category;
import com.solekta.solekta.model.Product;
import com.solekta.solekta.repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service @AllArgsConstructor
public class ProductService {

    private ProductRepository productRepository;
    private final CategoryService categoryService;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductResponse::new)
                .toList();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(ProductRequest dto) {
        // Auto-set isAvailable based on quantity if not explicitly set
        Product product = new Product();
        product.setProductName(dto.getProductName());
        product.setProductDescription(dto.getProductDescription());
        product.setLaptopSpec(dto.getLaptopSpec());
        product.setQuantity(dto.getQuantity());
        product.setIsAvailable(dto.getIsAvailable());
        product.setPrice(dto.getPrice());
        product.setBrand(dto.getBrand());
        // Fetch Category entity by ID
        Category category =  categoryService.getCategoryById(dto.getCategoryId()).orElse(null);
        product.setCategory(category);
        product.setImageUrls(dto.getImageUrls());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Additional service methods for the new endpoints

    public List<Product> getAvailableProducts() {
        return productRepository.findByIsAvailableTrue();
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryCategoryId(categoryId);
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(keyword, keyword);
    }

    // Additional useful service methods

    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrandContainingIgnoreCase(brand);
    }

    public List<Product> getProductsByPriceRange(Double minPrice, Double maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public List<Product> getLowStockProducts(Integer threshold) {
        return productRepository.findByQuantityLessThanEqual(threshold);
    }

    public Product updateProductQuantity(Long productId, Integer newQuantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setQuantity(newQuantity);
            // Auto-update availability based on quantity
            product.setIsAvailable(newQuantity > 0);
            return productRepository.save(product);
        }
        return null;
    }

    public Product updateProductAvailability(Long productId, Boolean isAvailable) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setIsAvailable(isAvailable);
            return productRepository.save(product);
        }
        return null;
    }
}