//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.solekta.solekta.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "yourSecretKey";
    private final long EXPIRATION_TIME = 86400000L;

    public String generateToken(String username) {
        return Jwts.builder().setSubject(username).setIssuedAt(new Date(System.currentTimeMillis())).setExpiration(new Date(System.currentTimeMillis() + 86400000L)).signWith(SignatureAlgorithm.HS256, "yourSecretKey").compact();
    }

    public String extractUsername(String token) {
        return ((Claims)Jwts.parser().setSigningKey("yourSecretKey").parseClaimsJws(token).getBody()).getSubject();
    }

    public boolean validateToken(String token, String username) {
        String extractedUsername = this.extractUsername(token);
        return extractedUsername.equals(username) && !this.isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = ((Claims)Jwts.parser().setSigningKey("yourSecretKey").parseClaimsJws(token).getBody()).getExpiration();
        return expiration.before(new Date());
    }
}



