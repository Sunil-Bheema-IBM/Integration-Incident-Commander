import React from 'react';
import './AgentTimeline.css';

function AgentTimeline({ timeline, status }) {
  if (!timeline || timeline.length === 0) {
    if (status === 'analyzing') {
      return (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🤖 AI Agent Investigation</h2>
            <span className="analyzing-badge">Analyzing...</span>
          </div>
          <div className="card-content">
            <div className="analyzing-message">
              <div className="spinner"></div>
              <p>AI agents are analyzing the incident...</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  const getAgentIcon = (agentName) => {
    const icons = {
      'ProductOwnerAgent': '👔',
      'DeveloperAgent': '💻',
      'ArchitectAgent': '🏗️',
      'SecurityAgent': '🔒'
    };
    return icons[agentName] || '🤖';
  };

  const getAgentColor = (agentName) => {
    const colors = {
      'ProductOwnerAgent': '#667eea',
      'DeveloperAgent': '#28a745',
      'ArchitectAgent': '#fd7e14',
      'SecurityAgent': '#dc3545'
    };
    return colors[agentName] || '#6c757d';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">🤖 AI Agent Investigation Timeline</h2>
        {status === 'completed' && (
          <span className="completed-badge">Analysis Complete</span>
        )}
      </div>
      <div className="card-content">
        <div className="timeline">
          {timeline.map((entry, index) => (
            <div key={index} className="timeline-entry">
              <div 
                className="timeline-marker"
                style={{ backgroundColor: getAgentColor(entry.agent) }}
              >
                <span className="agent-icon">{getAgentIcon(entry.agent)}</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3 className="agent-name">{entry.role}</h3>
                  <span className="timeline-time">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="timeline-body">
                  {entry.status === 'completed' ? (
                    <>
                      {entry.analysis?.summary && (
                        <div className="analysis-section">
                          <strong>Summary:</strong>
                          <p>{entry.analysis.summary}</p>
                        </div>
                      )}
                      {entry.analysis?.rootCause && (
                        <div className="analysis-section">
                          <strong>Root Cause:</strong>
                          <p>{entry.analysis.rootCause}</p>
                        </div>
                      )}
                      {entry.analysis?.impactedServices && Array.isArray(entry.analysis.impactedServices) && entry.analysis.impactedServices.length > 0 && (
                        <div className="analysis-section">
                          <strong>Impacted Services:</strong>
                          <ul className="service-list">
                            {entry.analysis.impactedServices.map((service, idx) => (
                              <li key={idx} className={`impact-${service.impact}`}>
                                {service.name} - <span className="impact-badge">{service.impact}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {entry.analysis?.recommendations && Array.isArray(entry.analysis.recommendations) && entry.analysis.recommendations.length > 0 && (
                        <div className="analysis-section">
                          <strong>Recommendations:</strong>
                          <div className="recommendations-list">
                            {entry.analysis.recommendations.map((rec, idx) => (
                              <div key={idx} className={`recommendation-item priority-${rec.priority}`}>
                                <div className="rec-header">
                                  <span className={`priority-tag priority-${rec.priority}`}>{rec.priority?.toUpperCase()}</span>
                                  <strong>{rec.title}</strong>
                                </div>
                                <p className="rec-description">{rec.description}</p>
                                {rec.implementation && (
                                  <p className="rec-detail"><strong>Implementation:</strong> {rec.implementation}</p>
                                )}
                                {rec.estimatedEffort && (
                                  <p className="rec-detail"><strong>Effort:</strong> {rec.estimatedEffort}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {entry.analysis?.severity && (
                        <div className="analysis-section">
                          <strong>Security Severity:</strong>
                          <span className={`severity-badge severity-${entry.analysis.severity}`}>
                            {entry.analysis.severity.toUpperCase()}
                          </span>
                        </div>
                      )}
                      {entry.analysis?.confidence !== undefined && (
                        <div className="confidence-bar">
                          <span className="confidence-label">Confidence:</span>
                          <div className="confidence-progress">
                            <div 
                              className="confidence-fill"
                              style={{ width: `${entry.analysis.confidence}%` }}
                            >
                              {entry.analysis.confidence}%
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="duration">
                        Duration: {entry.duration}ms
                      </div>
                    </>
                  ) : (
                    <div className="error-message">
                      Analysis failed: {entry.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AgentTimeline;

// Made with Bob
