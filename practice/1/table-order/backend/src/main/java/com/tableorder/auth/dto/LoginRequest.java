package com.tableorder.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank String storeCode,
    @NotBlank String username,
    @NotBlank String password,
    @NotBlank String role
) {}
