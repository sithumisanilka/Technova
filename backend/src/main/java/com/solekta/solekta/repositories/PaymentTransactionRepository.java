package com.solekta.solekta.repositories;

import com.solekta.solekta.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Optional<PaymentTransaction> findByPaymentNumber(String paymentNumber);
    Optional<PaymentTransaction> findByOrderId(Long orderId);
    List<PaymentTransaction> findByStatusOrderByCreatedAtDesc(PaymentTransaction.PaymentStatus status);
}
