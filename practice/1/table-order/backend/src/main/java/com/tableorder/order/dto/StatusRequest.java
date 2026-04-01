package com.tableorder.order.dto;

import jakarta.validation.constraints.NotBlank;

public record StatusRequest(@NotBlank String status) {}
