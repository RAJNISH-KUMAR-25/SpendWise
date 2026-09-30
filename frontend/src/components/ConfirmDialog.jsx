function ConfirmDialog({ expense, onConfirm, onCancel }) {
  if (!expense) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onCancel}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="dialog-icon">!</div>
        <h2 id="delete-title">Delete expense?</h2>
        <p>“{expense.title}” will be permanently removed from your expense list.</p>
        <div className="dialog-actions">
          <button className="button secondary" type="button" onClick={onCancel}>Cancel</button>
          <button className="button danger-button" type="button" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;

