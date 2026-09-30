import { useCallback, useEffect, useState } from 'react';
import {
  createExpense,
  deleteExpense,
  getCategorySummary,
  getExpenses,
  getSummary,
  updateExpense,
} from '../services/expenseService';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalAmount: 0,
    averageExpense: 0,
  });
  const [categorySummary, setCategorySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [expenseData, summaryData, categoryData] = await Promise.all([
        getExpenses(),
        getSummary(),
        getCategorySummary(),
      ]);
      setExpenses(expenseData);
      setSummary(summaryData);
      setCategorySummary(categoryData);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (payload) => {
    setSaving(true);
    setError('');
    try {
      await createExpense(payload);
      await refresh();
    } catch (err) {
      setError(extractErrorMessage(err));
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const update = async (id, payload) => {
    setSaving(true);
    setError('');
    try {
      await updateExpense(id, payload);
      await refresh();
    } catch (err) {
      setError(extractErrorMessage(err));
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    setSaving(true);
    setError('');
    try {
      await deleteExpense(id);
      await refresh();
    } catch (err) {
      setError(extractErrorMessage(err));
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { expenses, summary, categorySummary, loading, saving, error, add, update, remove, refresh };
}

function extractErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Something went wrong while communicating with the server.';
}

