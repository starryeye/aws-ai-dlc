package com.tableorder.auth.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "store_users", uniqueConstraints = @UniqueConstraint(columnNames = {"storeId", "username"}))
public class StoreUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long storeId;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 20)
    private String role = "ADMIN";

    @Column(nullable = false)
    private Integer loginAttempts = 0;

    private LocalDateTime lockedUntil;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public StoreUser() {}

    public StoreUser(Long storeId, String username, String password) {
        this.storeId = storeId;
        this.username = username;
        this.password = password;
    }

    public Long getId() { return id; }
    public Long getStoreId() { return storeId; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public Integer getLoginAttempts() { return loginAttempts; }
    public void setLoginAttempts(Integer loginAttempts) { this.loginAttempts = loginAttempts; }
    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }
}
