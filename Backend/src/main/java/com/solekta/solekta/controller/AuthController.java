package com.solekta.solekta.controller;

import com.solekta.solekta.model.Profile;
import com.solekta.solekta.model.User;
import com.solekta.solekta.repository.UserRepository;
import com.solekta.solekta.security.JwtUtil;
import com.solekta.solekta.service.ProfileService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final ProfileService profileService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          ProfileService profileService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.profileService = profileService;
    }

    // User registration
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        // 1️⃣ Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        // 2️⃣ Auto-create profile
        Profile profile = Profile.builder()
                .user(savedUser)
                .firstName("")  // default empty values, can be updated later
                .lastName("")
                .phoneNumber("")
                .build();
        profileService.createProfile(profile);

        return "User registered successfully with profile!";
    }

    // User login
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        return jwtUtil.generateToken(user.getUsername());
    }
}




