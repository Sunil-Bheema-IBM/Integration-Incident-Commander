const logger = require('../utils/logger');
const productOwnerAgent = require('./productOwnerAgent');
const developerAgent = require('./developerAgent');
const architectAgent = require('./architectAgent');
const securityAgent = require('./securityAgent');

/**
 * Orchestrates the multi-agent incident analysis workflow
 */
class AgentOrchestrator {
  /**
   * Analyze incident using multi-agent workflow
   */
  async analyzeIncident(incident) {
    logger.info(`Starting multi-agent analysis for incident: ${incident.id}`);
    
    const timeline = [];
    const startTime = Date.now();

    try {
      // Step 1: Product Owner Agent - Define scope
      logger.info('Invoking Product Owner Agent');
      const poAnalysis = await this.invokeAgent(
        productOwnerAgent,
        incident,
        null
      );
      timeline.push(poAnalysis);
      await this.delay(500);

      // Step 2: Developer Agent - Technical analysis
      logger.info('Invoking Developer Agent');
      const devAnalysis = await this.invokeAgent(
        developerAgent,
        incident,
        poAnalysis
      );
      timeline.push(devAnalysis);
      await this.delay(700);

      // Step 3: Architect Agent - Dependency impact
      logger.info('Invoking Architect Agent');
      const archAnalysis = await this.invokeAgent(
        architectAgent,
        incident,
        { poAnalysis, devAnalysis }
      );
      timeline.push(archAnalysis);
      await this.delay(600);

      // Step 4: Security Agent - Compliance check
      logger.info('Invoking Security Agent');
      const secAnalysis = await this.invokeAgent(
        securityAgent,
        incident,
        { poAnalysis, devAnalysis, archAnalysis }
      );
      timeline.push(secAnalysis);
      await this.delay(500);

      // Generate final report
      const report = this.generateFinalReport(
        incident,
        { poAnalysis, devAnalysis, archAnalysis, secAnalysis }
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      logger.info(`Multi-agent analysis completed in ${duration}ms`);

      return {
        timeline: timeline,
        report: report,
        duration: duration
      };

    } catch (error) {
      logger.error(`Agent orchestration error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Invoke a single agent
   */
  async invokeAgent(agent, incident, previousAnalysis) {
    const startTime = Date.now();
    
    try {
      const analysis = await agent.analyze(incident, previousAnalysis);
      const endTime = Date.now();
      
      return {
        agent: agent.name,
        role: agent.role,
        timestamp: new Date().toISOString(),
        duration: endTime - startTime,
        status: 'completed',
        analysis: analysis
      };
    } catch (error) {
      logger.error(`Agent ${agent.name} error: ${error.message}`);
      return {
        agent: agent.name,
        role: agent.role,
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Generate final incident report
   */
  generateFinalReport(incident, analyses) {
    const { poAnalysis, devAnalysis, archAnalysis, secAnalysis } = analyses;

    // Calculate overall confidence
    const confidenceScores = [
      devAnalysis.analysis.confidence,
      archAnalysis.analysis.confidence,
      secAnalysis.analysis.confidence
    ].filter(score => typeof score === 'number');
    
    const avgConfidence = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;

    return {
      incidentId: incident.id,
      summary: poAnalysis.analysis.summary,
      rootCause: {
        description: devAnalysis.analysis.rootCause,
        technicalDetails: devAnalysis.analysis.technicalDetails,
        confidence: devAnalysis.analysis.confidence
      },
      impactedServices: archAnalysis.analysis.impactedServices,
      dependencies: archAnalysis.analysis.dependencies,
      suggestedFix: {
        immediate: devAnalysis.analysis.suggestedFix,
        longTerm: archAnalysis.analysis.recommendations
      },
      securityImpact: {
        severity: secAnalysis.analysis.severity,
        complianceIssues: secAnalysis.analysis.complianceIssues,
        recommendations: secAnalysis.analysis.recommendations
      },
      overallConfidence: Math.round(avgConfidence),
      priority: this.calculatePriority(devAnalysis, archAnalysis, secAnalysis),
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Calculate incident priority
   */
  calculatePriority(devAnalysis, archAnalysis, secAnalysis) {
    const impactedCount = archAnalysis.analysis.impactedServices.length;
    const securitySeverity = secAnalysis.analysis.severity;

    if (securitySeverity === 'critical' || impactedCount > 3) {
      return 'P1 - Critical';
    } else if (securitySeverity === 'high' || impactedCount > 1) {
      return 'P2 - High';
    } else if (securitySeverity === 'medium') {
      return 'P3 - Medium';
    } else {
      return 'P4 - Low';
    }
  }

  /**
   * Simulate async delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new AgentOrchestrator();

// Made with Bob
