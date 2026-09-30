function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="loading-inline">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;

