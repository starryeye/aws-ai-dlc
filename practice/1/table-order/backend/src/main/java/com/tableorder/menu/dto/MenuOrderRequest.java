package com.tableorder.menu.dto;

import jakarta.validation.constraints.NotNull;

public record MenuOrderRequest(@NotNull Long menuId, @NotNull Integer displayOrder) {}
