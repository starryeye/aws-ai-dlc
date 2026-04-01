package com.tableorder.order.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OrderRequest(
    @NotNull Long tableId,
    @NotNull String sessionId,
    @NotEmpty List<OrderItemRequest> items
) {}
