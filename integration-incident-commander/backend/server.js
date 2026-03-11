const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const logger = require('./utils/logger');
const integrationService = require('./services/integrationService');
const agentOrchestrator = require('./agents/agentOrchestrator');
const complianceService = require('./services/complianceService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// In-memory storage for demo purposes
const incidents = new Map();
const integrationRuns = new Map();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Trigger integration workflow
app.post('/api/integration/trigger', async (req, res) => {
  try {
    const runId = uuidv4();
    logger.info(`Triggering integration workflow: ${runId}`);

    // Initialize integration run
    const integrationRun = {
      id: runId,
      status: 'running',
      startTime: new Date().toISOString(),
      steps: []
    };
    integrationRuns.set(runId, integrationRun);

    // Execute integration workflow (async)
    integrationService.executeWorkflow(runId)
      .then(async (result) => {
        integrationRun.status = result.status;
        integrationRun.endTime = new Date().toISOString();
        integrationRun.steps = result.steps;

        // If failure occurred, trigger AI analysis
        if (result.status === 'failed') {
          logger.info(`Integration failed. Starting AI analysis for run: ${runId}`);
          
          const incidentId = uuidv4();
          const incident = {
            id: incidentId,
            integrationRunId: runId,
            status: 'analyzing',
            createdAt: new Date().toISOString(),
            logs: result.logs,
            timeline: [],
            report: null
          };
          incidents.set(incidentId, incident);
          integrationRun.incidentId = incidentId;

          // Start agent analysis
          const analysis = await agentOrchestrator.analyzeIncident(incident);
          incident.status = 'completed';
          incident.timeline = analysis.timeline;
          incident.report = analysis.report;
          incident.completedAt = new Date().toISOString();
        }
      })
      .catch((error) => {
        logger.error(`Integration workflow error: ${error.message}`);
        integrationRun.status = 'error';
        integrationRun.error = error.message;
      });

    res.json({
      success: true,
      runId: runId,
      message: 'Integration workflow triggered'
    });
  } catch (error) {
    logger.error(`Error triggering integration: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get integration status
app.get('/api/integration/status/:runId', (req, res) => {
  try {
    const { runId } = req.params;
    const integrationRun = integrationRuns.get(runId);

    if (!integrationRun) {
      return res.status(404).json({ error: 'Integration run not found' });
    }

    res.json(integrationRun);
  } catch (error) {
    logger.error(`Error getting integration status: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get incident details
app.get('/api/incidents/:incidentId', (req, res) => {
  try {
    const { incidentId } = req.params;
    const incident = incidents.get(incidentId);

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json(incident);
  } catch (error) {
    logger.error(`Error getting incident: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get incident timeline
app.get('/api/incidents/:incidentId/timeline', (req, res) => {
  try {
    const { incidentId } = req.params;
    const incident = incidents.get(incidentId);

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json({
      incidentId: incidentId,
      timeline: incident.timeline || [],
      status: incident.status
    });
  } catch (error) {
    logger.error(`Error getting timeline: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Apply AI fix and re-run integration
app.post('/api/integration/apply-fix', async (req, res) => {
  try {
    logger.info('Applying AI suggested fix');
    
    // Apply the fix to the integration service
    integrationService.applyFix();
    
    // Trigger a new integration run
    const runId = uuidv4();
    logger.info(`Re-running integration workflow with fix applied: ${runId}`);

    const integrationRun = {
      id: runId,
      status: 'running',
      startTime: new Date().toISOString(),
      steps: [],
      fixApplied: true
    };
    integrationRuns.set(runId, integrationRun);

    // Execute integration workflow (async)
    integrationService.executeWorkflow(runId)
      .then((result) => {
        integrationRun.status = result.status;
        integrationRun.endTime = new Date().toISOString();
        integrationRun.steps = result.steps;
        
        if (result.status === 'success') {
          logger.info(`Integration succeeded after applying AI fix: ${runId}`);
        }
      })
      .catch((error) => {
        logger.error(`Integration workflow error after fix: ${error.message}`);
        integrationRun.status = 'error';
        integrationRun.error = error.message;
      });

    res.json({
      success: true,
      runId: runId,
      message: 'AI fix applied. Integration workflow re-triggered.',
      fixApplied: 'Token Refresh Middleware Enabled'
    });
  } catch (error) {
    logger.error(`Error applying fix: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Get compliance report
app.get('/api/compliance/report', (req, res) => {
  try {
    const report = complianceService.generateReport();
    res.json(report);
  } catch (error) {
    logger.error(`Error generating compliance report: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// List all incidents
app.get('/api/incidents', (req, res) => {
  try {
    const allIncidents = Array.from(incidents.values());
    res.json(allIncidents);
  } catch (error) {
    logger.error(`Error listing incidents: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Integration Incident Commander Backend running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

// Made with Bob
