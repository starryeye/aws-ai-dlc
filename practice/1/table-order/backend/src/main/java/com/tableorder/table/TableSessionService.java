package com.tableorder.table;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tableorder.order.entity.Order;
import com.tableorder.order.entity.OrderHistory;
import com.tableorder.order.entity.OrderItem;
import com.tableorder.order.repository.OrderHistoryRepository;
import com.tableorder.order.repository.OrderRepository;
import com.tableorder.sse.SseService;
import com.tableorder.sse.dto.OrderEvent;
import com.tableorder.table.entity.TableEntity;
import com.tableorder.table.entity.TableSession;
import com.tableorder.table.repository.TableRepository;
import com.tableorder.table.repository.TableSessionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class TableSessionService {

    private final TableRepository tableRepository;
    private final TableSessionRepository sessionRepository;
    private final OrderRepository orderRepository;
    private final OrderHistoryRepository historyRepository;
    private final SseService sseService;
    private final ObjectMapper objectMapper;

    public TableSessionService(TableRepository tableRepository, TableSessionRepository sessionRepository,
                               OrderRepository orderRepository, OrderHistoryRepository historyRepository,
                               SseService sseService, ObjectMapper objectMapper) {
        this.tableRepository = tableRepository;
        this.sessionRepository = sessionRepository;
        this.orderRepository = orderRepository;
        this.historyRepository = historyRepository;
        this.sseService = sseService;
        this.objectMapper = objectMapper;
    }

    public List<TableEntity> getTables(Long storeId) {
        return tableRepository.findByStoreId(storeId);
    }

    @Transactional
    public void completeSession(Long storeId, Long tableId) {
        TableEntity table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "테이블을 찾을 수 없습니다"));

        TableSession session = sessionRepository.findByTableIdAndActiveTrue(tableId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "활성 세션이 없습니다"));

        List<Order> orders = orderRepository.findBySessionId(session.getId());
        LocalDateTime now = LocalDateTime.now();

        for (Order order : orders) {
            OrderHistory history = new OrderHistory();
            history.setStoreId(storeId);
            history.setTableId(tableId);
            history.setTableNumber(table.getTableNumber());
            history.setOrderNumber(order.getOrderNumber());
            history.setSessionUuid(session.getSessionUuid());
            try {
                history.setItems(objectMapper.writeValueAsString(order.getItems()));
            } catch (JsonProcessingException e) {
                history.setItems("[]");
            }
            history.setTotalAmount(order.getTotalAmount());
            history.setStatus(order.getStatus());
            history.setOrderedAt(order.getCreatedAt());
            history.setCompletedAt(now);
            historyRepository.save(history);
        }

        orderRepository.deleteAll(orders);
        session.setActive(false);
        session.setCompletedAt(now);
        sessionRepository.save(session);

        sseService.publishOrderEvent(storeId, new OrderEvent("TABLE_COMPLETED", null, tableId, table.getTableNumber(), null));
    }

    public List<OrderHistory> getTableHistory(Long storeId, Long tableId, LocalDate dateFrom, LocalDate dateTo) {
        if (dateFrom != null && dateTo != null) {
            return historyRepository.findByStoreIdAndTableIdAndCompletedAtBetweenOrderByCompletedAtDesc(
                    storeId, tableId, dateFrom.atStartOfDay(), dateTo.atTime(LocalTime.MAX));
        }
        return historyRepository.findByStoreIdAndTableIdOrderByCompletedAtDesc(storeId, tableId);
    }
}
