package com.solekta.solekta.controller;

import com.solekta.solekta.model.Category;
import com.solekta.solekta.model.Product;
import com.solekta.solekta.repository.CategoryRepository;
import com.solekta.solekta.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @PostMapping("/seed-products")
    public ResponseEntity<String> seedProducts() {
        // Check if products already exist
        long productCount = productRepository.count();
        if (productCount > 0) {
            return ResponseEntity.badRequest()
                .body("Products already exist in the database. Found " + productCount + " products.");
        }

        try {
            // Create categories first
            Category laptopCategory = createCategoryIfNotExists("Laptops", "High-performance laptops for work and gaming");
            Category phoneCategory = createCategoryIfNotExists("Smartphones", "Latest smartphones with advanced features");
            Category tabletCategory = createCategoryIfNotExists("Tablets", "Portable tablets for productivity and entertainment");

            // Create fake products
            List<Product> products = Arrays.asList(
                Product.builder()
                    .productName("MacBook Pro 16-inch")
                    .productDescription("Professional laptop with M2 Pro chip, perfect for creative work and development. Features stunning Liquid Retina XDR display and all-day battery life.")
                    .category(laptopCategory)
                    .laptopSpec("M2 Pro chip, 16GB RAM, 512GB SSD, 16-inch Liquid Retina XDR display")
                    .quantity(25)
                    .isAvailable(true)
                    .price(2499.99)
                    .brand("Apple")
                    .imageUrls("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301")
                    .build(),

                Product.builder()
                    .productName("Dell XPS 13")
                    .productDescription("Ultra-portable premium laptop with stunning InfinityEdge display. Perfect for business users and students who need reliable performance on the go.")
                    .category(laptopCategory)
                    .laptopSpec("Intel Core i7-1360P, 16GB LPDDR5, 512GB SSD, 13.4-inch FHD+ display")
                    .quantity(30)
                    .isAvailable(true)
                    .price(1299.99)
                    .brand("Dell")
                    .imageUrls("https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9315/media-gallery/notebook-xps-13-9315-nt-blue-gallery-4.psd")
                    .build(),

                Product.builder()
                    .productName("iPhone 15 Pro")
                    .productDescription("The most advanced iPhone ever with titanium design and A17 Pro chip. Features professional camera system and Action Button for enhanced productivity.")
                    .category(phoneCategory)
                    .laptopSpec("A17 Pro chip, 128GB storage, 6.1-inch Super Retina XDR display, Pro camera system")
                    .quantity(50)
                    .isAvailable(true)
                    .price(999.99)
                    .brand("Apple")
                    .imageUrls("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-naturaltitanium-select")
                    .build(),

                Product.builder()
                    .productName("Samsung Galaxy S24 Ultra")
                    .productDescription("Ultimate Android flagship with built-in S Pen and AI-powered features. Large Dynamic AMOLED display perfect for productivity and entertainment.")
                    .category(phoneCategory)
                    .laptopSpec("Snapdragon 8 Gen 3, 256GB storage, 6.8-inch Dynamic AMOLED 2X, S Pen included")
                    .quantity(40)
                    .isAvailable(true)
                    .price(1199.99)
                    .brand("Samsung")
                    .imageUrls("https://images.samsung.com/is/image/samsung/p6pim/us/2401/gallery/us-galaxy-s24-ultra-s928-sm-s928uzkeue-539573924")
                    .build(),

                Product.builder()
                    .productName("iPad Pro 12.9-inch")
                    .productDescription("Professional tablet with stunning Liquid Retina XDR display. Perfect for creative work, note-taking, and productivity apps.")
                    .category(tabletCategory)
                    .laptopSpec("M2 chip, 128GB storage, 12.9-inch Liquid Retina XDR display, Apple Pencil compatible")
                    .quantity(20)
                    .isAvailable(true)
                    .price(1099.99)
                    .brand("Apple")
                    .imageUrls("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-select-wifi-spacegray-202210")
                    .build(),

                Product.builder()
                    .productName("Microsoft Surface Pro 9")
                    .productDescription("Versatile 2-in-1 laptop-tablet hybrid. Perfect for business professionals who need mobility and performance in one device.")
                    .category(tabletCategory)
                    .laptopSpec("Intel Core i7-1255U, 16GB RAM, 256GB SSD, 13-inch PixelSense display, Type Cover included")
                    .quantity(15)
                    .isAvailable(true)
                    .price(1599.99)
                    .brand("Microsoft")
                    .imageUrls("https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW15JXz")
                    .build(),

                Product.builder()
                    .productName("ASUS ROG Strix G15")
                    .productDescription("High-performance gaming laptop with powerful graphics and ultra-fast display. Built for serious gamers and content creators.")
                    .category(laptopCategory)
                    .laptopSpec("AMD Ryzen 7 6800H, RTX 3070 Ti, 16GB DDR5, 1TB SSD, 15.6-inch FHD 300Hz display")
                    .quantity(12)
                    .isAvailable(true)
                    .price(1799.99)
                    .brand("ASUS")
                    .imageUrls("https://dlcdnwebimgs.asus.com/gain/A8FFEA27-5FBD-4EA7-A689-984CE0A8C1E8/w692")
                    .build(),

                Product.builder()
                    .productName("Google Pixel 8 Pro")
                    .productDescription("Google's flagship smartphone with advanced AI features and computational photography. Pure Android experience with guaranteed updates.")
                    .category(phoneCategory)
                    .laptopSpec("Google Tensor G3, 128GB storage, 6.7-inch LTPO OLED display, Advanced AI camera")
                    .quantity(35)
                    .isAvailable(true)
                    .price(899.99)
                    .brand("Google")
                    .imageUrls("https://lh3.googleusercontent.com/EU4EvOEONH7c5MF4vD_IH4TgNhSEwH1HCqW8n1z2yvLxq2JqzgFEOWyQCxg9HlX5ww")
                    .build(),

                Product.builder()
                    .productName("Samsung Galaxy Tab S9")
                    .productDescription("Premium Android tablet with stunning AMOLED display and included S Pen. Perfect for digital art, note-taking, and entertainment.")
                    .category(tabletCategory)
                    .laptopSpec("Snapdragon 8 Gen 2, 128GB storage, 11-inch Dynamic AMOLED 2X, S Pen included")
                    .quantity(18)
                    .isAvailable(true)
                    .price(799.99)
                    .brand("Samsung")
                    .imageUrls("https://images.samsung.com/is/image/samsung/p6pim/us/2307/gallery/us-galaxy-tab-s9-x710-sm-x710nzeaxar-537402051")
                    .build(),

                Product.builder()
                    .productName("HP Spectre x360")
                    .productDescription("Premium convertible laptop with stunning OLED display. Ultra-portable design perfect for professionals who demand both style and performance.")
                    .category(laptopCategory)
                    .laptopSpec("Intel Core i7-1355U, 16GB LPDDR4x, 1TB SSD, 13.5-inch OLED touchscreen")
                    .quantity(22)
                    .isAvailable(true)
                    .price(1449.99)
                    .brand("HP")
                    .imageUrls("https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08140725.png")
                    .build()
            );

            // Save all products
            productRepository.saveAll(products);

            return ResponseEntity.ok("Successfully created " + products.size() + " fake products!");

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error creating fake products: " + e.getMessage());
        }
    }

    private Category createCategoryIfNotExists(String name, String description) {
        return categoryRepository.findByCategoryName(name)
            .orElseGet(() -> {
                Category category = Category.builder()
                    .categoryName(name)
                    .description(description)
                    .build();
                return categoryRepository.save(category);
            });
    }
}