import React, { useState, useEffect } from 'react';
import './App.css';
import api from './services/api';
import IntegrationWorkflow from './components/IntegrationWorkflow';
import AgentTimeline from './components/AgentTimeline';
import IncidentReport from './components/IncidentReport';
import ComplianceReport from './components/ComplianceReport';
import AgentStatusBanner from './components/AgentStatusBanner';
import AIInvestigationTimeline from './components/AIInvestigationTimeline';

function App() {
  const [integrationStatus, setIntegrationStatus] = useState(null);
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('workflow');
  const [complianceReport, setComplianceReport] = useState(null);
  const [fixApplied, setFixApplied] = useState(false);
  const [investigationEvents, setInvestigationEvents] = useState([]);

  // Poll for integration status updates
  useEffect(() => {
    if (integrationStatus && integrationStatus.status === 'running') {
      const interval = setInterval(async () => {
        try {
          const status = await api.getIntegrationStatus(integrationStatus.id);
          setIntegrationStatus(status);
          
          // If failed, fetch incident details
          if (status.status === 'failed' && status.incidentId) {
            const incidentData = await api.getIncident(status.incidentId);
            setIncident(incidentData);
            
            // Poll for incident analysis completion
            if (incidentData.status === 'analyzing') {
              // Continue polling
            } else {
              clearInterval(interval);
            }
          } else if (status.status !== 'running') {
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error polling status:', error);
          clearInterval(interval);
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [integrationStatus]);

  // Poll for incident analysis updates
  useEffect(() => {
    if (incident && incident.status === 'analyzing') {
      const interval = setInterval(async () => {
        try {
          const incidentData = await api.getIncident(incident.id);
          setIncident(incidentData);
          
          if (incidentData.status === 'completed') {
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error polling incident:', error);
          clearInterval(interval);
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [incident]);

  // Track workflow step changes and add timeline events
  useEffect(() => {
    if (integrationStatus && integrationStatus.steps) {
      integrationStatus.steps.forEach((step, index) => {
        // Check if this step event already exists in timeline
        const stepEventExists = investigationEvents.some(
          e => e.message.includes(step.service) && e.type.includes('step_')
        );
        
        if (!stepEventExists) {
          if (step.success) {
            addTimelineEvent('step_success', `${step.service} completed successfully`);
          } else if (step.success === false) {
            addTimelineEvent('step_failed', `${step.service} failed`, step.error?.message || 'Unknown error');
          }
        }
      });
    }
  }, [integrationStatus]);

  // Track incident creation and agent analysis
  useEffect(() => {
    if (incident) {
      // Check if incident created event exists
      const incidentEventExists = investigationEvents.some(e => e.type === 'incident_created');
      if (!incidentEventExists) {
        addTimelineEvent('incident_created', 'Incident created - Starting AI analysis');
      }

      // Track agent timeline events
      if (incident.timeline) {
        incident.timeline.forEach(timelineItem => {
          const agentEventExists = investigationEvents.some(
            e => e.message.includes(timelineItem.agent)
          );
          
          if (!agentEventExists) {
            addTimelineEvent('agent_analyzing', `${timelineItem.agent} analyzing`, timelineItem.action);
          }
        });
      }

      // Track root cause identification
      if (incident.report && incident.status === 'completed') {
        const rootCauseExists = investigationEvents.some(e => e.type === 'root_cause');
        if (!rootCauseExists) {
          addTimelineEvent('root_cause', 'Root cause identified', incident.report.rootCause?.description);
          addTimelineEvent('fix_suggested', 'AI suggested fix generated', 'Token Refresh Middleware recommended');
        }
      }
    }
  }, [incident]);

  const addTimelineEvent = (type, message, details = null) => {
    const event = {
      type,
      message,
      details,
      timestamp: new Date().toISOString()
    };
    setInvestigationEvents(prev => [...prev, event]);
  };

  const handleTriggerIntegration = async () => {
    // Step 1: Reset all old UI state immediately (synchronous)
    setIntegrationStatus(null);
    setIncident(null);
    setFixApplied(false);
    setComplianceReport(null);
    setInvestigationEvents([]);  // Clear timeline
    
    // Step 2: Set loading/running state
    setLoading(true);
    
    // Add initial timeline event
    addTimelineEvent('workflow_triggered', 'Integration workflow triggered', 'Starting Order → Payment → Database flow');
    
    // Step 3-4: Call trigger API and fetch new workflow status
    try {
      const response = await api.triggerIntegration();
      const status = await api.getIntegrationStatus(response.runId);
      
      // Step 5: Render new result
      setIntegrationStatus(status);
    } catch (error) {
      console.error('Error triggering integration:', error);
      alert('Failed to trigger integration');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCompliance = async () => {
    try {
      const report = await api.getComplianceReport();
      setComplianceReport(report);
      setActiveTab('compliance');
    } catch (error) {
      console.error('Error loading compliance report:', error);
      alert('Failed to load compliance report');
    }
  };

  const handleApplyFix = async () => {
    try {
      // Add timeline events for fix application
      addTimelineEvent('fix_applied', 'AI fix applied', 'Enabling Token Refresh Middleware');
      
      console.log('Calling applyFixAndRerun API...');
      const response = await api.applyFixAndRerun();
      console.log('API Response:', response);
      
      if (!response.runId) {
        throw new Error('No runId returned from API');
      }
      
      addTimelineEvent('workflow_rerun', 'Re-running integration workflow', 'Testing with fix applied');
      
      // Wait a moment for the workflow to start
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const status = await api.getIntegrationStatus(response.runId);
      console.log('Integration Status:', status);
      
      setIntegrationStatus(status);
      setFixApplied(true);
      
      // Add success event when workflow completes successfully
      if (status.status === 'success') {
        addTimelineEvent('recovery_success', 'Integration recovered successfully', 'All services operational');
      }
      
      return response;
    } catch (error) {
      console.error('Error applying fix:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error; // Re-throw so IncidentReport can handle it
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
        {/* AI Agent Status Banner - Shows during and after incident analysis */}
        <AgentStatusBanner
          isActive={incident && incident.status === 'analyzing'}
          isComplete={incident && incident.status === 'analyzed'}
        />
        
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

        {activeTab === 'workflow' && (
          <>
            <div className="action-section">
              <button 
                className="trigger-button"
                onClick={handleTriggerIntegration}
                disabled={loading || (integrationStatus && integrationStatus.status === 'running')}
              >
                {loading ? 'Triggering...' : 'Trigger Integration Workflow'}
              </button>
              {integrationStatus && (
                <div className={`status-badge status-${integrationStatus.status}`}>
                  Status: {integrationStatus.status.toUpperCase()}
                </div>
              )}
            </div>

            {/* AI Investigation Timeline - Shows all events */}
            {investigationEvents.length > 0 && (
              <AIInvestigationTimeline events={investigationEvents} />
            )}

            {integrationStatus && (
              <IntegrationWorkflow
                integrationStatus={integrationStatus}
              />
            )}

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

            {!integrationStatus && (
              <div className="welcome-message">
                <h2>Welcome to Integration Incident Commander</h2>
                <p>Click the button above to trigger a simulated integration workflow.</p>
                <p>The system will demonstrate AI-powered incident analysis using multiple specialized agents.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'compliance' && (
          <ComplianceReport report={complianceReport} />
        )}
      </div>

      <footer className="app-footer">
        <p>Integration Incident Commander v1.0 | AI-Powered Incident Analysis</p>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob
