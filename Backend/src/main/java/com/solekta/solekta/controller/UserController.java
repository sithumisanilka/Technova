package com.solekta.solekta.controller;

import com.solekta.solekta.model.User;
import com.solekta.solekta.model.UserDTO;
import com.solekta.solekta.service.UserService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ Only ADMINs can view all users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // ✅ Only ADMINs can view specific users by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // ✅ Only ADMINs can delete users
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    // ✅ Any authenticated user can view their own profile
    @GetMapping("/me")
    public UserDTO getCurrentUser(@AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRole().toString());
    }
}




