package com.tableorder.order;

import com.tableorder.order.dto.OrderRequest;
import com.tableorder.order.dto.OrderResponse;
import com.tableorder.order.dto.StatusRequest;
import com.tableorder.order.entity.Order;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores/{storeId}")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> createOrder(@PathVariable Long storeId,
                                                     @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(storeId, request));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getOrdersBySession(@PathVariable Long storeId,
                                                          @RequestParam Long sessionId) {
        return ResponseEntity.ok(orderService.getOrdersBySession(storeId, sessionId));
    }

    @GetMapping("/orders/all")
    public ResponseEntity<List<Order>> getOrdersByStore(@PathVariable Long storeId) {
        return ResponseEntity.ok(orderService.getActiveOrdersByStore(storeId));
    }

    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long storeId, @PathVariable Long orderId,
                                                   @Valid @RequestBody StatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(storeId, orderId, request.status()));
    }

    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long storeId, @PathVariable Long orderId) {
        orderService.deleteOrder(storeId, orderId);
        return ResponseEntity.noContent().build();
    }
}
