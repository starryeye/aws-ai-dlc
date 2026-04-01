package com.tableorder.auth.dto;

public record UserInfo(Long storeId, String role, Long tableId, String username) {}
