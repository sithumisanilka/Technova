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
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    List<Product> findByCategoryCategoryId(@Param("categoryId") Long categoryId);

    // Search products by name or description
    List<Product> findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(String name, String description);

    // Find products by brand
    List<Product> findByBrandContainingIgnoreCase(String brand);

    // Find products within price range
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);

    // Find products with low stock
    List<Product> findByQuantityLessThanEqual(Integer quantity);

    // Find products by availability status
    List<Product> findByIsAvailable(Boolean isAvailable);

    // Count total products
    long count();

    // Custom query to find products by category name
    @Query("SELECT p FROM Product p JOIN p.category c WHERE c.categoryName = :categoryName")
    List<Product> findByCategoryName(@Param("categoryName") String categoryName);

    // Find products by multiple criteria
    @Query("SELECT p FROM Product p WHERE " +
           "(:name IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:brand IS NULL OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId)")
    List<Product> findProductsByFilters(@Param("name") String name,
                                      @Param("brand") String brand,
                                      @Param("minPrice") Double minPrice,
                                      @Param("maxPrice") Double maxPrice,
                                      @Param("categoryId") Long categoryId);
}