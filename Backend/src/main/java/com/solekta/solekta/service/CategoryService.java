package com.solekta.solekta.service;

import com.solekta.solekta.model.Category;
import java.util.List;
import java.util.Optional;

public interface CategoryService {

    // Get all categories
    List<Category> getAllCategories();

    // Get category by ID
    Optional<Category> getCategoryById(Long id);

    // Get category by name
    Optional<Category> getCategoryByName(String name);

    // Create new category
    Category saveCategory(Category category);

    // Update category
    Category updateCategory(Long id, Category categoryDetails);

    // Delete category
    void deleteCategory(Long id);

    // Check if category exists by name
    boolean existsByName(String name);

    // Get only active categories (for frontend display)
    List<Category> getActiveCategories();

    // Toggle category active status
    Category toggleCategoryStatus(Long id);

    // Specialized methods for your repair shop business
    List<Category> getProductCategories(); // Laptops, Phones, Accessories
    List<Category> getServiceCategories(); // Repair Services
}