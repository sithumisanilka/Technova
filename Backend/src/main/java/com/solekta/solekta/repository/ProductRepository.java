package com.solekta.solekta.repository;

import com.solekta.solekta.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Basic CRUD operations are provided by JpaRepository

    // Find available products
    List<Product> findByIsAvailableTrue();

    // Find products by category ID
    List<Product> findByCategoryCategoryId(Long categoryId);

    // Search products by name or description
    List<Product> findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(
            String productName, String productDescription);

    // Find products by brand
    List<Product> findByBrandContainingIgnoreCase(String brand);

    // Find products by price range
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);

    // Find low stock products
    List<Product> findByQuantityLessThanEqual(Integer threshold);

    // Find products with quantity greater than specified value
    List<Product> findByQuantityGreaterThan(Integer quantity);

    // Find by product name (exact match)
    Optional<Product> findByProductName(String productName);

    // Find by product name containing (case insensitive)
    List<Product> findByProductNameContainingIgnoreCase(String productName);

    // Custom query for complex searches
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.productDescription) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.laptopSpec) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> comprehensiveSearch(@Param("keyword") String keyword);

    // Custom query for products by category and availability
    @Query("SELECT p FROM Product p WHERE p.category.categoryId = :categoryId AND p.isAvailable = true")
    List<Product> findAvailableProductsByCategory(@Param("categoryId") Long categoryId);

    // Custom query for products by brand and price range
    @Query("SELECT p FROM Product p WHERE p.brand = :brand AND p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByBrandAndPriceRange(
            @Param("brand") String brand,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice);

    // Count products by availability
    Long countByIsAvailableTrue();

    // Count products by category
    Long countByCategoryCategoryId(Long categoryId);

    // Check if product exists by name (for unique constraint validation)
    Boolean existsByProductName(String productName);

    // Find products ordered by price (ascending)
    List<Product> findByOrderByPriceAsc();

    // Find products ordered by price (descending)
    List<Product> findByOrderByPriceDesc();

    // Find available products ordered by price
    List<Product> findByIsAvailableTrueOrderByPriceAsc();
}