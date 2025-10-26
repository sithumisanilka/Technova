package com.solekta.solekta.model;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "shopping_carts")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
@ToString(exclude = "cartItems")
@EqualsAndHashCode(exclude = "cartItems")
public class ShoppingCart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long customerId;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonManagedReference
    private List<CartItem> cartItems = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;



    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void addCartItem(CartItem item) {
        if (cartItems == null) {
            cartItems = new ArrayList<>();
        }
        cartItems.add(item);
        item.setCart(this);

    }



    public void removeCartItem(CartItem item) {
        cartItems.remove(item);
        item.setCart(null);
    }
}

