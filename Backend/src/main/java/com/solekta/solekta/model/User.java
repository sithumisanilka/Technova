package com.solekta.solekta.model;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "first_name", nullable = true, columnDefinition = "VARCHAR(255) DEFAULT 'Unknown'")
    @Builder.Default
    private String firstName = "Unknown";

    @Column(name = "last_name", nullable = true, columnDefinition = "VARCHAR(255) DEFAULT 'User'")
    @Builder.Default  
    private String lastName = "User";

    private String phone;
    private String address;

    @Column(nullable = false)
    @Builder.Default
    private String role = "USER";

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
