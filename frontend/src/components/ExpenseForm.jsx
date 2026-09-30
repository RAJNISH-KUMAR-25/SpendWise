import { useEffect, useState } from 'react';

const categories = [
  'FOOD',
  'TRAVEL',
  'SHOPPING',
  'BILLS',
  'ENTERTAINMENT',
  'HEALTH',
  'EDUCATION',
  'OTHER',
];

const initialForm = {
  title: '',
  description: '',
  amount: '',
  category: 'FOOD',
  expenseDate: new Date().toISOString().slice(0, 10),
};

function ExpenseForm({ editingExpense, onSubmit, onClear, saving }) {
  const [form, setForm] = useState(initialForm);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title ?? '',
        description: editingExpense.description ?? '',
        amount: editingExpense.amount ?? '',
        category: editingExpense.category ?? 'OTHER',
        expenseDate: editingExpense.expenseDate ?? initialForm.expenseDate,
      });
    } else {
      setForm(initialForm);
    }
    setLocalError('');
  }, [editingExpense]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.title.trim() || !form.category || !form.expenseDate || !amount || amount <= 0) {
      setLocalError('Please enter a title, a positive amount, a category, and a date.');
      return;
    }
    setLocalError('');
    await onSubmit({ ...form, title: form.title.trim(), amount });
    if (!editingExpense) setForm({ ...initialForm, expenseDate: form.expenseDate });
  };

  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{editingExpense ? 'Update entry' : 'New entry'}</p>
          <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
        </div>
        {editingExpense && <span className="edit-badge">Editing #{editingExpense.id}</span>}
      </div>

      <form onSubmit={handleSubmit} className="expense-form">
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Grocery Shopping" maxLength="120" />
        </label>

        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Optional notes" rows="3" maxLength="500" />
        </label>

        <div className="two-col">
          <label>
            Amount
            <div className="currency-input">
              <span>₹</span>
              <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" />
            </div>
          </label>
          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              {categories.map((category) => <option value={category} key={category}>{prettyCategory(category)}</option>)}
            </select>
          </label>
        </div>

        <label>
          Expense Date
          <input name="expenseDate" type="date" value={form.expenseDate} onChange={handleChange} />
        </label>

        {(localError) && <p className="inline-error">{localError}</p>}

        <div className="form-actions">
          <button className="button primary" type="submit" disabled={saving}>{saving ? 'Saving…' : editingExpense ? 'Update Expense' : 'Add Expense'}</button>
          <button className="button secondary" type="button" onClick={() => { setForm(initialForm); onClear(); }} disabled={saving}>Clear</button>
        </div>
      </form>
    </section>
  );
}

export function prettyCategory(category) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

export default ExpenseForm;

