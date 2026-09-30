function SummaryCards({ summary }) {
  const cards = [
    { label: 'Total Expenses', value: summary.totalExpenses.toLocaleString('en-IN'), icon: '↗' },
    { label: 'Total Amount', value: formatCurrency(summary.totalAmount), icon: '₹' },
    { label: 'Average Expense', value: formatCurrency(summary.averageExpense), icon: '∅' },
  ];

  return (
    <section className="summary-grid" aria-label="Spending summary">
      {cards.map((card) => (
        <article className="summary-card" key={card.label}>
          <div className="summary-icon">{card.icon}</div>
          <div>
            <p className="summary-label">{card.label}</p>
            <p className="summary-value">{card.value}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));
}

export default SummaryCards;

