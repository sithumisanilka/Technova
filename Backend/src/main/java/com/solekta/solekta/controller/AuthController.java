package com.solekta.solekta.controller;

import com.solekta.solekta.dto.RegisterRequest;
import com.solekta.solekta.dto.UserProfileResponse;
import com.solekta.solekta.dto.UpdateProfileRequest;
import com.solekta.solekta.enums.Role;
import com.solekta.solekta.model.Profile;
import com.solekta.solekta.model.User;
import com.solekta.solekta.repository.ProfileRepository;
import com.solekta.solekta.repository.UserRepository;
import com.solekta.solekta.security.JwtUtil;
import com.solekta.solekta.service.ProfileService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final ProfileService profileService;
    private final ProfileRepository profileRepository;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          ProfileService profileService,
                          ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.profileService = profileService;
        this.profileRepository = profileRepository;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        // Debug logging
        System.out.println("Received registration request:");
        System.out.println("Username: " + request.getUsername());
        System.out.println("Email: " + request.getEmail());
        System.out.println("FirstName: '" + request.getFirstName() + "'");
        System.out.println("LastName: '" + request.getLastName() + "'");
        System.out.println("Phone: " + request.getPhoneNumber());
        
        // 1️⃣ Create and save user with default USER role
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName() != null && !request.getFirstName().trim().isEmpty() 
                          ? request.getFirstName().trim() : "Unknown")
                .lastName(request.getLastName() != null && !request.getLastName().trim().isEmpty() 
                         ? request.getLastName().trim() : "User")
                .phone(request.getPhoneNumber())
                .role(Role.USER)  // Always default to USER role
                .build();
        User savedUser = userRepository.save(user);

        // 2️⃣ Create and save profile
        Profile profile = Profile.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .user(savedUser)
                .build();
        profileService.createProfile(profile);

        return "User registered successfully with role: USER and profile!";
    }


    // ✅ Login
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );
        
        // Get user details for token generation
        User authenticatedUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return jwtUtil.generateToken(authenticatedUser.getUsername(), authenticatedUser.getId(), authenticatedUser.getRole().toString());
    }

    // ✅ Get current user + profile
    @GetMapping("/me")
    public UserProfileResponse getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Profile profile = profileRepository.findByUser(user)
                .orElse(null);

        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().toString(),
                profile != null ? profile.getFirstName() : null,
                profile != null ? profile.getLastName() : null,
                profile != null ? profile.getPhoneNumber() : null
        );
    }
    // ✅ Update profile
    @PutMapping("/update-profile")
    public String updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                @RequestBody UpdateProfileRequest request) {

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update user info
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);

        // Update profile info
        Profile profile = profileRepository.findByUser(user)
                .orElse(new Profile());
        profile.setUser(user);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhoneNumber(request.getPhoneNumber());
        profileRepository.save(profile);

        return "Profile updated successfully!";
    }


    // ✅ Forgot password (basic simulation — you can later integrate email)
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        User user = userRepository.findAll()
                .stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Email not found"));

        // Generate a temporary password
        String tempPassword = "Temp@" + System.currentTimeMillis() % 10000;
        user.setPassword(passwordEncoder.encode(tempPassword));
        userRepository.save(user);

        // For demo: print to console or return it (in real system, send email)
        System.out.println("Temporary password for " + email + ": " + tempPassword);
        return "Temporary password sent to your email (check console).";
    }

}






