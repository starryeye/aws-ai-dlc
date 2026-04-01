package com.tableorder.sse.dto;

public record OrderEvent(String eventType, Long orderId, Long tableId, String tableNumber, Object data) {}
