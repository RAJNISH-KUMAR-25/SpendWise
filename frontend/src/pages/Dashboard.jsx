import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseList from '../components/ExpenseList';
import CategorySummary from '../components/CategorySummary';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import { useExpenses } from '../hooks/useExpenses';

function Dashboard() {
  const { expenses, summary, categorySummary, loading, saving, error, add, update, remove, refresh } = useExpenses();
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filters, setFilters] = useState({ category: 'ALL', date: '', search: '' });

  const filteredExpenses = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return expenses.filter((expense) => {
      const categoryMatch = filters.category === 'ALL' || expense.category === filters.category;
      const dateMatch = !filters.date || expense.expenseDate === filters.date;
      const searchMatch = !query || expense.title.toLowerCase().includes(query);
      return categoryMatch && dateMatch && searchMatch;
    });
  }, [expenses, filters]);

  const handleSubmit = async (payload) => {
    if (editingExpense) {
      await update(editingExpense.id, payload);
      setEditingExpense(null);
    } else {
      await add(payload);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await remove(deleteTarget.id);
    setDeleteTarget(null);
    if (editingExpense?.id === deleteTarget.id) setEditingExpense(null);
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container">
        <section className="hero">
          <div>
            <p className="eyebrow">Your money, made visible</p>
            <h1>Keep every rupee accounted for.</h1>
            <p className="hero-copy">Track daily spending, understand where your money goes, and build better habits with a simple dashboard.</p>
          </div>
          <div className="hero-stat">
            <span>Entries this view</span>
            <strong>{filteredExpenses.length}</strong>
          </div>
        </section>

        <ErrorMessage message={error} onRetry={refresh} />
        <SummaryCards summary={summary} />

        <div className="dashboard-grid">
          <ExpenseForm editingExpense={editingExpense} onSubmit={handleSubmit} onClear={() => setEditingExpense(null)} saving={saving} />
          <CategorySummary categorySummary={categorySummary} totalAmount={summary.totalAmount} />
        </div>

        <ExpenseFilters
          filters={filters}
          onChange={(changes) => setFilters((current) => ({ ...current, ...changes }))}
          resultCount={filteredExpenses.length}
        />

        <ExpenseList
          expenses={filteredExpenses}
          loading={loading}
          onEdit={setEditingExpense}
          onDelete={setDeleteTarget}
        />
      </main>
      <ConfirmDialog expense={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}

export default Dashboard;

