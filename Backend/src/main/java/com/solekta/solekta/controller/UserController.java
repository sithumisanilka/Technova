package com.solekta.solekta.controller;

import com.solekta.solekta.model.User;
import com.solekta.solekta.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.solekta.solekta.model.UserDTO;
import org.springframework.security.core.annotation.AuthenticationPrincipal;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
    @GetMapping("/me")
    public UserDTO getCurrentUser(@AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername()); // fetch from DB
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }

}



