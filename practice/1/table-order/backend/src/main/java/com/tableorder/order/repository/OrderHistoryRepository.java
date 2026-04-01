package com.tableorder.order.repository;

import com.tableorder.order.entity.OrderHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Long> {
    List<OrderHistory> findByStoreIdAndTableIdOrderByCompletedAtDesc(Long storeId, Long tableId);
    List<OrderHistory> findByStoreIdAndTableIdAndCompletedAtBetweenOrderByCompletedAtDesc(
            Long storeId, Long tableId, LocalDateTime from, LocalDateTime to);
}
