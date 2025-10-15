package com.solekta.solekta.controller;

import com.solekta.solekta.dto.PaymentDTO;
import com.solekta.solekta.dto.PaymentRequest;
import com.solekta.solekta.model.PaymentTransaction;
import com.solekta.solekta.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<PaymentDTO> processPayment(@RequestBody PaymentRequest paymentRequest) {
        PaymentDTO payment = paymentService.processPayment(paymentRequest);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Long paymentId) {
        PaymentDTO payment = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentDTO> getPaymentByOrderId(@PathVariable Long orderId) {
        PaymentDTO payment = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/number/{paymentNumber}")
    public ResponseEntity<PaymentDTO> getPaymentByPaymentNumber(@PathVariable String paymentNumber) {
        PaymentDTO payment = paymentService.getPaymentByPaymentNumber(paymentNumber);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByStatus(@PathVariable PaymentTransaction.PaymentStatus status) {
        List<PaymentDTO> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<PaymentDTO> refundPayment(
            @PathVariable Long paymentId,
            @RequestParam String reason) {
        PaymentDTO payment = paymentService.refundPayment(paymentId, reason);
        return ResponseEntity.ok(payment);
    }
}

