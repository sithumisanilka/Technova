package com.solekta.solekta.service;

import com.solekta.solekta.model.Category;
import com.solekta.solekta.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByCategoryName(name);
    }

    public Boolean categoryExists(String name) {
        return categoryRepository.existsByCategoryName(name);
    }

    public Optional<Category> getCategoryWithProducts(Long id) {
        return categoryRepository.findByIdWithProducts(id);
    }

    public List<Category> searchCategories(String keyword) {
        return categoryRepository.searchCategories(keyword);
    }

    public List<Category> getCategoriesWithProducts() {
        return categoryRepository.findCategoriesWithProducts();
    }

    public List<Category> getCategoriesWithoutProducts() {
        return categoryRepository.findCategoriesWithoutProducts();
    }

    public Category saveCategory(Category category) {
        // Validate unique category name before saving
        if (category.getId() == null && categoryRepository.existsByCategoryName(category.getCategoryName())) {
            throw new RuntimeException("Category with name '" + category.getCategoryName() + "' already exists");
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Check if name is being changed and if new name already exists
        if (!category.getCategoryName().equals(categoryDetails.getCategoryName()) &&
                categoryRepository.existsByCategoryName(categoryDetails.getCategoryName())) {
            throw new RuntimeException("Category with name '" + categoryDetails.getCategoryName() + "' already exists");
        }

        // Update fields
        category.setCategoryName(categoryDetails.getCategoryName());
        category.setDescription(categoryDetails.getDescription());

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Check if category has products before deletion
        if (!category.getProducts().isEmpty()) {
            throw new RuntimeException("Cannot delete category with existing products. Please remove products first.");
        }

        categoryRepository.deleteById(id);
    }

    public Long getCategoryCount() {
        return categoryRepository.count();
    }

    public Long getCategoryCountBySearch(String keyword) {
        return categoryRepository.countByCategoryNameContainingIgnoreCase(keyword);
    }

    // Method to safely delete category even if it has products (transfers or removes products)
    public void deleteCategoryForcefully(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // This will cascade delete if CascadeType.ALL is set in the relationship
        // Or you can manually handle product reassignment here
        categoryRepository.deleteById(id);
    }
}