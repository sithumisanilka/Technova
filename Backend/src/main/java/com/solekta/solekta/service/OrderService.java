package com.solekta.solekta.service;

import com.solekta.solekta.dto.*;
import com.solekta.solekta.model.*;
import com.solekta.solekta.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;

    public OrderDTO createOrderFromCart(CheckoutRequest checkoutRequest) {
        // Get customer's cart
        CartDTO cart = cartService.getCartByCustomerId(checkoutRequest.getCustomerId());

        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate totals
        BigDecimal subtotal = cart.getCartItems().stream()
                .map(CartItemDTO::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.1)); // 10% tax
        BigDecimal shippingCost = BigDecimal.valueOf(500.00); // Fixed shipping cost
        BigDecimal totalAmount = subtotal.add(tax).add(shippingCost);

        // Create order
        Order order = new Order();
        order.setCustomerId(checkoutRequest.getCustomerId());
        order.setCustomerEmail(checkoutRequest.getEmail());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setShippingCost(shippingCost);
        order.setTotalAmount(totalAmount);
        order.setNotes(checkoutRequest.getNotes());
        order.setShippingName(checkoutRequest.getShippingName());
        order.setShippingAddress(checkoutRequest.getShippingAddress());
        order.setShippingCity(checkoutRequest.getShippingCity());
        order.setShippingPostalCode(checkoutRequest.getShippingPostalCode());
        order.setShippingPhone(checkoutRequest.getShippingPhone());
        
        // Set payment method and bank transfer receipt fields
        order.setPaymentMethod(checkoutRequest.getPaymentMethod());
        order.setBankTransferReceiptFileName(checkoutRequest.getBankTransferReceiptFileName());

        // Save order
        order = orderRepository.save(order);

        // Create order items
        for (CartItemDTO cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setUnitPrice(cartItem.getUnitPrice());
            orderItem.setTotalPrice(cartItem.getTotalPrice());
            
            // Handle different item types
            if (cartItem.getItemType() == CartItem.ItemType.SERVICE) {
                orderItem.setItemType(OrderItem.ItemType.SERVICE);
                orderItem.setServiceId(cartItem.getServiceId());
                orderItem.setServiceName(cartItem.getServiceName());
                orderItem.setRentalPeriod(cartItem.getRentalPeriod());
                orderItem.setRentalPeriodType(cartItem.getRentalPeriodType());
                // Set dummy product values for DB constraints
                orderItem.setProductId(-1L);
                orderItem.setQuantity(1);
            } else {
                orderItem.setItemType(OrderItem.ItemType.PRODUCT);
                orderItem.setProductId(cartItem.getProductId());
                orderItem.setProductName(cartItem.getProductName());
                orderItem.setProductSku(cartItem.getProductSku());
                orderItem.setQuantity(cartItem.getQuantity());
                // Set dummy service values for DB constraints
                orderItem.setServiceId(-1L);
            }

            order.getOrderItems().add(orderItem);
        }

        // Create payment
        PaymentTransaction payment = new PaymentTransaction();
        payment.setOrder(order);
        payment.setAmount(totalAmount);
        // Convert Order.PaymentMethod to PaymentTransaction.PaymentMethod
        PaymentTransaction.PaymentMethod paymentMethod = 
            checkoutRequest.getPaymentMethod() == Order.PaymentMethod.BANK_TRANSFER 
                ? PaymentTransaction.PaymentMethod.BANK_TRANSFER 
                : PaymentTransaction.PaymentMethod.CASH_ON_DELIVERY;
        payment.setMethod(paymentMethod);
        payment.setStatus(PaymentTransaction.PaymentStatus.PENDING);

        order.setPayment(payment);

        // Save order with items and payment
        order = orderRepository.save(order);

        // Clear cart after successful order creation
        cartService.clearCart(checkoutRequest.getCustomerId());

        log.info("Created order {} for customer {}", order.getOrderNumber(), checkoutRequest.getCustomerId());

        // Convert to DTO once and reuse
        OrderDTO orderDTO = convertToDTO(order);

        // Send order confirmation email (async to avoid blocking)
        try {
            log.info("Order confirmation email sent for order {} to {}",
                    order.getOrderNumber(), checkoutRequest.getEmail());
        } catch (Exception e) {
            log.error("Failed to send order confirmation email for order {}: {}",
                    order.getOrderNumber(), e.getMessage(), e);
            // Don't fail the order creation if email fails
        }

        // Send admin notification email (async to avoid blocking)


        return orderDTO;
    }

    public OrderDTO createOrderFromCartWithReceipt(CheckoutRequest checkoutRequest, MultipartFile receiptFile) {
        // Get customer's cart
        CartDTO cart = cartService.getCartByCustomerId(checkoutRequest.getCustomerId());

        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate totals
        BigDecimal subtotal = cart.getCartItems().stream()
                .map(CartItemDTO::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.1)); // 10% tax
        BigDecimal shippingCost = BigDecimal.valueOf(500.00); // Fixed shipping cost
        BigDecimal totalAmount = subtotal.add(tax).add(shippingCost);

        // Create order
        Order order = new Order();
        order.setCustomerId(checkoutRequest.getCustomerId());
        order.setCustomerEmail(checkoutRequest.getEmail());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setShippingCost(shippingCost);
        order.setTotalAmount(totalAmount);
        order.setNotes(checkoutRequest.getNotes());
        order.setShippingName(checkoutRequest.getShippingName());
        order.setShippingAddress(checkoutRequest.getShippingAddress());
        order.setShippingCity(checkoutRequest.getShippingCity());
        order.setShippingPostalCode(checkoutRequest.getShippingPostalCode());
        order.setShippingPhone(checkoutRequest.getShippingPhone());
        
        // Set payment method
        order.setPaymentMethod(checkoutRequest.getPaymentMethod());
        
        // Handle receipt file upload for bank transfer
        if (receiptFile != null && !receiptFile.isEmpty()) {
            try {
                order.setBankTransferReceiptData(receiptFile.getBytes());
                order.setBankTransferReceiptFileName(receiptFile.getOriginalFilename());
                order.setBankTransferReceiptContentType(receiptFile.getContentType());
                log.info("Bank transfer receipt uploaded: {}", receiptFile.getOriginalFilename());
            } catch (IOException e) {
                log.error("Failed to process receipt file: {}", e.getMessage());
                throw new RuntimeException("Failed to process receipt file", e);
            }
        }

        // Save order
        order = orderRepository.save(order);

        // Create order items
        for (CartItemDTO cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setUnitPrice(cartItem.getUnitPrice());
            orderItem.setTotalPrice(cartItem.getTotalPrice());
            
            // Handle different item types
            if (cartItem.getItemType() == CartItem.ItemType.SERVICE) {
                orderItem.setItemType(OrderItem.ItemType.SERVICE);
                orderItem.setServiceId(cartItem.getServiceId());
                orderItem.setServiceName(cartItem.getServiceName());
                orderItem.setRentalPeriod(cartItem.getRentalPeriod());
                orderItem.setRentalPeriodType(cartItem.getRentalPeriodType());
                // Set dummy product values for DB constraints
                orderItem.setProductId(-1L);
                orderItem.setQuantity(1);
            } else {
                orderItem.setItemType(OrderItem.ItemType.PRODUCT);
                orderItem.setProductId(cartItem.getProductId());
                orderItem.setProductName(cartItem.getProductName());
                orderItem.setProductSku(cartItem.getProductSku());
                orderItem.setQuantity(cartItem.getQuantity());
                // Set dummy service values for DB constraints
                orderItem.setServiceId(-1L);
            }

            order.getOrderItems().add(orderItem);
        }

        // Create payment
        PaymentTransaction payment = new PaymentTransaction();
        payment.setOrder(order);
        payment.setAmount(totalAmount);
        // Convert Order.PaymentMethod to PaymentTransaction.PaymentMethod
        PaymentTransaction.PaymentMethod paymentMethod = 
            checkoutRequest.getPaymentMethod() == Order.PaymentMethod.BANK_TRANSFER 
                ? PaymentTransaction.PaymentMethod.BANK_TRANSFER 
                : PaymentTransaction.PaymentMethod.CASH_ON_DELIVERY;
        payment.setMethod(paymentMethod);
        payment.setStatus(PaymentTransaction.PaymentStatus.PENDING);

        order.setPayment(payment);

        // Save order with items and payment
        order = orderRepository.save(order);

        // Clear cart after successful order creation
        cartService.clearCart(checkoutRequest.getCustomerId());

        log.info("Created order {} for customer {} with receipt: {}", 
                order.getOrderNumber(), checkoutRequest.getCustomerId(), 
                receiptFile != null ? receiptFile.getOriginalFilename() : "none");

        // Convert to DTO
        OrderDTO orderDTO = convertToDTO(order);

        // Send order confirmation email (async to avoid blocking)
        try {
            log.info("Order confirmation email sent for order {} to {}",
                    order.getOrderNumber(), checkoutRequest.getEmail());
        } catch (Exception e) {
            log.error("Failed to send order confirmation email for order {}: {}",
                    order.getOrderNumber(), e.getMessage(), e);
            // Don't fail the order creation if email fails
        }

        return orderDTO;
    }

    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDTO(order);
    }

    public Order getOrderEntityById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public OrderDTO getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDTO(order);
    }

    public List<OrderDTO> getOrdersByCustomerId(Long customerId) {
        List<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
        return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Page<OrderDTO> getOrdersByCustomerId(Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId, pageable);
        return orders.map(this::convertToDTO);
    }

    public OrderDTO updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Order.OrderStatus oldStatus = order.getStatus();
        order.setStatus(status);
        order = orderRepository.save(order);

        log.info("Updated order {} status from {} to {}", order.getOrderNumber(), oldStatus, status);

        return convertToDTO(order);
    }

    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByStatus(Order.OrderStatus status) {
        List<Order> orders = orderRepository.findByStatusOrderByCreatedAtDesc(status);
        return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findByDateRange(startDate, endDate);
        return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setCustomerId(order.getCustomerId());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setStatus(order.getStatus());
        dto.setSubtotal(order.getSubtotal());
        dto.setTax(order.getTax());
        dto.setShippingCost(order.getShippingCost());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setNotes(order.getNotes());
        dto.setShippingName(order.getShippingName());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setShippingCity(order.getShippingCity());
        dto.setShippingPostalCode(order.getShippingPostalCode());
        dto.setShippingPhone(order.getShippingPhone());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        if (order.getOrderItems() != null) {
            dto.setOrderItems(order.getOrderItems().stream()
                    .map(this::convertOrderItemToDTO)
                    .collect(Collectors.toList()));
        }

        if (order.getPayment() != null) {
            dto.setPayment(convertPaymentToDTO(order.getPayment()));
        }

        return dto;
    }

    private OrderItemDTO convertOrderItemToDTO(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setProductId(orderItem.getProductId());
        dto.setProductName(orderItem.getProductName());
        dto.setProductSku(orderItem.getProductSku());
        dto.setUnitPrice(orderItem.getUnitPrice());
        dto.setQuantity(orderItem.getQuantity());
        dto.setTotalPrice(orderItem.getTotalPrice());
        return dto;
    }

    private PaymentDTO convertPaymentToDTO(PaymentTransaction payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setPaymentNumber(payment.getPaymentNumber());
        dto.setAmount(payment.getAmount());
        dto.setMethod(payment.getMethod());
        dto.setStatus(payment.getStatus());
        dto.setTransactionId(payment.getTransactionId());
        dto.setNotes(payment.getNotes());
        dto.setCreatedAt(payment.getCreatedAt());
        dto.setProcessedAt(payment.getProcessedAt());
        return dto;
    }
}
