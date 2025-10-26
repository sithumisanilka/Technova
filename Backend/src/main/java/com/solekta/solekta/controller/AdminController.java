package com.solekta.solekta.controller;

import com.solekta.solekta.dto.RegisterRequest;
import com.solekta.solekta.enums.Role;
import com.solekta.solekta.model.Category;
import com.solekta.solekta.model.Product;
import com.solekta.solekta.model.Profile;
import com.solekta.solekta.model.User;
import com.solekta.solekta.repository.CategoryRepository;
import com.solekta.solekta.repository.ProductRepository;
import com.solekta.solekta.repository.ProfileRepository;
import com.solekta.solekta.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;



    private Category createCategoryIfNotExists(String name, String description) {
        return categoryRepository.findByCategoryName(name)
            .orElseGet(() -> {
                Category category = Category.builder()
                    .categoryName(name)
                    .description(description)
                    .build();
                return categoryRepository.save(category);
            });
    }

    // ================ ADMIN USER MANAGEMENT ================

    /**
     * Create a new admin user manually
     * Useful for adding additional admin users after initial setup
     */
    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, Object>> createAdmin(@RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate that username and email don't already exist
            if (userRepository.existsByUsername(request.getUsername())) {
                response.put("success", false);
                response.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (userRepository.existsByEmail(request.getEmail())) {
                response.put("success", false);
                response.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create admin user
            User adminUser = User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .firstName(request.getFirstName() != null ? request.getFirstName() : "Admin")
                    .lastName(request.getLastName() != null ? request.getLastName() : "User")
                    .phone(request.getPhoneNumber())
                    .role(Role.ADMIN)
                    .build();
            
            User savedAdmin = userRepository.save(adminUser);
            
            // Create admin profile
            Profile adminProfile = Profile.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .phoneNumber(request.getPhoneNumber())
                    .user(savedAdmin)
                    .build();
            
            profileRepository.save(adminProfile);
            
            response.put("success", true);
            response.put("message", "Admin user created successfully");
            response.put("adminId", savedAdmin.getId());
            response.put("username", savedAdmin.getUsername());
            response.put("email", savedAdmin.getEmail());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error creating admin user: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get all admin users
     */
    @GetMapping("/admins")
    public ResponseEntity<Map<String, Object>> getAllAdmins() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<User> admins = userRepository.findByRole(Role.ADMIN);
            
            response.put("success", true);
            response.put("admins", admins);
            response.put("totalAdmins", admins.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error retrieving admin users: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * Get user statistics
     */
    @GetMapping("/user-stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long totalUsers = userRepository.count();
            long adminCount = userRepository.countByRole(Role.ADMIN);
            long userCount = userRepository.countByRole(Role.USER);
            
            Map<String, Long> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("adminUsers", adminCount);
            stats.put("regularUsers", userCount);
            
            response.put("success", true);
            response.put("statistics", stats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error retrieving user statistics: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}