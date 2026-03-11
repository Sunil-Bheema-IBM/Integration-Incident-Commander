import React from 'react';
import './RecommendationCard.css';

/**
 * Reusable component for rendering recommendation objects safely
 * Prevents React error: "Objects are not valid as a React child"
 * 
 * @param {Object} props - Component props
 * @param {string} props.priority - Priority level (high, medium, low)
 * @param {string} props.category - Category (Resilience, Security, etc.)
 * @param {string} props.title - Recommendation title
 * @param {string} props.description - Detailed description
 * @param {string} props.implementation - Implementation details (optional)
 * @param {string} props.estimatedEffort - Effort estimate (optional)
 */
function RecommendationCard({ 
  priority, 
  category, 
  title, 
  description, 
  implementation, 
  estimatedEffort 
}) {
  return (
    <div className={`recommendation-card priority-${priority}`}>
      <div className="recommendation-header">
        <span className={`priority-badge priority-${priority}`}>
          {priority?.toUpperCase()}
        </span>
        {category && (
          <span className="category-badge">{category}</span>
        )}
      </div>
      <h5 className="recommendation-title">{title}</h5>
      <p className="recommendation-description">{description}</p>
      {implementation && (
        <div className="recommendation-detail">
          <strong>Implementation:</strong> {implementation}
        </div>
      )}
      {estimatedEffort && (
        <div className="recommendation-detail">
          <strong>Estimated Effort:</strong> {estimatedEffort}
        </div>
      )}
    </div>
  );
}

export default RecommendationCard;

// Made with Bob