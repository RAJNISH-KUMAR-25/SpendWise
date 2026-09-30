package com.spendwise;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spendwise.dto.ExpenseRequest;
import com.spendwise.model.Expense;
import com.spendwise.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ExpenseControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    ExpenseRepository expenseRepository;

    @BeforeEach
    void clean() {
        expenseRepository.deleteAll();
    }

    private ExpenseRequest request(String title, BigDecimal amount, String category) {
        return new ExpenseRequest(title, "Test description", amount, category, LocalDate.of(2026, 9, 29));
    }

    @Test
    void createExpense() throws Exception {
        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request("Lunch", new BigDecimal("250.00"), "FOOD"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Lunch")))
                .andExpect(jsonPath("$.category", is("FOOD")))
                .andExpect(jsonPath("$.amount", is(250.00)));
    }

    @Test
    void getExpenses() throws Exception {
        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request("Lunch", new BigDecimal("250.00"), "FOOD"))))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Lunch")));
    }

    @Test
    void updateExpense() throws Exception {
        String response = mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request("Lunch", new BigDecimal("250.00"), "FOOD"))))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        long id = objectMapper.readTree(response).get("id").asLong();
        ExpenseRequest updated = request("Dinner", new BigDecimal("500.00"), "FOOD");

        mockMvc.perform(put("/api/expenses/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Dinner")))
                .andExpect(jsonPath("$.amount", is(500.00)));
    }

    @Test
    void deleteExpense() throws Exception {
        Expense expense = new Expense();
        expense.setTitle("Movie");
        expense.setDescription("Cinema");
        expense.setAmount(new BigDecimal("400.00"));
        expense.setCategory(com.spendwise.model.Category.ENTERTAINMENT);
        expense.setExpenseDate(LocalDate.of(2026, 9, 29));
        long id = expenseRepository.save(expense).getId();

        mockMvc.perform(delete("/api/expenses/{id}", id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/expenses/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void getSummary() throws Exception {
        mockMvc.perform(post("/api/expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request("Lunch", new BigDecimal("250.00"), "FOOD"))));
        mockMvc.perform(post("/api/expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request("Uber", new BigDecimal("150.00"), "TRAVEL"))));

        mockMvc.perform(get("/api/expenses/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalExpenses", is(2)))
                .andExpect(jsonPath("$.totalAmount", is(400.00)))
                .andExpect(jsonPath("$.averageExpense", is(200.00)));
    }

    @Test
    void invalidRequestReturnsBadRequest() throws Exception {
        ExpenseRequest invalid = new ExpenseRequest("", null, new BigDecimal("0"), "", null);

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)));
    }
}

