import React from 'react';
import './IntegrationWorkflow.css';

function IntegrationWorkflow({ integrationStatus }) {
  if (!integrationStatus) return null;

  const getStepStatus = (step) => {
    if (step.success) return 'success';
    if (step.success === false) return 'failed';
    return 'pending';
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'success':
        return '✓';
      case 'failed':
        return '✗';
      default:
        return '○';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Integration Workflow</h2>
        <span className={`workflow-status status-${integrationStatus.status}`}>
          {integrationStatus.status.toUpperCase()}
        </span>
      </div>
      <div className="card-content">
        {/* Success Banner for AI Fix Applied */}
        {integrationStatus.fixApplied && integrationStatus.status === 'success' && (
          <div className="incident-resolved-banner">
            <div className="banner-icon">✓</div>
            <div className="banner-content">
              <h3>Incident Resolved Automatically</h3>
              <p>AI fix applied successfully - Token Refresh Middleware enabled</p>
            </div>
          </div>
        )}

        <div className="workflow-diagram">
          {integrationStatus.steps && integrationStatus.steps.map((step, index) => (
            <div key={index} className="workflow-step-container">
              <div className={`workflow-step step-${getStepStatus(step)}`}>
                <div className="step-icon">
                  {getStepIcon(getStepStatus(step))}
                </div>
                <div className="step-details">
                  <h3>{step.service}</h3>
                  <p className="step-time">{new Date(step.timestamp).toLocaleTimeString()}</p>
                  
                  {/* Show recovery note for PaymentService when fix is applied */}
                  {step.service === 'PaymentService' && step.data?.fixApplied && (
                    <div className="recovery-note">
                      <span className="recovery-icon">🔄</span>
                      <span>Recovered after applying token refresh fix</span>
                    </div>
                  )}
                  
                  {step.error && (
                    <div className="step-error">
                      <strong>Error {step.error.code}:</strong> {step.error.message}
                    </div>
                  )}
                  {step.data && (
                    <div className="step-data">
                      {Object.entries(step.data).map(([key, value]) => (
                        <div key={key} className="data-item">
                          <span className="data-key">{key}:</span>
                          <span className="data-value">{JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {index < integrationStatus.steps.length - 1 && (
                <div className="workflow-arrow">→</div>
              )}
            </div>
          ))}
        </div>

        {integrationStatus.status === 'running' && (
          <div className="workflow-loading">
            <div className="spinner"></div>
            <p>Integration in progress...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default IntegrationWorkflow;

// Made with Bob
