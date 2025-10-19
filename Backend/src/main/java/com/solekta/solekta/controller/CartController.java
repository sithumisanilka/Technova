package com.solekta.solekta.controller;

import com.solekta.solekta.dto.CartDTO;
import com.solekta.solekta.dto.AddCartItemRequest;
import com.solekta.solekta.dto.AddServiceRequest;
import com.solekta.solekta.dto.UpdateCartItemRequest;
import com.solekta.solekta.dto.SyncCartRequest;
import com.solekta.solekta.service.CartService;
import com.solekta.solekta.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;
    private final JwtUtil jwtUtil;

    // Helper method to extract user ID from JWT token
    private Long extractUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping
    public ResponseEntity<CartDTO> getCart(HttpServletRequest request) {
        Long userId = extractUserIdFromRequest(request);
        CartDTO cart = cartService.getCartByCustomerId(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    public ResponseEntity<CartDTO> addItemToCart(
            HttpServletRequest request,
            @RequestBody AddCartItemRequest requestBody) {
        Long userId = extractUserIdFromRequest(request);
        CartDTO cart = cartService.addItemToCart(userId, requestBody.getProductId(), 
                requestBody.getQuantity(), requestBody.getUnitPrice());
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartDTO> updateCartItem(
            HttpServletRequest request,
            @PathVariable Long productId,
            @RequestBody UpdateCartItemRequest requestBody) {
        Long userId = extractUserIdFromRequest(request);
        CartDTO cart = cartService.updateCartItem(userId, productId, requestBody.getQuantity());
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeItemFromCart(
            HttpServletRequest request,
            @PathVariable Long productId) {
        Long userId = extractUserIdFromRequest(request);
        cartService.removeItemFromCart(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(HttpServletRequest request) {
        Long userId = extractUserIdFromRequest(request);
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/add-service")
    public ResponseEntity<CartDTO> addServiceToCart(
            HttpServletRequest request,
            @RequestBody AddServiceRequest addServiceRequest) {
        try {
            System.out.println("Received add service request: " + addServiceRequest);
            Long userId = extractUserIdFromRequest(request);
            System.out.println("User ID extracted: " + userId);
            CartDTO cart = cartService.addServiceToCart(
                    userId,
                    addServiceRequest.getServiceId(),
                    addServiceRequest.getRentalPeriod(),
                    addServiceRequest.getRentalPeriodType(),
                    addServiceRequest.getUnitPrice()
            );
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            // Log the error for debugging
            System.err.println("Error adding service to cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Unexpected error adding service to cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/remove-service/{serviceId}")
    public ResponseEntity<Void> removeServiceFromCart(
            HttpServletRequest request,
            @PathVariable Long serviceId) {
        Long userId = extractUserIdFromRequest(request);
        cartService.removeServiceFromCart(userId, serviceId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sync")
    public ResponseEntity<CartDTO> syncCart(
            HttpServletRequest request,
            @RequestBody SyncCartRequest syncRequest) {
        Long userId = extractUserIdFromRequest(request);
        // For now, just clear cart and return empty cart
        // You can implement proper sync logic based on your needs
        cartService.clearCart(userId);
        CartDTO cart = cartService.getCartByCustomerId(userId);
        return ResponseEntity.ok(cart);
    }
}

