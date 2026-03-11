import React, { useState } from 'react';
import './IncidentReport.css';
import RecommendationCard from './RecommendationCard';

function IncidentReport({ report, onApplyFix, fixApplied }) {
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);

  if (!report) return null;

  const handleApplyFix = async () => {
    setApplying(true);
    setError(null);
    try {
      await onApplyFix();
      // Success - button will disappear due to fixApplied prop
    } catch (error) {
      console.error('Error applying fix:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to apply fix. Please check if the backend server is running.';
      setError(errorMsg);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="card incident-report">
      <div className="card-header">
        <h2 className="card-title">📋 Final Incident Report</h2>
        <span className={`priority-badge priority-${report.priority?.toLowerCase().replace(/\s+/g, '-')}`}>
          {report.priority}
        </span>
      </div>
      <div className="card-content">
        {/* Summary */}
        <div className="report-section">
          <h3 className="section-title">Executive Summary</h3>
          <p className="summary-text">{report.summary}</p>
        </div>

        {/* Root Cause */}
        <div className="report-section highlight-section">
          <h3 className="section-title">🔍 Root Cause Analysis</h3>
          <div className="root-cause-box">
            <p className="root-cause-description">{report.rootCause?.description}</p>
            {report.rootCause?.technicalDetails && (
              <div className="technical-details">
                <h4>Technical Details:</h4>
                <ul>
                  <li><strong>Error Code:</strong> {report.rootCause.technicalDetails.errorCode}</li>
                  <li><strong>Service:</strong> {report.rootCause.technicalDetails.service}</li>
                  <li><strong>Message:</strong> {report.rootCause.technicalDetails.errorMessage}</li>
                </ul>
              </div>
            )}
            <div className="confidence-indicator">
              <span>Confidence Level:</span>
              <div className="confidence-bar-small">
                <div 
                  className="confidence-fill-small"
                  style={{ width: `${report.rootCause?.confidence || 0}%` }}
                >
                  {report.rootCause?.confidence || 0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto Fix Button - Shows after Root Cause Analysis */}
        {!fixApplied && report.rootCause && (
          <div className="auto-fix-section">
            <button
              className="apply-fix-btn"
              onClick={handleApplyFix}
              disabled={applying}
            >
              {applying ? (
                <>
                  <span className="btn-spinner"></span>
                  Applying Fix...
                </>
              ) : (
                <>
                  <span className="btn-icon">⚡</span>
                  Apply AI Suggested Fix & Re-run Integration
                </>
              )}
            </button>
            <p className="fix-description">
              AI recommends enabling Token Refresh Middleware to prevent authentication failures
            </p>
            {error && (
              <div className="fix-error">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Impacted Services */}
        {report.impactedServices && Array.isArray(report.impactedServices) && report.impactedServices.length > 0 && (
          <div className="report-section">
            <h3 className="section-title">⚠️ Impacted Services</h3>
            <div className="services-grid">
              {report.impactedServices.map((service, index) => (
                <div key={index} className={`service-card impact-${service.impact}`}>
                  <div className="service-header">
                    <h4>{service.name}</h4>
                    <span className={`impact-badge impact-${service.impact}`}>
                      {service.impact}
                    </span>
                  </div>
                  <p className="service-reason">{service.reason}</p>
                  <div className={`service-status status-${service.status}`}>
                    Status: {service.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Fix */}
        {report.suggestedFix && (
          <div className="report-section">
            <h3 className="section-title">🔧 Recommended Actions</h3>
            
            {report.suggestedFix.immediate && Array.isArray(report.suggestedFix.immediate) && report.suggestedFix.immediate.length > 0 && (
              <div className="fix-category">
                <h4 className="fix-title immediate">Immediate Actions</h4>
                <ul className="fix-list">
                  {report.suggestedFix.immediate.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {report.suggestedFix.longTerm && Array.isArray(report.suggestedFix.longTerm) && report.suggestedFix.longTerm.length > 0 && (
              <div className="fix-category">
                <h4 className="fix-title long-term">Long-term Improvements</h4>
                <div className="recommendations-grid">
                  {/*
                    FIXED: Previously had <li key={index}>{action}</li>
                    This caused React error because 'action' is an object with keys:
                    {priority, category, title, description, implementation, estimatedEffort}
                    
                    React cannot render plain objects as children.
                    Must render individual object properties or use a component.
                  */}
                  {report.suggestedFix.longTerm.map((rec, index) => (
                    <RecommendationCard
                      key={index}
                      priority={rec.priority}
                      category={rec.category}
                      title={rec.title}
                      description={rec.description}
                      implementation={rec.implementation}
                      estimatedEffort={rec.estimatedEffort}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Impact */}
        {report.securityImpact && (
          <div className="report-section">
            <h3 className="section-title">🔒 Security & Compliance Impact</h3>
            <div className="security-box">
              <div className="security-severity">
                <span>Severity:</span>
                <span className={`severity-badge severity-${report.securityImpact.severity}`}>
                  {report.securityImpact.severity?.toUpperCase()}
                </span>
              </div>
              
              {report.securityImpact.complianceIssues && Array.isArray(report.securityImpact.complianceIssues) && report.securityImpact.complianceIssues.length > 0 && (
                <div className="compliance-issues">
                  <h4>Compliance Issues:</h4>
                  {report.securityImpact.complianceIssues.map((issue, index) => (
                    <div key={index} className={`compliance-item status-${issue.status?.toLowerCase()}`}>
                      <div className="compliance-header">
                        <strong>{issue.standard}</strong>
                        <span className={`status-badge status-${issue.status?.toLowerCase()}`}>
                          {issue.status}
                        </span>
                      </div>
                      <p>{issue.finding}</p>
                      {issue.remediation && (
                        <p className="remediation"><strong>Remediation:</strong> {issue.remediation}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {report.securityImpact.recommendations && Array.isArray(report.securityImpact.recommendations) && report.securityImpact.recommendations.length > 0 && (
                <div className="security-recommendations">
                  <h4>Security Recommendations:</h4>
                  <div className="recommendations-grid">
                    {report.securityImpact.recommendations.map((rec, index) => (
                      <div key={index} className={`recommendation-card priority-${rec.priority}`}>
                        <div className="recommendation-header">
                          <span className={`priority-badge priority-${rec.priority}`}>
                            {rec.priority?.toUpperCase()}
                          </span>
                          <h5>{rec.title}</h5>
                        </div>
                        <p className="recommendation-description">{rec.description}</p>
                        {rec.implementation && (
                          <div className="recommendation-detail">
                            <strong>Implementation:</strong> {rec.implementation}
                          </div>
                        )}
                        {rec.estimatedEffort && (
                          <div className="recommendation-detail">
                            <strong>Estimated Effort:</strong> {rec.estimatedEffort}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dependencies */}
        {report.dependencies && (
          <div className="report-section">
            <h3 className="section-title">🔗 System Dependencies</h3>
            <div className="dependencies-grid">
              {report.dependencies.upstream && Array.isArray(report.dependencies.upstream) && report.dependencies.upstream.length > 0 && (
                <div className="dependency-category">
                  <h4>Upstream Services</h4>
                  <ul>
                    {report.dependencies.upstream.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}
              {report.dependencies.downstream && Array.isArray(report.dependencies.downstream) && report.dependencies.downstream.length > 0 && (
                <div className="dependency-category">
                  <h4>Downstream Services</h4>
                  <ul>
                    {report.dependencies.downstream.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overall Confidence */}
        <div className="report-section overall-confidence">
          <h3 className="section-title">📊 Overall Analysis Confidence</h3>
          <div className="confidence-display">
            <div className="confidence-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="10"/>
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#28a745" 
                  strokeWidth="10"
                  strokeDasharray={`${(report.overallConfidence || 0) * 2.827} 282.7`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#333">
                  {report.overallConfidence || 0}%
                </text>
              </svg>
            </div>
            <p className="confidence-description">
              The AI agents have analyzed this incident with {report.overallConfidence || 0}% confidence.
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="report-metadata">
          <p><strong>Report Generated:</strong> {report.generatedAt ? new Date(report.generatedAt).toLocaleString() : 'N/A'}</p>
          <p><strong>Incident ID:</strong> {report.incidentId || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

export default IncidentReport;

// Made with Bob
