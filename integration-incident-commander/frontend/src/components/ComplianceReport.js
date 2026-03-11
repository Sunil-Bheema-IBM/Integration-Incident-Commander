import React from 'react';
import './ComplianceReport.css';

function ComplianceReport({ report }) {
  if (!report) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Compliance Report</h2>
        </div>
        <div className="card-content">
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Loading compliance report...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS':
        return '✓';
      case 'FAIL':
        return '✗';
      case 'WARNING':
        return '⚠';
      default:
        return '○';
    }
  };

  const getStatusClass = (status) => {
    return `control-${status.toLowerCase()}`;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'critical': '#dc3545',
      'high': '#fd7e14',
      'medium': '#ffc107',
      'low': '#28a745'
    };
    return colors[severity] || '#6c757d';
  };

  return (
    <div className="compliance-report">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Compliance Report</h2>
          <span className={`compliance-status status-${report.status.toLowerCase()}`}>
            {report.status}
          </span>
        </div>
        <div className="card-content">
          {/* Overall Score */}
          <div className="score-section">
            <div className="score-circle-large">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" strokeWidth="12"/>
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="none" 
                  stroke={report.overallScore >= 75 ? '#28a745' : report.overallScore >= 50 ? '#ffc107' : '#dc3545'}
                  strokeWidth="12"
                  strokeDasharray={`${report.overallScore * 3.14} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="65" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#333">
                  {report.overallScore}%
                </text>
              </svg>
            </div>
            <div className="score-details">
              <h3>Overall Compliance Score</h3>
              <p className="score-description">
                Your system has achieved a compliance score of {report.overallScore}% 
                with status: <strong>{report.status}</strong>
              </p>
              <p className="report-time">
                Generated: {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Framework Compliance */}
          <div className="frameworks-section">
            <h3 className="section-title">Compliance by Framework</h3>
            <div className="frameworks-grid">
              {Object.entries(report.frameworks).map(([name, data]) => (
                <div key={name} className="framework-card">
                  <h4>{name}</h4>
                  <div className="framework-stats">
                    <div className="stat">
                      <span className="stat-value pass">{data.passed}</span>
                      <span className="stat-label">Passed</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value warning">{data.warning}</span>
                      <span className="stat-label">Warning</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value fail">{data.failed}</span>
                      <span className="stat-label">Failed</span>
                    </div>
                  </div>
                  <div className="framework-progress">
                    <div 
                      className="framework-progress-bar"
                      style={{ width: `${data.compliancePercentage}%` }}
                    >
                      {data.compliancePercentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="controls-section">
            <h3 className="section-title">Compliance Controls</h3>
            <div className="controls-list">
              {report.controls.map((control, index) => (
                <div key={index} className={`control-item ${getStatusClass(control.status)}`}>
                  <div className="control-header">
                    <div className="control-title-section">
                      <span className="control-icon">
                        {getStatusIcon(control.status)}
                      </span>
                      <div>
                        <h4>{control.name}</h4>
                        <p className="control-id">{control.id} - {control.category}</p>
                      </div>
                    </div>
                    <div className="control-badges">
                      <span 
                        className="severity-badge"
                        style={{ 
                          backgroundColor: getSeverityColor(control.severity),
                          color: 'white'
                        }}
                      >
                        {control.severity}
                      </span>
                      <span className={`status-badge status-${control.status.toLowerCase()}`}>
                        {control.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="control-description">{control.description}</p>
                  
                  <div className="control-evidence">
                    <strong>Evidence:</strong> {control.evidence}
                  </div>
                  
                  {control.finding && (
                    <div className="control-finding">
                      <strong>Finding:</strong> {control.finding}
                    </div>
                  )}
                  
                  {control.remediation && (
                    <div className="control-remediation">
                      <strong>Remediation:</strong> {control.remediation}
                    </div>
                  )}
                  
                  <div className="control-frameworks">
                    <strong>Frameworks:</strong>
                    {control.framework.map((fw, idx) => (
                      <span key={idx} className="framework-tag">{fw}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="recommendations-section">
              <h3 className="section-title">🎯 Recommendations</h3>
              <div className="recommendations-list">
                {report.recommendations.map((rec, index) => (
                  <div key={index} className={`recommendation-item priority-${rec.priority}`}>
                    <div className="recommendation-header">
                      <span className={`priority-badge priority-${rec.priority}`}>
                        {rec.priority.toUpperCase()}
                      </span>
                      <h4>{rec.title}</h4>
                    </div>
                    <p className="recommendation-description">{rec.description}</p>
                    <div className="recommendation-meta">
                      <span><strong>Control:</strong> {rec.control}</span>
                      <span><strong>Impact:</strong> {rec.impact}</span>
                      <span><strong>Effort:</strong> {rec.estimatedEffort}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplianceReport;

// Made with Bob
