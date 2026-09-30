package com.spendwise.repository;

import com.spendwise.model.Category;
import com.spendwise.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByOrderByExpenseDateDescIdDesc();

    List<Expense> findByCategoryOrderByExpenseDateDescIdDesc(Category category);

    List<Expense> findByExpenseDateOrderByIdDesc(LocalDate expenseDate);

    @Query("select coalesce(sum(e.amount), 0) from Expense e")
    BigDecimal findTotalAmount();

    @Query("select count(e) from Expense e")
    long countExpenses();

    @Query("select coalesce(avg(e.amount), 0) from Expense e")
    BigDecimal findAverageAmount();

    @Query("select e.category as category, coalesce(sum(e.amount), 0) as total from Expense e group by e.category order by total desc")
    List<CategoryTotalProjection> findCategoryTotals();

    interface CategoryTotalProjection {
        Category getCategory();
        BigDecimal getTotal();
    }
}

