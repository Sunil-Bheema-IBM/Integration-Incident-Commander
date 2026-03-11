const logger = require('../utils/logger');

/**
 * Simulates an enterprise integration workflow
 * Flow: Frontend → Order API → Payment Service → Database
 */
class IntegrationService {
  constructor() {
    this.logs = [];
    this.fixApplied = false; // Track if AI fix has been applied
  }

  /**
   * Apply AI suggested fix (simulation)
   */
  applyFix() {
    this.fixApplied = true;
    logger.info('AI Fix Applied: Token Refresh Middleware Enabled');
  }

  /**
   * Execute the integration workflow
   */
  async executeWorkflow(runId) {
    this.logs = [];
    const steps = [];

    try {
      logger.info(`Starting integration workflow: ${runId}`);

      // Step 1: Order API
      const orderStep = await this.callOrderAPI(runId);
      steps.push(orderStep);
      
      if (!orderStep.success) {
        return this.buildFailureResponse(runId, steps);
      }

      // Step 2: Payment Service
      const paymentStep = await this.callPaymentService(runId, orderStep.data);
      steps.push(paymentStep);
      
      if (!paymentStep.success) {
        return this.buildFailureResponse(runId, steps);
      }

      // Step 3: Database
      const dbStep = await this.saveToDatabase(runId, paymentStep.data);
      steps.push(dbStep);
      
      if (!dbStep.success) {
        return this.buildFailureResponse(runId, steps);
      }

      logger.info(`Integration workflow completed successfully: ${runId}`);
      return {
        status: 'success',
        steps: steps,
        logs: this.logs
      };

    } catch (error) {
      logger.error(`Integration workflow error: ${error.message}`);
      return this.buildFailureResponse(runId, steps, error);
    }
  }

  /**
   * Simulate Order API call
   */
  async callOrderAPI(runId) {
    const timestamp = new Date().toISOString();
    
    this.addLog('info', 'OrderAPI', 'Received order request', { runId });
    
    // Simulate processing delay
    await this.delay(500);
    
    this.addLog('info', 'OrderAPI', 'Order validated successfully', { 
      orderId: 'ORD-' + runId.substring(0, 8),
      amount: 299.99
    });

    return {
      service: 'OrderAPI',
      success: true,
      timestamp: timestamp,
      data: {
        orderId: 'ORD-' + runId.substring(0, 8),
        amount: 299.99,
        currency: 'USD'
      }
    };
  }

  /**
   * Simulate Payment Service call
   * Fails on first run, succeeds after AI fix is applied
   */
  async callPaymentService(runId, orderData) {
    const timestamp = new Date().toISOString();
    
    this.addLog('info', 'PaymentService', 'Processing payment request', {
      orderId: orderData.orderId,
      amount: orderData.amount
    });
    
    // Simulate processing delay
    await this.delay(800);
    
    // Check if AI fix has been applied
    if (this.fixApplied) {
      // SUCCESS: Token refresh middleware is working
      this.addLog('info', 'PaymentService', 'Token refreshed automatically', {
        message: 'Token Refresh Middleware intercepted expired token and obtained new token'
      });
      
      this.addLog('info', 'PaymentService', 'Payment processed successfully', {
        transactionId: 'TXN-' + runId.substring(0, 8),
        amount: orderData.amount,
        status: 'approved'
      });

      return {
        service: 'PaymentService',
        success: true,
        timestamp: timestamp,
        data: {
          transactionId: 'TXN-' + runId.substring(0, 8),
          amount: orderData.amount,
          status: 'approved',
          fixApplied: 'Token Refresh Middleware Enabled'
        }
      };
    } else {
      // FAILURE: Authentication token expired (original behavior)
      this.addLog('error', 'PaymentService', 'Authentication failed', {
        errorCode: 401,
        errorMessage: 'Authentication token expired',
        details: 'OAuth token has expired. Token was issued 24 hours ago and has exceeded maximum lifetime.'
      });

      return {
        service: 'PaymentService',
        success: false,
        timestamp: timestamp,
        error: {
          code: 401,
          message: 'Authentication token expired',
          details: 'OAuth token has expired. Token was issued 24 hours ago and has exceeded maximum lifetime.'
        }
      };
    }
  }

  /**
   * Simulate Database save
   */
  async saveToDatabase(runId, paymentData) {
    const timestamp = new Date().toISOString();
    
    this.addLog('info', 'Database', 'Saving transaction', { 
      transactionId: paymentData.transactionId 
    });
    
    await this.delay(300);
    
    this.addLog('info', 'Database', 'Transaction saved successfully', {
      transactionId: paymentData.transactionId
    });

    return {
      service: 'Database',
      success: true,
      timestamp: timestamp,
      data: {
        saved: true,
        transactionId: paymentData.transactionId
      }
    };
  }

  /**
   * Add log entry
   */
  addLog(level, service, message, metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level,
      service: service,
      message: message,
      metadata: metadata
    };
    
    this.logs.push(logEntry);
    logger[level](`[${service}] ${message}`, metadata);
  }

  /**
   * Build failure response
   */
  buildFailureResponse(runId, steps, error = null) {
    return {
      status: 'failed',
      steps: steps,
      logs: this.logs,
      error: error ? error.message : 'Integration workflow failed'
    };
  }

  /**
   * Simulate async delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new IntegrationService();

// Made with Bob
