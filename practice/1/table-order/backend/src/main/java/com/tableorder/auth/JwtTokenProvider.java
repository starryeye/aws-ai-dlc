package com.tableorder.auth;

import com.tableorder.auth.dto.UserInfo;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long expiration;

    public JwtTokenProvider(@Value("${jwt.secret}") String secret,
                            @Value("${jwt.expiration}") long expiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration * 1000;
    }

    public String generateToken(Long storeId, String role, Long tableId, Long userId, Long sessionId) {
        Date now = new Date();
        var builder = Jwts.builder()
                .subject(storeId.toString())
                .claim("role", role)
                .claim("storeId", storeId)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiration))
                .signWith(key);
        if (tableId != null) builder.claim("tableId", tableId);
        if (userId != null) builder.claim("userId", userId);
        if (sessionId != null) builder.claim("sessionId", sessionId);
        return builder.compact();
    }

    public UserInfo validateToken(String token) {
        Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        Long storeId = claims.get("storeId", Long.class);
        String role = claims.get("role", String.class);
        Long tableId = claims.get("tableId", Long.class);
        String username = claims.getSubject();
        return new UserInfo(storeId, role, tableId, username);
    }

    public long getExpirationSeconds() {
        return expiration / 1000;
    }
}
