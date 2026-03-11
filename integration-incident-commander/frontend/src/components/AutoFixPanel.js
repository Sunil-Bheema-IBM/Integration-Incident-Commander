import React, { useState } from 'react';
import './AutoFixPanel.css';

function AutoFixPanel({ incident, onFixApplied }) {
  const [applying, setApplying] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);

  const handleApplyFix = async () => {
    setApplying(true);
    try {
      // Call the fix API
      await onFixApplied();
      setFixApplied(true);
    } catch (error) {
      console.error('Error applying fix:', error);
    } finally {
      setApplying(false);
    }
  };

  // Only show if incident is analyzed and fix not yet applied
  if (!incident || incident.status !== 'analyzed' || fixApplied) {
    return null;
  }

  return (
    <div className="auto-fix-panel">
      <div className="fix-header">
        <h3>🤖 AI Auto-Fix Available</h3>
        <p>The AI has identified a fix that can be applied automatically</p>
      </div>
      
      <div className="fix-content">
        <div className="fix-recommendation">
          <div className="fix-icon">🔧</div>
          <div className="fix-details">
            <h4>Recommended Fix</h4>
            <p className="fix-description">
              Enable Token Refresh Middleware to automatically refresh expired OAuth tokens
            </p>
            <div className="fix-impact">
              <span className="impact-label">Impact:</span>
              <span className="impact-value">Prevents authentication failures</span>
            </div>
          </div>
        </div>

        <button 
          className="apply-fix-button"
          onClick={handleApplyFix}
          disabled={applying}
        >
          {applying ? (
            <>
              <span className="spinner-small"></span>
              Applying Fix & Re-running...
            </>
          ) : (
            <>
              <span className="button-icon">⚡</span>
              Apply AI Suggested Fix & Re-run Integration
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default AutoFixPanel;

// Made with Bob