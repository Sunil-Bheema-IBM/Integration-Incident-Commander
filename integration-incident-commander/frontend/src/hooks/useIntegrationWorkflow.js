import { useCallback, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';

/**
 * Custom Hook: useIntegrationWorkflow
 * 
 * MODERNIZATION: Encapsulates integration workflow logic
 * - Handles workflow triggering
 * - Manages polling for status updates
 * - Tracks workflow events in timeline
 * 
 * Benefits:
 * - Separates business logic from UI components
 * - Reusable across different components
 * - Easier to test and maintain
 */
export const useIntegrationWorkflow = () => {
  const {
    integrationStatus,
    incident,
    investigationEvents,
    setIntegrationStatus,
    setIncident,
    setLoading,
    addInvestigationEvent,
    resetState
  } = useAppContext();

  /**
   * Poll for integration status updates
   */
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
            
            if (incidentData.status !== 'analyzing') {
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
  }, [integrationStatus, setIntegrationStatus, setIncident]);

  /**
   * Poll for incident analysis updates
   */
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
  }, [incident, setIncident]);

  /**
   * Track workflow step changes and add timeline events
   */
  useEffect(() => {
    if (integrationStatus && integrationStatus.steps) {
      integrationStatus.steps.forEach((step) => {
        const stepEventExists = investigationEvents.some(
          e => e.message.includes(step.service) && e.type.includes('step_')
        );
        
        if (!stepEventExists) {
          if (step.success) {
            addInvestigationEvent('step_success', `${step.service} completed successfully`);
          } else if (step.success === false) {
            addInvestigationEvent('step_failed', `${step.service} failed`, step.error?.message || 'Unknown error');
          }
        }
      });
    }
  }, [integrationStatus, investigationEvents, addInvestigationEvent]);

  /**
   * Track incident creation and agent analysis
   */
  useEffect(() => {
    if (incident) {
      const incidentEventExists = investigationEvents.some(e => e.type === 'incident_created');
      if (!incidentEventExists) {
        addInvestigationEvent('incident_created', 'Incident created - Starting AI analysis');
      }

      if (incident.timeline) {
        incident.timeline.forEach(timelineItem => {
          const agentEventExists = investigationEvents.some(
            e => e.message.includes(timelineItem.agent)
          );
          
          if (!agentEventExists) {
            addInvestigationEvent('agent_analyzing', `${timelineItem.agent} analyzing`, timelineItem.action);
          }
        });
      }

      if (incident.report && incident.status === 'completed') {
        const rootCauseExists = investigationEvents.some(e => e.type === 'root_cause');
        if (!rootCauseExists) {
          addInvestigationEvent('root_cause', 'Root cause identified', incident.report.rootCause?.description);
          addInvestigationEvent('fix_suggested', 'AI suggested fix generated', 'Token Refresh Middleware recommended');
        }
      }
    }
  }, [incident, investigationEvents, addInvestigationEvent]);

  /**
   * Trigger integration workflow
   */
  const triggerWorkflow = useCallback(async () => {
    resetState();
    setLoading(true);
    
    addInvestigationEvent('workflow_triggered', 'Integration workflow triggered', 'Starting Order → Payment → Database flow');
    
    try {
      const response = await api.triggerIntegration();
      const status = await api.getIntegrationStatus(response.runId);
      setIntegrationStatus(status);
    } catch (error) {
      console.error('Error triggering integration:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [resetState, setLoading, addInvestigationEvent, setIntegrationStatus]);

  return {
    integrationStatus,
    incident,
    triggerWorkflow
  };
};

// Made with Bob
