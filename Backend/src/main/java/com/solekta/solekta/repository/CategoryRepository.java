package com.solekta.solekta.repository;

import com.solekta.solekta.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Find category by exact name match
    Optional<Category> findByCategoryName(String categoryName);

    // Check if category exists by name
    Boolean existsByCategoryName(String categoryName);

    // Search categories by name or description (case insensitive)
    List<Category> findByCategoryNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String categoryName, String description);

    // Find category by name containing (partial match)
    List<Category> findByCategoryNameContainingIgnoreCase(String categoryName);

    // Get category with its products (eager fetching)
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.products WHERE c.id = :categoryId")
    Optional<Category> findByIdWithProducts(@Param("categoryId") Long categoryId);

    // Get categories that have products
    @Query("SELECT DISTINCT c FROM Category c WHERE c.products IS NOT EMPTY")
    List<Category> findCategoriesWithProducts();

    // Get categories with no products
    @Query("SELECT c FROM Category c WHERE c.products IS EMPTY")
    List<Category> findCategoriesWithoutProducts();

    // Count categories by name pattern
    Long countByCategoryNameContainingIgnoreCase(String categoryName);

    // Custom search query for comprehensive search
    @Query("SELECT c FROM Category c WHERE " +
            "LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Category> searchCategories(@Param("keyword") String keyword);
}