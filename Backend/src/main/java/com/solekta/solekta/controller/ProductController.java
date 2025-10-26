package com.solekta.solekta.controller;

import com.solekta.solekta.model.Product;
import com.solekta.solekta.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // allow React
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    @PostMapping(value = "/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> createProductWithImage(
            @RequestParam("productName") String productName,
            @RequestParam("productDescription") String productDescription,
            @RequestParam("laptopSpec") String laptopSpec,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("isAvailable") Boolean isAvailable,
            @RequestParam("price") Double price,
            @RequestParam("brand") String brand,
            @RequestParam(value = "imageUrls", required = false) String imageUrls,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        
        Product product = productService.createProductWithImage(
                productName, productDescription, laptopSpec, quantity, 
                isAvailable, price, brand, imageUrls, categoryId, imageFile);
        
        return ResponseEntity.ok(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
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
                    existing.setCategory(updatedProduct.getCategory());
                    return ResponseEntity.ok(productService.saveProduct(existing));
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

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {
        try {
            Optional<Product> productOpt = productService.getProductById(id);
            
            if (productOpt.isEmpty() || productOpt.get().getImageData() == null) {
                return ResponseEntity.notFound().build();
            }
            
            Product product = productOpt.get();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(product.getImageContentType()));
            headers.setContentDispositionFormData("inline", product.getImageFileName());
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(product.getImageData());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}