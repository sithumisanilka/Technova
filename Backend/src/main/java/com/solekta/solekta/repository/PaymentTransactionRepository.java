package com.solekta.solekta.repository;

import com.solekta.solekta.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByOrderId(Long orderId);
    List<PaymentTransaction> findAllByOrderId(Long orderId);
    Optional<PaymentTransaction> findByTransactionId(String transactionId);
    Optional<PaymentTransaction> findByPaymentNumber(String paymentNumber);
    List<PaymentTransaction> findByStatusOrderByCreatedAtDesc(PaymentTransaction.PaymentStatus status);
}