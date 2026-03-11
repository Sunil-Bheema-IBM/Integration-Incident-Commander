import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Application State Context
 * Centralized state management for the Integration Incident Commander
 * 
 * MODERNIZATION: Replaces scattered useState calls in App.js with centralized state
 */
const AppContext = createContext(null);

/**
 * Initial state structure
 */
const initialState = {
  integrationStatus: null,
  incident: null,
  complianceReport: null,
  investigationEvents: [],
  fixApplied: false,
  isLoading: false,
  activeTab: 'workflow',
  error: null
};

/**
 * AppProvider Component
 * Provides application state and actions to all child components
 */
export const AppProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  /**
   * Reset all state to initial values
   * Used when triggering a new workflow
   */
  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  /**
   * Update integration status
   */
  const setIntegrationStatus = useCallback((status) => {
    setState(prev => ({ ...prev, integrationStatus: status }));
  }, []);

  /**
   * Set incident data
   */
  const setIncident = useCallback((incident) => {
    setState(prev => ({ ...prev, incident }));
  }, []);

  /**
   * Set compliance report
   */
  const setComplianceReport = useCallback((report) => {
    setState(prev => ({ ...prev, complianceReport: report }));
  }, []);

  /**
   * Add investigation event to timeline
   */
  const addInvestigationEvent = useCallback((type, message, details = null) => {
    const event = {
      type,
      message,
      details,
      timestamp: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      investigationEvents: [...prev.investigationEvents, event]
    }));
  }, []);

  /**
   * Set fix applied status
   */
  const setFixApplied = useCallback((applied) => {
    setState(prev => ({ ...prev, fixApplied: applied }));
  }, []);

  /**
   * Set loading state
   */
  const setLoading = useCallback((loading) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  /**
   * Set active tab
   */
  const setActiveTab = useCallback((tab) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  /**
   * Set error state
   */
  const setError = useCallback((error) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const value = {
    // State
    ...state,
    // Actions
    resetState,
    setIntegrationStatus,
    setIncident,
    setComplianceReport,
    addInvestigationEvent,
    setFixApplied,
    setLoading,
    setActiveTab,
    setError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Custom hook to use the App Context
 * Throws error if used outside of AppProvider
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;

// Made with Bob
