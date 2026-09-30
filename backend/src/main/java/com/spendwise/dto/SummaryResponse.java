package com.spendwise.dto;

import java.math.BigDecimal;

public record SummaryResponse(
        long totalExpenses,
        BigDecimal totalAmount,
        BigDecimal averageExpense
) {
}

