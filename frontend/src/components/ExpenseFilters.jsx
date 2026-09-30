import { prettyCategory } from './ExpenseForm';

const categories = [
  'ALL',
  'FOOD',
  'TRAVEL',
  'SHOPPING',
  'BILLS',
  'ENTERTAINMENT',
  'HEALTH',
  'EDUCATION',
  'OTHER'
];

function ExpenseFilters({ filters, onChange, resultCount }) {
  const clearFilters = () => {
    onChange({
      category: 'ALL',
      date: '',
      search: '',
    });
  };

  return (
    <section className="filter-panel">
      <div className="filter-title">Filter expenses</div>

      <label>
        Category
        <select
          value={filters.category}
          onChange={(event) =>
            onChange({ category: event.target.value })
          }
        >
          {categories.map((category) => (
            <option value={category} key={category}>
              {category === 'ALL'
                ? 'All categories'
                : prettyCategory(category)}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date
        <input
          type="date"
          value={filters.date}
          onChange={(event) =>
            onChange({ date: event.target.value })
          }
        />
      </label>

      <label className="search-label">
        Search
        <input
          value={filters.search}
          onChange={(event) =>
            onChange({ search: event.target.value })
          }
          placeholder="Search title…"
        />
      </label>

      <button
        className="button secondary filter-clear"
        type="button"
        onClick={clearFilters}
      >
        Clear
      </button>

      <div className="filter-count">
        {resultCount} result{resultCount === 1 ? '' : 's'}
      </div>
    </section>
  );
}

export default ExpenseFilters;