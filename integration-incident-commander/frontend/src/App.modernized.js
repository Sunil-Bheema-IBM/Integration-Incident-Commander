import React from 'react';
import './App.css';
import { useAppContext } from './context/AppContext';
import { useIntegrationWorkflow } from './hooks/useIntegrationWorkflow';
import { useIncidentManagement } from './hooks/useIncidentManagement';
import IntegrationWorkflow from './components/IntegrationWorkflow';
import AgentTimeline from './components/AgentTimeline';
import IncidentReport from './components/IncidentReport';
import ComplianceReport from './components/ComplianceReport';
import AgentStatusBanner from './components/AgentStatusBanner';
import AIInvestigationTimeline from './components/AIInvestigationTimeline';

/**
 * MODERNIZED App Component
 * 
 * IMPROVEMENTS:
 * 1. Uses Context API for centralized state management
 * 2. Custom hooks encapsulate business logic
 * 3. Cleaner component structure with separated concerns
 * 4. Reduced prop drilling
 * 5. Better maintainability and testability
 * 
 * BEFORE: 316 lines with mixed concerns
 * AFTER: ~150 lines focused on UI orchestration
 */
function App() {
  // Context state
  const {
    integrationStatus,
    incident,
    complianceReport,
    investigationEvents,
    isLoading,
    activeTab,
    setActiveTab
  } = useAppContext();

  // Custom hooks for business logic
  const { triggerWorkflow } = useIntegrationWorkflow();
  const { fixApplied, applyFix, loadComplianceReport } = useIncidentManagement();

  /**
   * Handle workflow trigger with error handling
   */
  const handleTriggerIntegration = async () => {
    try {
      await triggerWorkflow();
    } catch (error) {
      alert('Failed to trigger integration');
    }
  };

  /**
   * Handle compliance report loading
   */
  const handleLoadCompliance = async () => {
    try {
      await loadComplianceReport();
    } catch (error) {
      alert('Failed to load compliance report');
    }
  };

  /**
   * Handle fix application with error handling
   */
  const handleApplyFix = async () => {
    try {
      await applyFix();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 
        'Failed to apply fix. Please check if the backend server is running.';
      throw new Error(errorMsg);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Integration Incident Commander</h1>
          <p className="subtitle">AI-Powered Integration Failure Analysis</p>
        </div>
      </header>

      <div className="container">
        {/* AI Agent Status Banner */}
        <AgentStatusBanner
          isActive={incident && incident.status === 'analyzing'}
          isComplete={incident && incident.status === 'analyzed'}
        />
        
        {/* Tab Navigation */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'workflow' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflow')}
          >
            Integration Workflow
          </button>
          <button 
            className={`tab ${activeTab === 'compliance' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('compliance');
              if (!complianceReport) handleLoadCompliance();
            }}
          >
            Compliance Report
          </button>
        </div>

        {/* Workflow Tab Content */}
        {activeTab === 'workflow' && (
          <>
            <div className="action-section">
              <button 
                className="trigger-button"
                onClick={handleTriggerIntegration}
                disabled={isLoading || (integrationStatus && integrationStatus.status === 'running')}
              >
                {isLoading ? 'Triggering...' : 'Trigger Integration Workflow'}
              </button>
              {integrationStatus && (
                <div className={`status-badge status-${integrationStatus.status}`}>
                  Status: {integrationStatus.status.toUpperCase()}
                </div>
              )}
            </div>

            {/* AI Investigation Timeline */}
            {investigationEvents.length > 0 && (
              <AIInvestigationTimeline events={investigationEvents} />
            )}

            {/* Integration Workflow Visualization */}
            {integrationStatus && (
              <IntegrationWorkflow integrationStatus={integrationStatus} />
            )}

            {/* Agent Analysis and Incident Report */}
            {incident && (
              <>
                <AgentTimeline
                  timeline={incident.timeline}
                  status={incident.status}
                />
                
                {incident.report && (
                  <IncidentReport
                    report={incident.report}
                    onApplyFix={handleApplyFix}
                    fixApplied={fixApplied}
                  />
                )}
              </>
            )}

            {/* Welcome Message */}
            {!integrationStatus && (
              <div className="welcome-message">
                <h2>Welcome to Integration Incident Commander</h2>
                <p>Click the button above to trigger a simulated integration workflow.</p>
                <p>The system will demonstrate AI-powered incident analysis using multiple specialized agents.</p>
              </div>
            )}
          </>
        )}

        {/* Compliance Tab Content */}
        {activeTab === 'compliance' && (
          <ComplianceReport report={complianceReport} />
        )}
      </div>

      <footer className="app-footer">
        <p>Integration Incident Commander v2.0 | Modernized Architecture</p>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob - Modernized Edition