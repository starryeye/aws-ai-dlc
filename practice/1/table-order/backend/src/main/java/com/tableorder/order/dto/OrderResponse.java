package com.tableorder.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderResponse(Long orderId, String orderNumber, BigDecimal totalAmount, String status, LocalDateTime createdAt) {}
