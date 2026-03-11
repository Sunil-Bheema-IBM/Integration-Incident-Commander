import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = {
  /**
   * Trigger integration workflow
   */
  triggerIntegration: async () => {
    const response = await axios.post(`${API_BASE_URL}/integration/trigger`);
    return response.data;
  },

  /**
   * Get integration status
   */
  getIntegrationStatus: async (runId) => {
    const response = await axios.get(`${API_BASE_URL}/integration/status/${runId}`);
    return response.data;
  },

  /**
   * Apply AI fix and re-run integration
   */
  applyFixAndRerun: async () => {
    const response = await axios.post(`${API_BASE_URL}/integration/apply-fix`);
    return response.data;
  },

  /**
   * Get incident details
   */
  getIncident: async (incidentId) => {
    const response = await axios.get(`${API_BASE_URL}/incidents/${incidentId}`);
    return response.data;
  },

  /**
   * Get incident timeline
   */
  getIncidentTimeline: async (incidentId) => {
    const response = await axios.get(`${API_BASE_URL}/incidents/${incidentId}/timeline`);
    return response.data;
  },

  /**
   * Get compliance report
   */
  getComplianceReport: async () => {
    const response = await axios.get(`${API_BASE_URL}/compliance/report`);
    return response.data;
  },

  /**
   * Get all incidents
   */
  getAllIncidents: async () => {
    const response = await axios.get(`${API_BASE_URL}/incidents`);
    return response.data;
  }
};

export default api;

// Made with Bob
