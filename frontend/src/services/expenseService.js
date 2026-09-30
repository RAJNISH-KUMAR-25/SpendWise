import apiClient from '../api/apiClient';

export async function getExpenses() {
  const response = await apiClient.get('/expenses');
  return response.data;
}

export async function getExpenseById(id) {
  const response = await apiClient.get(`/expenses/${id}`);
  return response.data;
}

export async function createExpense(expense) {
  const response = await apiClient.post('/expenses', expense);
  return response.data;
}

export async function updateExpense(id, expense) {
  const response = await apiClient.put(`/expenses/${id}`, expense);
  return response.data;
}

export async function deleteExpense(id) {
  await apiClient.delete(`/expenses/${id}`);
}

export async function getSummary() {
  const response = await apiClient.get('/expenses/summary');
  return response.data;
}

export async function getCategorySummary() {
  const response = await apiClient.get('/expenses/summary/category');
  return response.data;
}

export async function getExpensesByCategory(category) {
  const response = await apiClient.get(`/expenses/category/${category}`);
  return response.data;
}

export async function getExpensesByDate(date) {
  const response = await apiClient.get(`/expenses/date/${date}`);
  return response.data;
}

