package com.tableorder.order;

import com.tableorder.order.dto.OrderItemRequest;
import com.tableorder.order.dto.OrderRequest;
import com.tableorder.order.dto.OrderResponse;
import com.tableorder.order.entity.Order;
import com.tableorder.order.entity.OrderItem;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

@Service
public class OrderService {

    private static final Set<String> VALID_STATUSES = Set.of("PENDING", "PREPARING", "COMPLETED");
    private final OrderRepository orderRepository;
    private final TableSessionRepository sessionRepository;
    private final TableRepository tableRepository;
    private final SseService sseService;

    public OrderService(OrderRepository orderRepository, TableSessionRepository sessionRepository,
                        TableRepository tableRepository, SseService sseService) {
        this.orderRepository = orderRepository;
        this.sessionRepository = sessionRepository;
        this.tableRepository = tableRepository;
        this.sseService = sseService;
    }

    @Transactional
    public OrderResponse createOrder(Long storeId, OrderRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "주문 항목이 비어있습니다");
        }

        TableSession session = sessionRepository.findByTableIdAndActiveTrue(request.tableId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "활성 세션이 없습니다"));
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "세션이 만료되었습니다");
        }

        String orderNumber = generateOrderNumber(storeId);
        BigDecimal totalAmount = BigDecimal.ZERO;

        Order order = new Order();
        order.setStoreId(storeId);
        order.setTableId(request.tableId());
        order.setSessionId(session.getId());
        order.setOrderNumber(orderNumber);

        for (OrderItemRequest itemReq : request.items()) {
            OrderItem item = new OrderItem();
            item.setMenuId(itemReq.menuId());
            item.setMenuName(itemReq.menuName());
            item.setQuantity(itemReq.quantity());
            item.setUnitPrice(itemReq.unitPrice());
            BigDecimal subtotal = itemReq.unitPrice().multiply(BigDecimal.valueOf(itemReq.quantity()));
            item.setSubtotal(subtotal);
            totalAmount = totalAmount.add(subtotal);
            order.getItems().add(item);
        }
        order.setTotalAmount(totalAmount);
        Order saved = orderRepository.save(order);

        // Set orderId on items after save
        for (OrderItem item : saved.getItems()) {
            item.setOrderId(saved.getId());
        }
        orderRepository.save(saved);

        TableEntity table = tableRepository.findById(request.tableId()).orElse(null);
        String tableNumber = table != null ? table.getTableNumber() : "";
        sseService.publishOrderEvent(storeId, new OrderEvent("NEW_ORDER", saved.getId(), request.tableId(), tableNumber, saved));

        return new OrderResponse(saved.getId(), saved.getOrderNumber(), saved.getTotalAmount(), saved.getStatus(), saved.getCreatedAt());
    }

    public List<Order> getOrdersBySession(Long storeId, Long sessionId) {
        return orderRepository.findByStoreIdAndSessionIdOrderByCreatedAt(storeId, sessionId);
    }

    public List<Order> getActiveOrdersByStore(Long storeId) {
        return orderRepository.findActiveOrdersByStoreId(storeId);
    }

    @Transactional
    public Order updateOrderStatus(Long storeId, Long orderId, String newStatus) {
        if (!VALID_STATUSES.contains(newStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 상태입니다");
        }
        Order order = orderRepository.findByIdAndStoreId(orderId, storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "주문을 찾을 수 없습니다"));

        validateStatusTransition(order.getStatus(), newStatus);
        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);

        TableEntity table = tableRepository.findById(order.getTableId()).orElse(null);
        String tableNumber = table != null ? table.getTableNumber() : "";
        sseService.publishOrderEvent(storeId, new OrderEvent("STATUS_CHANGED", orderId, order.getTableId(), tableNumber, saved));
        return saved;
    }

    @Transactional
    public void deleteOrder(Long storeId, Long orderId) {
        Order order = orderRepository.findByIdAndStoreId(orderId, storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "주문을 찾을 수 없습니다"));

        TableEntity table = tableRepository.findById(order.getTableId()).orElse(null);
        String tableNumber = table != null ? table.getTableNumber() : "";

        orderRepository.delete(order);
        sseService.publishOrderEvent(storeId, new OrderEvent("ORDER_DELETED", orderId, order.getTableId(), tableNumber, null));
    }

    private void validateStatusTransition(String current, String next) {
        if (current.equals(next)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "동일한 상태로 변경할 수 없습니다");
        }
        if ("COMPLETED".equals(current)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "완료된 주문은 상태를 변경할 수 없습니다");
        }
    }

    private synchronized String generateOrderNumber(Long storeId) {
        String prefix = "ORD-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-";
        long count = orderRepository.countByStoreIdAndOrderNumberPrefix(storeId, prefix);
        return prefix + String.format("%03d", count + 1);
    }
}
