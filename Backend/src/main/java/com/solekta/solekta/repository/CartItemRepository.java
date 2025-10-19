package com.solekta.solekta.repository;

import com.solekta.solekta.model.CartItem;
import com.solekta.solekta.model.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCart(ShoppingCart cart);
    Optional<CartItem> findByCartAndProductId(ShoppingCart cart, Long productId);
    void deleteByCartAndProductId(ShoppingCart cart, Long productId);
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
    void deleteByCartIdAndProductId(Long cartId, Long productId);
    void deleteAllByCartId(Long cartId);
}