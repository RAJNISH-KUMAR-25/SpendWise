package com.spendwise.service;

import com.spendwise.dto.CategorySummaryResponse;
import com.spendwise.dto.ExpenseRequest;
import com.spendwise.dto.ExpenseResponse;
import com.spendwise.dto.SummaryResponse;
import com.spendwise.exception.ExpenseNotFoundException;
import com.spendwise.exception.InvalidCategoryException;
import com.spendwise.model.Category;
import com.spendwise.model.Expense;
import com.spendwise.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {
        Expense expense = new Expense();
        applyRequest(expense, request);
        return toResponse(expenseRepository.save(expense));
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses() {
        return expenseRepository.findAllByOrderByExpenseDateDescIdDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ExpenseNotFoundException(id));
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException(id));
        applyRequest(expense, request);
        return toResponse(expenseRepository.save(expense));
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ExpenseNotFoundException(id);
        }
        expenseRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getByCategory(String category) {
        return expenseRepository.findByCategoryOrderByExpenseDateDescIdDesc(parseCategory(category))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getByDate(LocalDate date) {
        return expenseRepository.findByExpenseDateOrderByIdDesc(date)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SummaryResponse getSummary() {
        BigDecimal totalAmount = scale(expenseRepository.findTotalAmount());
        BigDecimal averageExpense = scale(expenseRepository.findAverageAmount());
        return new SummaryResponse(expenseRepository.countExpenses(), totalAmount, averageExpense);
    }

    @Transactional(readOnly = true)
    public List<CategorySummaryResponse> getCategorySummary() {
        return expenseRepository.findCategoryTotals()
                .stream()
                .map(item -> new CategorySummaryResponse(
                        item.getCategory().name(),
                        scale(item.getTotal())
                ))
                .toList();
    }

    private void applyRequest(Expense expense, ExpenseRequest request) {
        expense.setTitle(request.title().trim());
        expense.setDescription(normalizeDescription(request.description()));
        expense.setAmount(scale(request.amount()));
        expense.setCategory(parseCategory(request.category()));
        expense.setExpenseDate(request.expenseDate());
    }

    private String normalizeDescription(String description) {
        if (description == null) {
            return null;
        }
        String normalized = description.trim();
        return normalized.isBlank() ? null : normalized;
    }

    private Category parseCategory(String category) {
        try {
            return Category.valueOf(category.trim().toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw new InvalidCategoryException(category);
        }
    }

    private ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getDescription(),
                scale(expense.getAmount()),
                expense.getCategory().name(),
                expense.getExpenseDate(),
                expense.getCreatedAt(),
                expense.getUpdatedAt()
        );
    }

    private BigDecimal scale(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return value.setScale(2, RoundingMode.HALF_UP);
    }
}

