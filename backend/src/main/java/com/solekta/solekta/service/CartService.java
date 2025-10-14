package com.solekta.solekta.service;

import com.solekta.solekta.dto.CartDTO;
import com.solekta.solekta.dto.CartItemDTO;
import com.solekta.solekta.model.CartItem;
import com.solekta.solekta.model.Product;
import com.solekta.solekta.model.ShoppingCart;
import com.solekta.solekta.repositories.CartItemRepository;
import com.solekta.solekta.repositories.ProductRepository;
import com.solekta.solekta.repositories.ShoppingCartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CartService {

    private final ShoppingCartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    // Assume ProductService will be injected by Member 1
    // private final ProductService productService;

    public CartDTO getCartByCustomerId(Long customerId) {
        ShoppingCart cart = cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> createNewCart(customerId));
        return convertToDTO(cart);
    }

    public CartDTO addItemToCart(Long customerId, Long productId, Integer quantity, BigDecimal unitPrice) {
        ShoppingCart cart = cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> createNewCart(customerId));

        // Fetch product details
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .productId(productId)
                    .productName(product.getName())
                    .productSku(product.getModel()) // Using model as SKU for now
                    .quantity(quantity)
                    .unitPrice(unitPrice)
                    .build();
            cartItemRepository.save(newItem);
        }

        log.info("Added item {} to cart for customer {}", productId, customerId);
        return getCartByCustomerId(customerId);
    }

    public CartDTO updateCartItem(Long customerId, Long productId, Integer quantity) {
        ShoppingCart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        log.info("Updated cart item {} for customer {}", productId, customerId);
        return getCartByCustomerId(customerId);
    }

    public void removeItemFromCart(Long customerId, Long productId) {
        ShoppingCart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteByCartIdAndProductId(cart.getId(), productId);
        log.info("Removed item {} from cart for customer {}", productId, customerId);
    }

    public void clearCart(Long customerId) {
        ShoppingCart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteAllByCartId(cart.getId());
        log.info("Cleared cart for customer {}", customerId);
    }

    private ShoppingCart createNewCart(Long customerId) {
        ShoppingCart cart = new ShoppingCart(); // use no-args constructor
        cart.setCustomerId(customerId);
        return cartRepository.save(cart);
    }

    private CartDTO convertToDTO(ShoppingCart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setCustomerId(cart.getCustomerId());
        dto.setCreatedAt(cart.getCreatedAt());
        dto.setUpdatedAt(cart.getUpdatedAt());

        if (cart.getCartItems() != null) {
            dto.setCartItems(cart.getCartItems().stream()
                    .map(this::convertCartItemToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private CartItemDTO convertCartItemToDTO(CartItem cartItem) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(cartItem.getId());
        dto.setProductId(cartItem.getProductId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setUnitPrice(cartItem.getUnitPrice());
        dto.setTotalPrice(cartItem.getUnitPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));

        // Fetch product details from ProductRepository
        try {
            Product product = productRepository.findById(cartItem.getProductId()).orElse(null);
            if (product != null) {
                dto.setProductName(product.getName());
                dto.setProductSku(product.getModel()); // Using model as SKU for now
            }
        } catch (Exception e) {
            log.warn("Failed to fetch product details for productId: {}", cartItem.getProductId(), e);
            dto.setProductName("Unknown Product");
            dto.setProductSku("N/A");
        }

        return dto;
    }
}
