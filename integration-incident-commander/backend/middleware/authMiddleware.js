const logger = require('../utils/logger');

/**
 * Authentication Middleware
 * 
 * FedRAMP Control: AC-2 (Account Management), IA-2 (Identification and Authentication)
 * Implements API authentication for protected endpoints
 * 
 * Security Control Evidence:
 * - Validates Authorization header presence
 * - Checks for Bearer token format
 * - Logs authentication attempts
 * - Returns 401 for unauthorized requests
 */

/**
 * Validate API authentication
 * Requires Authorization header with Bearer token
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Log authentication attempt
  logger.info(`Authentication attempt for ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });

  // Check if Authorization header exists
  if (!authHeader) {
    logger.warn(`Authentication failed: Missing Authorization header for ${req.path}`, {
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
    
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authorization header required',
      control: 'AC-2: Account Management'
    });
  }

  // Check Bearer token format
  if (!authHeader.startsWith('Bearer ')) {
    logger.warn(`Authentication failed: Invalid token format for ${req.path}`, {
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
    
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid authorization format. Expected: Bearer <token>',
      control: 'IA-2: Identification and Authentication'
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Validate token (simplified for demo)
  if (!token || token.length < 10) {
    logger.warn(`Authentication failed: Invalid token for ${req.path}`, {
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
    
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
      control: 'IA-2: Identification and Authentication'
    });
  }

  // Log successful authentication
  logger.info(`Authentication successful for ${req.method} ${req.path}`, {
    ip: req.ip,
    tokenPrefix: token.substring(0, 8) + '...',
    timestamp: new Date().toISOString()
  });

  // Attach token info to request for downstream use
  req.auth = {
    token: token,
    authenticated: true,
    timestamp: new Date().toISOString()
  };

  next();
};

/**
 * Optional authentication - allows requests with or without auth
 * Used for endpoints that benefit from auth but don't require it
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    req.auth = {
      token: token,
      authenticated: true,
      timestamp: new Date().toISOString()
    };
    logger.info(`Optional auth: Authenticated request for ${req.path}`);
  } else {
    req.auth = {
      authenticated: false,
      timestamp: new Date().toISOString()
    };
    logger.info(`Optional auth: Unauthenticated request for ${req.path}`);
  }
  
  next();
};

module.exports = {
  authenticate,
  optionalAuth
};

// Made with Bob
