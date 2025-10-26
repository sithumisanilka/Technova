package com.solekta.solekta.controller;

import com.solekta.solekta.dto.CheckoutRequest;
import com.solekta.solekta.dto.OrderDTO;
import com.solekta.solekta.model.Order;
import com.solekta.solekta.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody CheckoutRequest checkoutRequest) {
        OrderDTO order = orderService.createOrderFromCart(checkoutRequest);
        return ResponseEntity.ok(order);
    }

    @PostMapping(value = "/with-receipt", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OrderDTO> createOrderWithReceipt(
            @RequestParam("customerId") Long customerId,
            @RequestParam("email") String email,
            @RequestParam("shippingName") String shippingName,
            @RequestParam("shippingAddress") String shippingAddress,
            @RequestParam("shippingCity") String shippingCity,
            @RequestParam("shippingPostalCode") String shippingPostalCode,
            @RequestParam("shippingPhone") String shippingPhone,
            @RequestParam("paymentMethod") Order.PaymentMethod paymentMethod,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam(value = "receiptFile", required = false) MultipartFile receiptFile) {
        
        CheckoutRequest checkoutRequest = new CheckoutRequest();
        checkoutRequest.setCustomerId(customerId);
        checkoutRequest.setEmail(email);
        checkoutRequest.setShippingName(shippingName);
        checkoutRequest.setShippingAddress(shippingAddress);
        checkoutRequest.setShippingCity(shippingCity);
        checkoutRequest.setShippingPostalCode(shippingPostalCode);
        checkoutRequest.setShippingPhone(shippingPhone);
        checkoutRequest.setPaymentMethod(paymentMethod);
        checkoutRequest.setNotes(notes);
        
        OrderDTO order = orderService.createOrderFromCartWithReceipt(checkoutRequest, receiptFile);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderDTO> checkout(@Valid @RequestBody CheckoutRequest checkoutRequest) {
        OrderDTO order = orderService.createOrderFromCart(checkoutRequest);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        OrderDTO order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderDTO> getOrderByOrderNumber(@PathVariable String orderNumber) {
        OrderDTO order = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByCustomerId(@PathVariable Long customerId) {
        List<OrderDTO> orders = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/customer/{customerId}/paginated")
    public ResponseEntity<Page<OrderDTO>> getOrdersByCustomerIdPaginated(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderDTO> orders = orderService.getOrdersByCustomerId(customerId, page, size);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam Order.OrderStatus status) {
        OrderDTO order = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable Order.OrderStatus status) {
        List<OrderDTO> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<OrderDTO>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<OrderDTO> orders = orderService.getOrdersByDateRange(startDate, endDate);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}/receipt")
    public ResponseEntity<byte[]> getOrderReceipt(@PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderEntityById(orderId);
            
            if (order.getBankTransferReceiptData() == null) {
                return ResponseEntity.notFound().build();
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(order.getBankTransferReceiptContentType()));
            headers.setContentDispositionFormData("attachment", order.getBankTransferReceiptFileName());
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(order.getBankTransferReceiptData());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

