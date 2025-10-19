package com.solekta.solekta.repository;

import com.solekta.solekta.model.RentalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<RentalService, Long> {

    // Find available services
    List<RentalService> findByIsAvailableTrue();

    // Find services by category
    List<RentalService> findByCategoryContainingIgnoreCase(String category);

    // Find services by name (case-insensitive)
    List<RentalService> findByServiceNameContainingIgnoreCase(String serviceName);

    // Search services by name or description
    @Query("SELECT s FROM RentalService s WHERE s.serviceName LIKE %:keyword% OR s.description LIKE %:keyword%")
    List<RentalService> searchServices(@Param("keyword") String keyword);

    // Find services by price range
    List<RentalService> findByPricePerDayBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // Find active services (custom query if needed)
    @Query("SELECT s FROM RentalService s ORDER BY s.serviceName")
    List<RentalService> findAllOrderByName();

    // Check if service exists by name
    boolean existsByServiceName(String serviceName);
}

