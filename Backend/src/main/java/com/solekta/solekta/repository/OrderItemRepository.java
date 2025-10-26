package com.solekta.solekta.repository;

import com.solekta.solekta.model.OrderItem;
import com.solekta.solekta.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Order order);
    List<OrderItem> findByProductId(Long productId);
}