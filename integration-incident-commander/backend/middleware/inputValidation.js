const logger = require('../utils/logger');

/**
 * Input Validation Middleware
 * 
 * FedRAMP Control: SI-10 (Information Input Validation)
 * Implements input validation for API endpoints
 * 
 * Security Control Evidence:
 * - Validates request parameters
 * - Sanitizes input data
 * - Prevents injection attacks
 * - Returns 400 for invalid input
 */

/**
 * Validate UUID format
 */
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validate integration trigger request
 * FedRAMP Control: SI-10 - Information Input Validation
 */
const validateIntegrationTrigger = (req, res, next) => {
  logger.info('Validating integration trigger request');

  // Validate request body exists
  if (req.body && typeof req.body !== 'object') {
    logger.warn('Invalid request body type', { type: typeof req.body });
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Request body must be a valid JSON object',
      control: 'SI-10: Information Input Validation'
    });
  }

  // Validate optional parameters if provided
  if (req.body.config) {
    if (typeof req.body.config !== 'object') {
      logger.warn('Invalid config parameter type');
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Config parameter must be an object',
        control: 'SI-10: Information Input Validation'
      });
    }
  }

  // Sanitize any string inputs
  if (req.body.description) {
    req.body.description = sanitizeString(req.body.description);
  }

  logger.info('Integration trigger request validated successfully');
  next();
};

/**
 * Validate run ID parameter
 * FedRAMP Control: SI-10 - Information Input Validation
 */
const validateRunId = (req, res, next) => {
  const { runId } = req.params;

  if (!runId) {
    logger.warn('Missing runId parameter');
    return res.status(400).json({
      error: 'Bad Request',
      message: 'runId parameter is required',
      control: 'SI-10: Information Input Validation'
    });
  }

  if (!isValidUUID(runId)) {
    logger.warn('Invalid runId format', { runId });
    return res.status(400).json({
      error: 'Bad Request',
      message: 'runId must be a valid UUID',
      control: 'SI-10: Information Input Validation'
    });
  }

  logger.info('RunId validated successfully', { runId });
  next();
};

/**
 * Validate incident ID parameter
 * FedRAMP Control: SI-10 - Information Input Validation
 */
const validateIncidentId = (req, res, next) => {
  const { incidentId } = req.params;

  if (!incidentId) {
    logger.warn('Missing incidentId parameter');
    return res.status(400).json({
      error: 'Bad Request',
      message: 'incidentId parameter is required',
      control: 'SI-10: Information Input Validation'
    });
  }

  if (!isValidUUID(incidentId)) {
    logger.warn('Invalid incidentId format', { incidentId });
    return res.status(400).json({
      error: 'Bad Request',
      message: 'incidentId must be a valid UUID',
      control: 'SI-10: Information Input Validation'
    });
  }

  logger.info('IncidentId validated successfully', { incidentId });
  next();
};

/**
 * Sanitize string input to prevent XSS and injection attacks
 * FedRAMP Control: SI-10 - Information Input Validation
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
};

/**
 * Validate query parameters
 * FedRAMP Control: SI-10 - Information Input Validation
 */
const validateQueryParams = (allowedParams) => {
  return (req, res, next) => {
    const queryKeys = Object.keys(req.query);
    
    // Check for unexpected parameters
    const invalidParams = queryKeys.filter(key => !allowedParams.includes(key));
    
    if (invalidParams.length > 0) {
      logger.warn('Invalid query parameters detected', { invalidParams });
      return res.status(400).json({
        error: 'Bad Request',
        message: `Invalid query parameters: ${invalidParams.join(', ')}`,
        allowedParams: allowedParams,
        control: 'SI-10: Information Input Validation'
      });
    }

    // Sanitize string query parameters
    queryKeys.forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    });

    logger.info('Query parameters validated successfully');
    next();
  };
};

/**
 * Validate pagination parameters
 * FedRAMP Control: SI-10 - Information Input Validation
 */
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      logger.warn('Invalid page parameter', { page });
      return res.status(400).json({
        error: 'Bad Request',
        message: 'page must be a positive integer',
        control: 'SI-10: Information Input Validation'
      });
    }
    req.query.page = pageNum;
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      logger.warn('Invalid limit parameter', { limit });
      return res.status(400).json({
        error: 'Bad Request',
        message: 'limit must be between 1 and 100',
        control: 'SI-10: Information Input Validation'
      });
    }
    req.query.limit = limitNum;
  }

  logger.info('Pagination parameters validated successfully');
  next();
};

/**
 * General request validation middleware
 * Validates common security requirements
 */
const validateRequest = (req, res, next) => {
  // Check Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    
    if (!contentType || !contentType.includes('application/json')) {
      logger.warn('Invalid Content-Type header', { contentType });
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Content-Type must be application/json',
        control: 'SI-10: Information Input Validation'
      });
    }
  }

  // Check request size (prevent DoS)
  const contentLength = req.headers['content-length'];
  if (contentLength && parseInt(contentLength) > 1048576) { // 1MB limit
    logger.warn('Request too large', { contentLength });
    return res.status(413).json({
      error: 'Payload Too Large',
      message: 'Request body must be less than 1MB',
      control: 'SI-10: Information Input Validation'
    });
  }

  next();
};

module.exports = {
  validateIntegrationTrigger,
  validateRunId,
  validateIncidentId,
  validateQueryParams,
  validatePagination,
  validateRequest,
  sanitizeString,
  isValidUUID
};

// Made with Bob
