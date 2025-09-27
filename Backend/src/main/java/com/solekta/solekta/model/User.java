package com.solekta.solekta.model;

import jakarta.persistence.*;   // if using Spring Boot 3.x (Jakarta EE)
import lombok.*;              // optional, if you use Lombok

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    private String role;  // e.g., ADMIN, USER
}

