package com.solekta.solekta.repository;

import com.solekta.solekta.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Integer> {

    // Find services by name (case-insensitive)
    List<Service> findByServiceNameContainingIgnoreCase(String serviceName);

    // Find active services (custom query if needed)
    @Query("SELECT s FROM Service s ORDER BY s.serviceName")
    List<Service> findAllOrderByName();
}

