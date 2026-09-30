package com.spendwise.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ExpenseResponse(
        Long id,
        String title,
        String description,
        BigDecimal amount,
        String category,
        LocalDate expenseDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}

