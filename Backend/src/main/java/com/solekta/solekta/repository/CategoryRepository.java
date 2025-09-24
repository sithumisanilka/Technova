package com.solekta.solekta.repository;

import com.solekta.solekta.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // You can add custom queries here if needed
    // Optional<Category> findByName(String name);
}
