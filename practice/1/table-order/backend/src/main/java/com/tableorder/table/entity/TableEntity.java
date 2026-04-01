package com.tableorder.table.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tables", uniqueConstraints = @UniqueConstraint(columnNames = {"storeId", "tableNumber"}))
public class TableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long storeId;

    @Column(nullable = false, length = 20)
    private String tableNumber;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public TableEntity() {}

    public TableEntity(Long storeId, String tableNumber, String password) {
        this.storeId = storeId;
        this.tableNumber = tableNumber;
        this.password = password;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStoreId() { return storeId; }
    public String getTableNumber() { return tableNumber; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
