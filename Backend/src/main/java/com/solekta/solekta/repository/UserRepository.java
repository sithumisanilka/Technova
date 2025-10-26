package com.solekta.solekta.repository;

import com.solekta.solekta.model.User;
import com.solekta.solekta.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    // Role-based queries for admin management
    long countByRole(Role role);
    List<User> findByRole(Role role);
    Optional<User> findFirstByRole(Role role);
}