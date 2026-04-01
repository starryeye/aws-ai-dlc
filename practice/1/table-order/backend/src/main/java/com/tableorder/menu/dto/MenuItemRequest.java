package com.tableorder.menu.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record MenuItemRequest(
    @NotBlank String name,
    @NotNull @DecimalMin("0") @DecimalMax("999999") BigDecimal price,
    String description,
    @NotNull Long categoryId,
    String imageUrl,
    Integer displayOrder
) {}
