import { formatCurrency } from './SummaryCards';

function CategorySummary({ categorySummary, totalAmount }) {
  const entries = categorySummary ?? [];
  const maxValue = Math.max(...entries.map((item) => Number(item.total)), 1);

  return (
    <section className="panel category-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Breakdown</p>
          <h2>Category Summary</h2>
        </div>

        <span className="muted">
          {formatCurrency(totalAmount)} total
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="empty-mini">
          Category spending will appear here once you add expenses.
        </div>
      ) : (
        <div className="category-chart">
          {entries.map((item) => {
            const total = Number(item.total);
            const percentage =
              totalAmount > 0
                ? Math.round((total / Number(totalAmount)) * 100)
                : 0;

            return (
              <div className="bar-row" key={item.category}>
                <div className="bar-label">
                  <span>{prettyCategory(item.category)}</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>

                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(total / maxValue) * 100}%`,
                    }}
                  />
                </div>

                <span className="bar-percent">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function prettyCategory(category) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

export default CategorySummary;