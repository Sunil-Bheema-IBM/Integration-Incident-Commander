import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';

/**
 * Custom Hook: useIncidentManagement
 * 
 * MODERNIZATION: Encapsulates incident and fix management logic
 * - Handles AI fix application
 * - Manages compliance report loading
 * - Tracks fix application events
 * 
 * Benefits:
 * - Separates incident management from UI
 * - Centralized error handling
 * - Reusable business logic
 */
export const useIncidentManagement = () => {
  const {
    incident,
    complianceReport,
    fixApplied,
    setIntegrationStatus,
    setComplianceReport,
    setFixApplied,
    setActiveTab,
    addInvestigationEvent
  } = useAppContext();

  /**
   * Apply AI-suggested fix and re-run integration
   */
  const applyFix = useCallback(async () => {
    try {
      addInvestigationEvent('fix_applied', 'AI fix applied', 'Enabling Token Refresh Middleware');
      
      const response = await api.applyFixAndRerun();
      
      if (!response.runId) {
        throw new Error('No runId returned from API');
      }
      
      addInvestigationEvent('workflow_rerun', 'Re-running integration workflow', 'Testing with fix applied');
      
      // Wait for workflow to start
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const status = await api.getIntegrationStatus(response.runId);
      setIntegrationStatus(status);
      setFixApplied(true);
      
      // Add success event when workflow completes
      if (status.status === 'success') {
        addInvestigationEvent('recovery_success', 'Integration recovered successfully', 'All services operational');
      }
      
      return response;
    } catch (error) {
      console.error('Error applying fix:', error);
      throw error;
    }
  }, [setIntegrationStatus, setFixApplied, addInvestigationEvent]);

  /**
   * Load compliance report
   */
  const loadComplianceReport = useCallback(async () => {
    try {
      const report = await api.getComplianceReport();
      setComplianceReport(report);
      setActiveTab('compliance');
      return report;
    } catch (error) {
      console.error('Error loading compliance report:', error);
      throw error;
    }
  }, [setComplianceReport, setActiveTab]);

  return {
    incident,
    complianceReport,
    fixApplied,
    applyFix,
    loadComplianceReport
  };
};

// Made with Bob
