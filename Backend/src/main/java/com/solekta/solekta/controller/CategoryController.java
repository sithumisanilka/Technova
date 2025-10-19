package com.solekta.solekta.controller;

import com.solekta.solekta.model.Category;
import com.solekta.solekta.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        return categoryService.getCategoryById(id)
                .map(existing -> {
                    // Update all fields
                    existing.setCategoryName(updatedCategory.getCategoryName());
                    existing.setDescription(updatedCategory.getDescription());
                    return ResponseEntity.ok(categoryService.saveCategory(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteCategory(@PathVariable Long id) {
        return categoryService.getCategoryById(id)
                .map(c -> {
                    categoryService.deleteCategory(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Additional endpoints

    @GetMapping("/name/{name}")
    public ResponseEntity<Category> getCategoryByName(@PathVariable String name) {
        return categoryService.getCategoryByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/exists/{name}")
    public ResponseEntity<Boolean> categoryExists(@PathVariable String name) {
        return ResponseEntity.ok(categoryService.categoryExists(name));
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<?> getCategoryWithProducts(@PathVariable Long id) {
        return categoryService.getCategoryWithProducts(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Category> searchCategories(@RequestParam String keyword) {
        return categoryService.searchCategories(keyword);
    }
}