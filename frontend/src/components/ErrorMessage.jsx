function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="error-banner" role="alert">
      <div><strong>Couldn’t load SpendWise</strong><span>{message}</span></div>
      {onRetry && <button className="button secondary" type="button" onClick={onRetry}>Retry</button>}
    </div>
  );
}

export default ErrorMessage;

