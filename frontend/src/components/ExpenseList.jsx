import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, loading, onEdit, onDelete }) {
  return (
    <section className="panel expenses-panel">
      <div className="panel-heading list-heading">
        <div>
          <p className="eyebrow">Transactions</p>
          <h2>Expense List</h2>
        </div>
        <span className="muted">Newest first</span>
      </div>

      {loading ? (
        <div className="list-placeholder"><LoadingSpinner /></div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">₹</div>
          <h3>No expenses found</h3>
          <p>Try changing your filters or add your first expense.</p>
        </div>
      ) : (
        <div className="expense-list">
          {expenses.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}

function LoadingSpinner() {
  return <div className="spinner" aria-label="Loading" />;
}

export default ExpenseList;

