package com.tableorder.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record OrderItemRequest(
    @NotNull Long menuId,
    @NotBlank String menuName,
    @NotNull @Min(1) Integer quantity,
    @NotNull @Min(0) BigDecimal unitPrice
) {}
