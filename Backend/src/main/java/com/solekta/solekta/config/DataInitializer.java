package com.solekta.solekta.config;

import com.solekta.solekta.model.Category;
import com.solekta.solekta.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeCategories();
    }

    private void initializeCategories() {
        log.info("Checking categories...");
        
        // Check if categories already exist
        if (categoryRepository.count() > 0) {
            log.info("Categories already exist ({}), skipping initialization", categoryRepository.count());
            return;
        }

        log.info("No categories found, creating sample categories...");
        
        try {
            // Create sample categories
            Category businessLaptops = new Category();
            businessLaptops.setCategoryName("Business Laptops");
            businessLaptops.setDescription("High-performance laptops for business and professional use");
            
            Category gamingLaptops = new Category();
            gamingLaptops.setCategoryName("Gaming Laptops");
            gamingLaptops.setDescription("Powerful laptops designed for gaming and high-performance computing");
            
            Category ultrabooks = new Category();
            ultrabooks.setCategoryName("Ultrabooks");
            ultrabooks.setDescription("Thin, lightweight laptops for portability and everyday use");
            
            // Save categories
            businessLaptops = categoryRepository.save(businessLaptops);
            gamingLaptops = categoryRepository.save(gamingLaptops);
            ultrabooks = categoryRepository.save(ultrabooks);
            
            log.info("Successfully created categories:");
            log.info("- {} (ID: {})", businessLaptops.getCategoryName(), businessLaptops.getCategoryId());
            log.info("- {} (ID: {})", gamingLaptops.getCategoryName(), gamingLaptops.getCategoryId());
            log.info("- {} (ID: {})", ultrabooks.getCategoryName(), ultrabooks.getCategoryId());
            
        } catch (Exception e) {
            log.error("Failed to initialize categories: {}", e.getMessage());
        }
    }
}