package com.solekta.solekta.controller;

import com.solekta.solekta.dto.CartDTO;
import com.solekta.solekta.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{customerId}")
    public ResponseEntity<CartDTO> getCart(@PathVariable Long customerId) {
        CartDTO cart = cartService.getCartByCustomerId(customerId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/{customerId}/items")
    public ResponseEntity<CartDTO> addItemToCart(
            @PathVariable Long customerId,
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestParam BigDecimal unitPrice) {
        CartDTO cart = cartService.addItemToCart(customerId, productId, quantity, unitPrice);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/{customerId}/items/{productId}")
    public ResponseEntity<CartDTO> updateCartItem(
            @PathVariable Long customerId,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        CartDTO cart = cartService.updateCartItem(customerId, productId, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/{customerId}/items/{productId}")
    public ResponseEntity<Void> removeItemFromCart(
            @PathVariable Long customerId,
            @PathVariable Long productId) {
        cartService.removeItemFromCart(customerId, productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long customerId) {
        cartService.clearCart(customerId);
        return ResponseEntity.noContent().build();
    }
}

