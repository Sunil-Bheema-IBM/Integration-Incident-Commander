const logger = require('../utils/logger');
const auditLogger = require('../middleware/auditLogger');

/**
 * Token Lifecycle Service
 * 
 * FedRAMP Control: IA-5 (Authenticator Management), SC-23 (Session Authenticity)
 * Implements OAuth token lifecycle management and validation
 * 
 * Security Control Evidence:
 * - Validates token expiration
 * - Detects expired tokens
 * - Simulates token refresh mechanism
 * - Logs all token lifecycle events
 */

class TokenService {
  constructor() {
    // Simulated token database (in production, use Redis or database)
    this.tokens = new Map();
    this.tokenLifetimeMinutes = 60; // 60 minutes default
  }

  /**
   * Generate a simulated OAuth token
   * In production, this would integrate with OAuth provider
   */
  generateToken(userId = 'demo-user') {
    const token = `demo_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const expiresAt = new Date(Date.now() + this.tokenLifetimeMinutes * 60 * 1000);
    
    const tokenData = {
      token: token,
      userId: userId,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      refreshCount: 0,
      isValid: true
    };

    this.tokens.set(token, tokenData);
    
    logger.info('Token generated', {
      tokenPrefix: token.substring(0, 15) + '...',
      expiresAt: expiresAt.toISOString()
    });

    return tokenData;
  }

  /**
   * Validate token and check expiration
   * FedRAMP Control: IA-5(1) - Password-based Authentication
   */
  validateToken(token) {
    if (!token) {
      auditLogger.logTokenValidation(token, false, 'missing');
      return {
        valid: false,
        reason: 'Token is missing',
        requiresRefresh: false
      };
    }

    const tokenData = this.tokens.get(token);

    if (!tokenData) {
      auditLogger.logTokenValidation(token, false, 'not_found');
      return {
        valid: false,
        reason: 'Token not found or invalid',
        requiresRefresh: false
      };
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expiresAt);

    if (now > expiresAt) {
      auditLogger.logTokenValidation(token, false, 'expired');
      return {
        valid: false,
        reason: 'Token has expired',
        requiresRefresh: true,
        expiredAt: tokenData.expiresAt,
        control: 'IA-5: Authenticator Management'
      };
    }

    // Check if token was revoked
    if (!tokenData.isValid) {
      auditLogger.logTokenValidation(token, false, 'revoked');
      return {
        valid: false,
        reason: 'Token has been revoked',
        requiresRefresh: true
      };
    }

    auditLogger.logTokenValidation(token, true);
    return {
      valid: true,
      userId: tokenData.userId,
      expiresAt: tokenData.expiresAt,
      control: 'IA-5: Authenticator Management'
    };
  }

  /**
   * Refresh an expired token
   * FedRAMP Control: IA-5(1) - Password-based Authentication
   */
  refreshToken(oldToken) {
    const tokenData = this.tokens.get(oldToken);

    if (!tokenData) {
      logger.warn('Token refresh failed: Token not found');
      return {
        success: false,
        reason: 'Token not found'
      };
    }

    // Generate new token
    const newTokenData = this.generateToken(tokenData.userId);
    newTokenData.refreshCount = tokenData.refreshCount + 1;
    newTokenData.previousToken = oldToken;

    // Invalidate old token
    tokenData.isValid = false;
    tokenData.refreshedAt = new Date().toISOString();

    logger.info('Token refreshed', {
      oldTokenPrefix: oldToken.substring(0, 15) + '...',
      newTokenPrefix: newTokenData.token.substring(0, 15) + '...',
      refreshCount: newTokenData.refreshCount
    });

    return {
      success: true,
      token: newTokenData.token,
      expiresAt: newTokenData.expiresAt,
      refreshCount: newTokenData.refreshCount,
      control: 'IA-5: Authenticator Management - Token Refresh'
    };
  }

  /**
   * Simulate token expiration for demo purposes
   * This allows us to demonstrate the token refresh mechanism
   */
  expireToken(token) {
    const tokenData = this.tokens.get(token);
    
    if (tokenData) {
      tokenData.expiresAt = new Date(Date.now() - 1000).toISOString(); // Expire 1 second ago
      logger.info('Token manually expired for demo', {
        tokenPrefix: token.substring(0, 15) + '...'
      });
      return true;
    }
    
    return false;
  }

  /**
   * Revoke a token
   * FedRAMP Control: IA-5(2) - PKI-based Authentication
   */
  revokeToken(token) {
    const tokenData = this.tokens.get(token);
    
    if (tokenData) {
      tokenData.isValid = false;
      tokenData.revokedAt = new Date().toISOString();
      
      logger.info('Token revoked', {
        tokenPrefix: token.substring(0, 15) + '...'
      });
      
      return true;
    }
    
    return false;
  }

  /**
   * Get token information (for debugging/compliance)
   */
  getTokenInfo(token) {
    const tokenData = this.tokens.get(token);
    
    if (!tokenData) {
      return null;
    }

    return {
      tokenPrefix: token.substring(0, 15) + '...',
      userId: tokenData.userId,
      createdAt: tokenData.createdAt,
      expiresAt: tokenData.expiresAt,
      refreshCount: tokenData.refreshCount,
      isValid: tokenData.isValid,
      isExpired: new Date() > new Date(tokenData.expiresAt)
    };
  }

  /**
   * Simulate Payment Service token expiration scenario
   * This is used in the integration workflow to demonstrate token refresh
   */
  simulatePaymentServiceTokenExpiration() {
    logger.info('Simulating Payment Service token expiration scenario');
    return {
      expired: true,
      errorCode: 401,
      errorMessage: 'OAuth token expired',
      requiresRefresh: true,
      control: 'IA-5: Authenticator Management'
    };
  }

  /**
   * Apply token refresh middleware (AI remediation)
   * This simulates the AI-suggested fix being applied
   */
  applyTokenRefreshMiddleware() {
    logger.info('Applying Token Refresh Middleware (AI Remediation)');
    
    // In a real system, this would:
    // 1. Update configuration to enable automatic token refresh
    // 2. Deploy middleware to intercept 401 errors
    // 3. Automatically refresh tokens before expiration
    
    return {
      applied: true,
      middleware: 'TOKEN_REFRESH_MIDDLEWARE',
      description: 'Automatically refreshes OAuth tokens before expiration',
      control: 'IA-5: Authenticator Management - Automated Token Refresh'
    };
  }

  /**
   * Get all tokens (for compliance reporting)
   */
  getAllTokens() {
    const tokens = [];
    this.tokens.forEach((tokenData, token) => {
      tokens.push({
        tokenPrefix: token.substring(0, 15) + '...',
        userId: tokenData.userId,
        createdAt: tokenData.createdAt,
        expiresAt: tokenData.expiresAt,
        isValid: tokenData.isValid,
        isExpired: new Date() > new Date(tokenData.expiresAt),
        refreshCount: tokenData.refreshCount
      });
    });
    return tokens;
  }
}

// Singleton instance
const tokenService = new TokenService();

module.exports = tokenService;

// Made with Bob
