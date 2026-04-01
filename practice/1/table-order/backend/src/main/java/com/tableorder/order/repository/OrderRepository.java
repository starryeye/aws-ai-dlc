package com.tableorder.order.repository;

import com.tableorder.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStoreIdAndSessionIdOrderByCreatedAt(Long storeId, Long sessionId);
    Optional<Order> findByIdAndStoreId(Long id, Long storeId);
    List<Order> findBySessionId(Long sessionId);
    void deleteBySessionId(Long sessionId);

    @Query("SELECT o FROM Order o WHERE o.storeId = :storeId AND o.sessionId IN " +
           "(SELECT ts.id FROM TableSession ts WHERE ts.storeId = :storeId AND ts.active = true) " +
           "ORDER BY o.createdAt DESC")
    List<Order> findActiveOrdersByStoreId(Long storeId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.storeId = :storeId AND o.orderNumber LIKE :prefix%")
    long countByStoreIdAndOrderNumberPrefix(Long storeId, String prefix);
}
