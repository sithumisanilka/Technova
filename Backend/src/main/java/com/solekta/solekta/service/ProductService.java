package com.solekta.solekta.service;

import com.solekta.solekta.model.Product;
import com.solekta.solekta.model.Category;
import com.solekta.solekta.repository.ProductRepository;
import com.solekta.solekta.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        // Auto-set isAvailable based on quantity if not explicitly set
        if (product.getIsAvailable() == null) {
            product.setIsAvailable(product.getQuantity() != null && product.getQuantity() > 0);
        }
        return productRepository.save(product);
    }

    public Product createProductWithImage(String productName, String productDescription, 
            String laptopSpec, Integer quantity, Boolean isAvailable, Double price, 
            String brand, String imageUrls, Long categoryId, MultipartFile imageFile) {
        
        Product product = new Product();
        product.setProductName(productName);
        product.setProductDescription(productDescription);
        product.setLaptopSpec(laptopSpec);
        product.setQuantity(quantity);
        product.setIsAvailable(isAvailable != null ? isAvailable : (quantity != null && quantity > 0));
        product.setPrice(price);
        product.setBrand(brand);
        product.setImageUrls(imageUrls);
        
        // Set category if provided
        if (categoryId != null) {
            log.info("Setting category with ID: {}", categoryId);
            Optional<Category> categoryOpt = categoryRepository.findById(categoryId);
            if (categoryOpt.isPresent()) {
                Category category = categoryOpt.get();
                product.setCategory(category);
                log.info("Successfully set category: {} (ID: {})", category.getCategoryName(), category.getCategoryId());
            } else {
                log.warn("Category with ID {} not found", categoryId);
            }
        } else {
            log.info("No categoryId provided in request");
        }
        
        // Handle image file upload
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                product.setImageData(imageFile.getBytes());
                product.setImageFileName(imageFile.getOriginalFilename());
                product.setImageContentType(imageFile.getContentType());
                log.info("Product image uploaded: {}", imageFile.getOriginalFilename());
            } catch (IOException e) {
                log.error("Failed to process product image file: {}", e.getMessage());
                throw new RuntimeException("Failed to process product image file", e);
            }
        }
        
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