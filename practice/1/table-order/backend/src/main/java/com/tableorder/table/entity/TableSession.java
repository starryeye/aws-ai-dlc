package com.tableorder.table.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "table_sessions")
public class TableSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 36)
    private String sessionUuid;

    @Column(nullable = false)
    private Long storeId;

    @Column(nullable = false)
    private Long tableId;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private LocalDateTime startedAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    public TableSession() {}

    public TableSession(String sessionUuid, Long storeId, Long tableId, LocalDateTime expiresAt) {
        this.sessionUuid = sessionUuid;
        this.storeId = storeId;
        this.tableId = tableId;
        this.expiresAt = expiresAt;
    }

    public Long getId() { return id; }
    public String getSessionUuid() { return sessionUuid; }
    public Long getStoreId() { return storeId; }
    public Long getTableId() { return tableId; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
}
