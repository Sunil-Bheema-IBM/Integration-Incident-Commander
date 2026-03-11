import React from 'react';
import './AgentStatusBanner.css';

function AgentStatusBanner({ isActive = false, isComplete = false }) {
  const agents = [
    { name: 'Product', icon: '👔', color: '#667eea' },
    { name: 'Developer', icon: '💻', color: '#28a745' },
    { name: 'Architect', icon: '🏗️', color: '#fd7e14' },
    { name: 'Security', icon: '🔒', color: '#dc3545' }
  ];

  // Show banner if either analyzing or complete
  if (!isActive && !isComplete) return null;

  return (
    <div className={`agent-status-banner ${isComplete ? 'complete' : ''}`}>
      <div className="banner-content">
        <h3 className="banner-title">
          {isComplete ? (
            <>
              <span className="check-icon">✓</span>
              AI Investigation Complete
            </>
          ) : (
            <>
              <span className="pulse-dot"></span>
              AI Agents Activated
            </>
          )}
        </h3>
        <div className="agent-badges">
          {agents.map((agent, index) => (
            <div 
              key={index} 
              className="agent-badge"
              style={{ '--agent-color': agent.color }}
            >
              <span className="agent-icon">{agent.icon}</span>
              <span className="agent-name">{agent.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AgentStatusBanner;

// Made with Bob