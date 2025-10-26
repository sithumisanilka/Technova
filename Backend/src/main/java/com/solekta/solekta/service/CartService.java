package com.solekta.solekta.service;

import com.solekta.solekta.dto.CartDTO;
import com.solekta.solekta.dto.CartItemDTO;
import com.solekta.solekta.exception.ResourceNotFoundException;
import com.solekta.solekta.model.CartItem;
import com.solekta.solekta.model.Product;
import com.solekta.solekta.model.RentalService;
import com.solekta.solekta.model.ShoppingCart;
import com.solekta.solekta.repository.CartItemRepository;
import com.solekta.solekta.repository.ProductRepository;
import com.solekta.solekta.repository.ServiceRepository;
import com.solekta.solekta.repository.ShoppingCartRepository;
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
    private final ServiceRepository serviceRepository;
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
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setTotalPrice(existingItem.getUnitPrice().multiply(BigDecimal.valueOf(existingItem.getQuantity())));
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .productId(productId)
                    .productName(product.getProductName())
                    .productSku(product.getCategory() != null ? product.getCategory().getCategoryName() : "N/A")
                    .quantity(quantity)
                    .unitPrice(unitPrice)
                    .totalPrice(unitPrice.multiply(BigDecimal.valueOf(quantity)))
                    .build();
            cartItemRepository.save(newItem);
        }

        log.info("Added item {} to cart for customer {}", productId, customerId);
        return getCartByCustomerId(customerId);
    }

    public CartDTO updateCartItem(Long customerId, Long productId, Integer quantity) {
        ShoppingCart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItem.setTotalPrice(cartItem.getUnitPrice().multiply(BigDecimal.valueOf(quantity)));
            cartItemRepository.save(cartItem);
        }

        log.info("Updated cart item {} for customer {}", productId, customerId);
        return getCartByCustomerId(customerId);
    }

    public void removeItemFromCart(Long customerId, Long productId) {
        ShoppingCart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cartItemRepository.deleteByCartIdAndProductId(cart.getId(), productId);
        log.info("Removed item {} from cart for customer {}", productId, customerId);
    }

    public CartDTO addServiceToCart(Long customerId, Long serviceId, Integer rentalPeriod,
                                    RentalService.RentalPeriodType periodType, BigDecimal unitPrice) {
        ShoppingCart cart = cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> createNewCart(customerId));

        // Fetch service details
        RentalService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + serviceId));

        // Check if service is already in cart
        CartItem existingItem = cartItemRepository.findByCartIdAndServiceId(cart.getId(), serviceId)
                .orElse(null);

        if (existingItem != null) {
            // Update existing service rental
            existingItem.setRentalPeriod(rentalPeriod);
            existingItem.setRentalPeriodType(periodType);
            existingItem.calculateTotalPrice();
            cartItemRepository.save(existingItem);
        } else {
            // Add new service rental to cart
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .itemType(CartItem.ItemType.SERVICE)
                    .productId(-1L)  // Temporary workaround for NOT NULL constraint
                    .serviceId(serviceId)
                    .serviceName(service.getServiceName())
                    .rentalPeriod(rentalPeriod)
                    .rentalPeriodType(periodType)
                    .unitPrice(unitPrice)
                    .quantity(1)  // Temporary workaround for NOT NULL constraint
                    .build();
            cartItem.calculateTotalPrice();
            cartItemRepository.save(cartItem);
        }

        log.info("Added service {} to cart for customer {} with rental period {} {}",
                serviceId, customerId, rentalPeriod, periodType);
        return convertToDTO(cart);
    }

    public CartDTO removeServiceFromCart(Long customerId, Long serviceId) {
        ShoppingCart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem cartItem = cartItemRepository.findByCartIdAndServiceId(cart.getId(), serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found in cart"));

        cartItemRepository.delete(cartItem);
        log.info("Removed service {} from cart for customer {}", serviceId, customerId);
        return convertToDTO(cart);
    }

    public void clearCart(Long customerId) {
        ShoppingCart cart = cartRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

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
        dto.setItemType(cartItem.getItemType());
        dto.setUnitPrice(cartItem.getUnitPrice());
        dto.setTotalPrice(cartItem.getTotalPrice());

        if (cartItem.isProduct()) {
            // Handle product cart items
            dto.setProductId(cartItem.getProductId());
            dto.setQuantity(cartItem.getQuantity());

            // Fetch product details from ProductRepository
            try {
                Product product = productRepository.findById(cartItem.getProductId()).orElse(null);
                if (product != null) {
                    dto.setProductName(product.getProductName());
                    // Use category name instead of toString() to avoid circular reference
                    dto.setProductSku(product.getCategory() != null ? product.getCategory().getCategoryName() : "N/A");
                } else {
                    dto.setProductName("Unknown Product");
                    dto.setProductSku("N/A");
                }
            } catch (Exception e) {
                log.warn("Failed to fetch product details for productId: {}", cartItem.getProductId(), e);
                dto.setProductName("Unknown Product");
                dto.setProductSku("N/A");
            }
        } else if (cartItem.isService()) {
            // Handle service cart items
            dto.setServiceId(cartItem.getServiceId());
            dto.setRentalPeriod(cartItem.getRentalPeriod());
            dto.setRentalPeriodType(cartItem.getRentalPeriodType());

            // Fetch service details from ServiceRepository
            try {
                RentalService service = serviceRepository.findById(cartItem.getServiceId()).orElse(null);
                if (service != null) {
                    dto.setServiceName(service.getServiceName());
                } else {
                    dto.setServiceName("Unknown Service");
                }
            } catch (Exception e) {
                log.warn("Failed to fetch service details for serviceId: {}", cartItem.getServiceId(), e);
                dto.setServiceName("Unknown Service");
            }
        }

        return dto;
    }
}
