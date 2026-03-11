import React from 'react';
import './AIInvestigationTimeline.css';

function AIInvestigationTimeline({ events }) {
  if (!events || events.length === 0) return null;

  const getIcon = (type) => {
    const icons = {
      'workflow_triggered': '🚀',
      'step_success': '✓',
      'step_failed': '✗',
      'agent_analyzing': '🤖',
      'root_cause': '🔍',
      'fix_suggested': '💡',
      'fix_applied': '⚡',
      'workflow_rerun': '🔄',
      'recovery_success': '✅',
      'incident_created': '📋'
    };
    return icons[type] || '•';
  };

  const getEventClass = (type) => {
    if (type.includes('success') || type === 'recovery_success') return 'success';
    if (type.includes('failed')) return 'failed';
    if (type.includes('agent')) return 'analyzing';
    if (type === 'fix_applied' || type === 'fix_suggested') return 'fix';
    return 'info';
  };

  return (
    <div className="card ai-investigation-timeline">
      <div className="card-header">
        <h2 className="card-title">🔬 AI Investigation Timeline</h2>
        <span className="timeline-count">{events.length} events</span>
      </div>
      <div className="card-content">
        <div className="timeline-container">
          {events.map((event, index) => (
            <div key={index} className={`timeline-event event-${getEventClass(event.type)}`}>
              <div className="timeline-marker">
                <span className="timeline-icon">{getIcon(event.type)}</span>
                <div className="timeline-line"></div>
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-message">{event.message}</span>
                  <span className="timeline-timestamp">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {event.details && (
                  <div className="timeline-details">{event.details}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIInvestigationTimeline;

// Made with Bob