function Navbar() {
  return (
    <header className="topbar">
      <div className="glass-nav">
        <div className="brand-block">
          <div className="brand-mark">₹</div>

          <div>
            <div className="brand-name">SpendWise</div>
            <div className="brand-subtitle">Personal Expense Tracker</div>
          </div>
        </div>

        <div className="nav-pill">
          <div className="nav-item active">
            <span className="nav-dot">◆</span>
            Dashboard
          </div>

          <div className="nav-item">
            <span className="nav-dot">₹</span>
            Expenses
          </div>

          <div className="nav-item">
            <span className="nav-dot">◉</span>
            Overview
          </div>
        </div>

        <div className="topbar-date">
          Smart spending starts with visibility.
        </div>
      </div>
    </header>
  );
}

export default Navbar;