package com.tableorder.auth.dto;

public record TokenResponse(String token, Long expiresIn, String role, Long storeId) {}
