import React from 'react';
import './FixSuccessMessage.css';

function FixSuccessMessage({ show }) {
  if (!show) return null;

  return (
    <div className="fix-success-message">
      <div className="success-content">
        <div className="success-icon">✓</div>
        <div className="success-text">
          <h3>Incident Resolved Automatically</h3>
          <p className="ai-message">
            AI applied the recommended fix and successfully recovered the integration workflow.
          </p>
          <div className="fix-applied-badge">
            <span className="badge-icon">🔧</span>
            <span className="badge-text">Token Refresh Middleware Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FixSuccessMessage;

// Made with Bob