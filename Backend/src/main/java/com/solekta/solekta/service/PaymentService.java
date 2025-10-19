package com.solekta.solekta.service;

import com.solekta.solekta.dto.PaymentDTO;
import com.solekta.solekta.dto.PaymentRequest;
import com.solekta.solekta.exception.ResourceNotFoundException;
import com.solekta.solekta.model.Order;
import com.solekta.solekta.model.PaymentTransaction;
import com.solekta.solekta.repository.OrderRepository;
import com.solekta.solekta.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentService {

    private final PaymentTransactionRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentDTO processPayment(PaymentRequest paymentRequest) {
        Order order = orderRepository.findById(paymentRequest.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        PaymentTransaction payment = order.getPayment();
        if (payment == null) {
            throw new ResourceNotFoundException("Payment not found for order");
        }

        if (payment.getStatus() == PaymentTransaction.PaymentStatus.COMPLETED) {
            throw new ResourceNotFoundException("Payment already completed");
        }

        // Simulate payment processing
        payment.setStatus(PaymentTransaction.PaymentStatus.PROCESSING);
        payment.setNotes(paymentRequest.getNotes());
        paymentRepository.save(payment);

        // Simulate payment gateway response (for demo purposes)
        boolean paymentSuccess = simulatePaymentGateway(paymentRequest);

        if (paymentSuccess) {
            payment.setStatus(PaymentTransaction.PaymentStatus.COMPLETED);
            payment.setTransactionId("TXN-" + System.currentTimeMillis());
            payment.setProcessedAt(LocalDateTime.now());

            // Update order status
            order.setStatus(Order.OrderStatus.CONFIRMED);
            orderRepository.save(order);

            log.info("Payment completed for order {}", order.getOrderNumber());
        } else {
            payment.setStatus(PaymentTransaction.PaymentStatus.FAILED);
            payment.setNotes("Payment failed - " + (payment.getNotes() != null ? payment.getNotes() : ""));

            log.warn("Payment failed for order {}", order.getOrderNumber());
        }

        payment = paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    public PaymentDTO getPaymentById(Long paymentId) {
        PaymentTransaction payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return convertToDTO(payment);
    }

    public PaymentDTO getPaymentByOrderId(Long orderId) {
        PaymentTransaction payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order"));
        return convertToDTO(payment);
    }

    public PaymentDTO getPaymentByPaymentNumber(String paymentNumber) {
        PaymentTransaction payment = paymentRepository.findByPaymentNumber(paymentNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return convertToDTO(payment);
    }

    public List<PaymentDTO> getPaymentsByStatus(PaymentTransaction.PaymentStatus status) {
        List<PaymentTransaction> payments = paymentRepository.findByStatusOrderByCreatedAtDesc(status);
        return payments.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public PaymentDTO refundPayment(Long paymentId, String reason) {
        PaymentTransaction payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getStatus() != PaymentTransaction.PaymentStatus.COMPLETED) {
            throw new ResourceNotFoundException("Can only refund completed payments");
        }

        payment.setStatus(PaymentTransaction.PaymentStatus.REFUNDED);
        payment.setNotes((payment.getNotes() != null ? payment.getNotes() + " | " : "") +
                "Refunded: " + reason);
        payment.setProcessedAt(LocalDateTime.now());

        // Update order status
        Order order = payment.getOrder();
        order.setStatus(Order.OrderStatus.REFUNDED);
        orderRepository.save(order);

        payment = paymentRepository.save(payment);
        log.info("Payment refunded for order {}, reason: {}", order.getOrderNumber(), reason);

        return convertToDTO(payment);
    }

    private boolean simulatePaymentGateway(PaymentRequest request) {
        // Simulate different payment scenarios for demo
        Random random = new Random();

        switch (request.getPaymentMethod()) {
            case CASH_ON_DELIVERY:
                return true; // COD always succeeds
            case BANK_TRANSFER:
                return random.nextDouble() > 0.1; // 90% success rate
            case CREDIT_CARD:
            case DEBIT_CARD:
                // Simulate card validation
                if (request.getCardNumber() == null || request.getCardNumber().length() < 16) {
                    return false;
                }
                return random.nextDouble() > 0.05; // 95% success rate for valid cards
            case DIGITAL_WALLET:
                return random.nextDouble() > 0.02; // 98% success rate
            default:
                return false;
        }
    }

    private PaymentDTO convertToDTO(PaymentTransaction payment) {
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

