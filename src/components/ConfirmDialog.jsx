import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

/**
 * Premium animated confirmation dialog using a React Portal.
 * Renders into document.body to escape any CSS stacking context issues.
 */
const ConfirmDialog = ({ isOpen, onConfirm, onCancel, productName, isLoading }) => {
  const cancelBtnRef = useRef(null);

  // Trap focus and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Auto-focus the cancel button for safety-first UX
    const timer = setTimeout(() => cancelBtnRef.current?.focus(), 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="dialog-panel">
        {/* Danger Icon */}
        <div className="dialog-icon-wrap">
          <svg className="dialog-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 id="dialog-title" className="dialog-title">Delete Product</h2>
        <p className="dialog-body">
          Are you sure you want to permanently delete{' '}
          <strong className="dialog-product-name">"{productName}"</strong>?
          <br />
          <span className="dialog-warning">This action cannot be undone.</span>
        </p>

        <div className="dialog-actions">
          <button
            ref={cancelBtnRef}
            id="dialog-cancel-btn"
            className="btn btn-secondary dialog-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            id="dialog-confirm-btn"
            className="btn btn-danger dialog-btn"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner" />
                Deleting…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                Delete Product
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
