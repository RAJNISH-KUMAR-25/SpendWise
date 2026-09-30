import { formatCurrency } from './SummaryCards';
import { prettyCategory } from './ExpenseForm';

function ExpenseItem({ expense, onEdit, onDelete }) {
  return (
    <article className="expense-item">
      <div className="expense-main">
        <div className="expense-title-row">
          <h3>{expense.title}</h3>
          <span className={`category-pill category-${expense.category.toLowerCase()}`}>{prettyCategory(expense.category)}</span>
        </div>
        <p className="expense-description">{expense.description || 'No description added.'}</p>
      </div>
      <div className="expense-meta">
        <strong>{formatCurrency(expense.amount)}</strong>
        <span>{formatDate(expense.expenseDate)}</span>
      </div>
      <div className="expense-actions">
        <button className="icon-button" type="button" onClick={() => onEdit(expense)} aria-label={`Edit ${expense.title}`}>✎</button>
        <button className="icon-button danger" type="button" onClick={() => onDelete(expense)} aria-label={`Delete ${expense.title}`}>⌫</button>
      </div>
    </article>
  );
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`));
}

export default ExpenseItem;

