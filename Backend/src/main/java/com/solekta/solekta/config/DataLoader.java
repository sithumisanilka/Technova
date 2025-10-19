package com.solekta.solekta.config;

import com.solekta.solekta.enums.Role;
import com.solekta.solekta.model.Profile;
import com.solekta.solekta.model.User;
import com.solekta.solekta.repository.ProfileRepository;
import com.solekta.solekta.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, 
                     ProfileRepository profileRepository,
                     PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        loadInitialData();
    }

    private void loadInitialData() {
        // Check if any admin users exist
        long adminCount = userRepository.countByRole(Role.ADMIN);
        
        if (adminCount == 0) {
            log.info("🚀 No admin users found. Creating default admin user...");
            
            // Create default admin user
            User adminUser = User.builder()
                    .username("admin")
                    .email("admin@technova.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("System")
                    .lastName("Administrator")
                    .phone("+1234567890")
                    .role(Role.ADMIN)
                    .build();
            
            User savedAdmin = userRepository.save(adminUser);
            
            // Create admin profile
            Profile adminProfile = Profile.builder()
                    .firstName("System")
                    .lastName("Administrator")
                    .phoneNumber("+1234567890")
                    .user(savedAdmin)
                    .build();
            
            profileRepository.save(adminProfile);
            
            log.info("✅ Default admin user created successfully!");
            log.info("📧 Admin Email: admin@technova.com");
            log.info("🔑 Admin Password: admin123");
            log.info("⚠️  SECURITY: Please change the default admin password after first login!");
            
        } else {
            log.info("👤 Admin users already exist. Skipping default admin creation.");
        }
        
        // Display user statistics
        long totalUsers = userRepository.count();
        long userCount = userRepository.countByRole(Role.USER);
        adminCount = userRepository.countByRole(Role.ADMIN);
        
        log.info("📊 User Statistics:");
        log.info("   Total Users: {}", totalUsers);
        log.info("   Regular Users: {}", userCount);
        log.info("   Admin Users: {}", adminCount);
    }
}