# Security Documentation

## Integration Incident Commander - Security Implementation Guide

This document provides comprehensive security documentation for the Integration Incident Commander system, detailing all implemented security controls, configurations, and best practices.

---

## Table of Contents

1. [Security Overview](#security-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Audit Logging](#audit-logging)
4. [Token Lifecycle Management](#token-lifecycle-management)
5. [Input Validation](#input-validation)
6. [Data Protection](#data-protection)
7. [Incident Response](#incident-response)
8. [Security Configuration](#security-configuration)
9. [Security Testing](#security-testing)
10. [Security Monitoring](#security-monitoring)

---

## Security Overview

### Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Transport Security (HTTPS/TLS)                    │
│  Layer 2: Authentication (Bearer Token)                     │
│  Layer 3: Input Validation (Sanitization)                   │
│  Layer 4: Audit Logging (Comprehensive Tracking)            │
│  Layer 5: Token Lifecycle (Expiration & Refresh)            │
│  Layer 6: Incident Response (AI-Driven Analysis)            │
└─────────────────────────────────────────────────────────────┘
```

### Security Principles

1. **Defense in Depth** - Multiple layers of security controls
2. **Least Privilege** - Minimal access rights for operations
3. **Fail Secure** - System fails to secure state
4. **Audit Everything** - Comprehensive logging of security events
5. **Automated Response** - AI-driven incident detection and remediation

### FedRAMP Controls Implemented

- **AC-2:** Account Management
- **IA-2:** Identification and Authentication
- **IA-5:** Authenticator Management
- **AU-2:** Audit Events
- **AU-3:** Content of Audit Records
- **SI-10:** Information Input Validation
- **SC-8:** Transmission Confidentiality
- **SC-23:** Session Authenticity
- **CA-2:** Security Assessments
- **CM-3:** Configuration Change Control
- **IR-4:** Incident Handling

---

## Authentication & Authorization

### Implementation

**File:** `backend/middleware/authMiddleware.js`

### Bearer Token Authentication

All protected API endpoints require Bearer token authentication:

```javascript
Authorization: Bearer <token>
```

### Authentication Flow

```
1. Client sends request with Authorization header
2. Middleware extracts Bearer token
3. Token format validated (Bearer prefix, minimum length)
4. Token authenticated
5. Request proceeds or 401 returned
6. All attempts logged to audit log
```

### Protected Endpoints

| Endpoint | Method | Authentication Required |
|----------|--------|------------------------|
| `/api/integration/trigger` | POST | Optional (demo mode) |
| `/api/integration/status/:runId` | GET | Optional |
| `/api/integration/apply-fix` | POST | Optional |
| `/api/incidents/:incidentId` | GET | Optional |
| `/api/compliance/report` | GET | Optional |

**Note:** In production, all endpoints should require authentication. Demo mode allows unauthenticated access for testing.

### Authentication Errors

| Error | Status | Description |
|-------|--------|-------------|
| Missing Authorization | 401 | No Authorization header provided |
| Invalid Format | 401 | Token not in Bearer format |
| Invalid Token | 401 | Token validation failed |

### Security Features

- ✅ Bearer token format validation
- ✅ Token length validation (minimum 10 characters)
- ✅ Authentication attempt logging
- ✅ Failed authentication tracking
- ✅ IP address logging
- ✅ User agent logging

### Usage Example

```bash
# Successful authentication
curl -H "Authorization: Bearer demo_token_1234567890_abc" \
  http://localhost:3001/api/integration/trigger

# Failed authentication (missing header)
curl http://localhost:3001/api/integration/trigger
# Returns: 401 Unauthorized

# Failed authentication (invalid format)
curl -H "Authorization: InvalidToken" \
  http://localhost:3001/api/integration/trigger
# Returns: 401 Unauthorized
```

---

## Audit Logging

### Implementation

**File:** `backend/middleware/auditLogger.js`

### Audit Log Location

```
backend/logs/audit.log
```

### Events Logged

| Event Type | Category | Severity | Description |
|------------|----------|----------|-------------|
| WORKFLOW_TRIGGER | INTEGRATION | INFO | Integration workflow triggered |
| SERVICE_FAILURE | INTEGRATION | ERROR | Service failure in workflow |
| INCIDENT_CREATED | SECURITY | WARNING | Security incident created |
| REMEDIATION_APPLIED | CONFIGURATION | INFO | AI remediation applied |
| AUTH_SUCCESS | AUTHENTICATION | INFO | Successful authentication |
| AUTH_FAILURE | AUTHENTICATION | WARNING | Failed authentication |
| TOKEN_VALID | AUTHENTICATION | INFO | Token validation successful |
| TOKEN_INVALID | AUTHENTICATION | WARNING | Token validation failed |
| COMPLIANCE_REPORT_GENERATED | COMPLIANCE | INFO | Compliance report generated |

### Audit Log Format

```json
{
  "timestamp": "2026-03-11T12:00:00.000Z",
  "eventType": "WORKFLOW_TRIGGER",
  "eventCategory": "INTEGRATION",
  "severity": "INFO",
  "user": "authenticated_user",
  "sourceIP": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "resource": "/api/integration/trigger",
  "action": "CREATE",
  "outcome": "SUCCESS",
  "details": {
    "runId": "abc-123-def-456",
    "method": "POST"
  },
  "control": "AU-2: Audit Events"
}
```

### Required Fields (FedRAMP AU-3)

- ✅ **What:** eventType, eventCategory, action
- ✅ **When:** timestamp (ISO 8601)
- ✅ **Where:** resource, sourceIP
- ✅ **Who:** user, userAgent
- ✅ **Outcome:** outcome, severity
- ✅ **Details:** Additional context
- ✅ **Control:** FedRAMP control reference

### Audit Log Security

- **Append-Only:** Logs cannot be modified
- **Separate File:** Isolated from application logs
- **Structured Format:** JSON for easy parsing
- **Retention:** 90 days (configurable)
- **Rotation:** Daily rotation with compression

### Viewing Audit Logs

```bash
# View recent audit logs
tail -f backend/logs/audit.log

# Search for specific events
grep "WORKFLOW_TRIGGER" backend/logs/audit.log

# Parse JSON logs
cat backend/logs/audit.log | jq '.eventType'

# Filter by severity
cat backend/logs/audit.log | jq 'select(.severity=="ERROR")'
```

---

## Token Lifecycle Management

### Implementation

**File:** `backend/services/tokenService.js`

### Token Structure

```javascript
{
  token: "demo_token_1234567890_abc",
  userId: "demo-user",
  createdAt: "2026-03-11T12:00:00.000Z",
  expiresAt: "2026-03-11T13:00:00.000Z",
  refreshCount: 0,
  isValid: true
}
```

### Token Lifecycle

```
1. Token Generation
   ↓
2. Token Validation (on each request)
   ↓
3. Expiration Check
   ↓
4. Token Refresh (if expired)
   ↓
5. Token Revocation (if needed)
```

### Token Operations

#### Generate Token

```javascript
const tokenData = tokenService.generateToken('user-id');
// Returns: { token, userId, createdAt, expiresAt, refreshCount, isValid }
```

#### Validate Token

```javascript
const validation = tokenService.validateToken(token);
// Returns: { valid, reason, requiresRefresh, control }
```

#### Refresh Token

```javascript
const result = tokenService.refreshToken(oldToken);
// Returns: { success, token, expiresAt, refreshCount }
```

#### Revoke Token

```javascript
const revoked = tokenService.revokeToken(token);
// Returns: true/false
```

### Token Expiration Handling

**Scenario:** Payment Service Token Expiration

```
1. Payment Service call fails with 401
2. Token expiration detected
3. AI analyzes incident
4. Recommends token refresh middleware
5. User applies fix
6. Token refresh middleware enabled
7. Workflow re-runs successfully
```

### Security Features

- ✅ Token expiration validation
- ✅ Automatic expiration detection
- ✅ Token refresh mechanism
- ✅ Token revocation support
- ✅ Refresh count tracking
- ✅ All lifecycle events logged

---

## Input Validation

### Implementation

**File:** `backend/middleware/inputValidation.js`

### Validation Types

#### 1. UUID Validation

```javascript
// Validates UUID format for IDs
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
```

**Usage:**
```javascript
// Valid UUID
isValidUUID('550e8400-e29b-41d4-a716-446655440000'); // true

// Invalid UUID
isValidUUID('invalid-uuid'); // false
```

#### 2. String Sanitization

```javascript
// Removes dangerous characters
const sanitizeString = (input) => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
};
```

**Protection Against:**
- ✅ XSS (Cross-Site Scripting)
- ✅ HTML injection
- ✅ JavaScript injection
- ✅ Event handler injection

#### 3. Parameter Validation

```javascript
// Validates required parameters
validateIntegrationTrigger(req, res, next)
validateRunId(req, res, next)
validateIncidentId(req, res, next)
```

#### 4. Query Parameter Validation

```javascript
// Validates allowed query parameters
validateQueryParams(['page', 'limit', 'sort'])
```

#### 5. Pagination Validation

```javascript
// Validates page and limit parameters
validatePagination(req, res, next)
// page: 1-N
// limit: 1-100
```

#### 6. Request Validation

```javascript
// Validates Content-Type and request size
validateRequest(req, res, next)
// Content-Type: application/json
// Max size: 1MB
```

### Validation Errors

| Error | Status | Description |
|-------|--------|-------------|
| Invalid UUID | 400 | UUID format validation failed |
| Invalid Parameter | 400 | Required parameter missing or invalid |
| Invalid Query Param | 400 | Unexpected query parameter |
| Invalid Content-Type | 400 | Content-Type must be application/json |
| Payload Too Large | 413 | Request body exceeds 1MB |

### Security Features

- ✅ UUID format validation
- ✅ String sanitization (XSS prevention)
- ✅ Parameter validation
- ✅ Query parameter whitelisting
- ✅ Pagination limits
- ✅ Content-Type validation
- ✅ Request size limits (DoS prevention)

---

## Data Protection

### Transmission Security

**Control:** SC-8 (Transmission Confidentiality)

- **Protocol:** HTTPS/TLS 1.2+
- **Cipher Suites:** Strong ciphers only
- **Certificate:** Valid SSL/TLS certificate
- **HSTS:** HTTP Strict Transport Security enabled

### Data at Rest

**Control:** SC-28 (Protection of Information at Rest)

**Status:** ⚠️ WARNING - Needs Verification

**Recommendations:**
1. Enable database encryption
2. Encrypt sensitive configuration files
3. Use encrypted file systems
4. Implement key management

### Sensitive Data Handling

**Best Practices:**
- Never log sensitive data (passwords, tokens, PII)
- Mask sensitive data in logs
- Use environment variables for secrets
- Implement secrets management (HashiCorp Vault, AWS Secrets Manager)

### Data Retention

| Data Type | Retention Period | Storage |
|-----------|------------------|---------|
| Audit Logs | 90 days | File system |
| Application Logs | 30 days | File system |
| Incident Data | 1 year | Database |
| Compliance Reports | 3 years | Database |

---

## Incident Response

### Implementation

**Files:**
- `backend/services/integrationService.js`
- `backend/agents/agentOrchestrator.js`
- `backend/agents/*.js`

### Automated Incident Response Flow

```
1. Integration Failure Detected
   ↓
2. Incident Created Automatically
   ↓
3. AI Agents Analyze Incident
   - Product Owner Agent: Scope
   - Developer Agent: Root Cause
   - Architect Agent: Dependencies
   - Security Agent: Compliance
   ↓
4. Root Cause Identified
   ↓
5. Remediation Suggested
   ↓
6. User Applies Fix
   ↓
7. Workflow Re-runs
   ↓
8. Recovery Verified
```

### AI Agents

| Agent | Role | Analysis |
|-------|------|----------|
| Product Owner | Scope Definition | Incident impact and priority |
| Developer | Technical Analysis | Root cause identification |
| Architect | System Analysis | Dependency impact assessment |
| Security | Compliance Check | Security and compliance implications |

### Incident Data

```javascript
{
  id: "incident-uuid",
  integrationRunId: "run-uuid",
  status: "analyzing" | "completed",
  createdAt: "2026-03-11T12:00:00.000Z",
  logs: [...],
  timeline: [
    {
      agent: "DeveloperAgent",
      role: "Developer",
      timestamp: "2026-03-11T12:00:05.000Z",
      status: "completed",
      analysis: {
        summary: "...",
        rootCause: "...",
        confidence: 92
      }
    }
  ],
  report: {
    rootCause: {...},
    impactedServices: [...],
    suggestedFix: {...},
    securityImpact: {...}
  }
}
```

### Security Features

- ✅ Automatic incident detection
- ✅ Multi-agent AI analysis
- ✅ Root cause identification
- ✅ Impact assessment
- ✅ Automated remediation suggestions
- ✅ Incident timeline tracking
- ✅ Compliance impact analysis

---

## Security Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3001
NODE_ENV=production

# Security
HTTPS_ENABLED=true
TLS_MIN_VERSION=1.2

# Authentication
TOKEN_LIFETIME_MINUTES=60
REQUIRE_AUTH=true

# Logging
LOG_LEVEL=info
AUDIT_LOG_RETENTION_DAYS=90

# Rate Limiting (if implemented)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Server Configuration

```javascript
// HTTPS Configuration
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem'),
  minVersion: 'TLSv1.2',
  ciphers: 'HIGH:!aNULL:!MD5'
};

https.createServer(options, app).listen(443);
```

### CORS Configuration

```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

### Security Headers

```javascript
// Helmet.js for security headers
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

## Security Testing

### Authentication Tests

```bash
# Test 1: Missing Authorization header
curl -X POST http://localhost:3001/api/integration/trigger
# Expected: 401 Unauthorized

# Test 2: Invalid token format
curl -H "Authorization: InvalidToken" \
  -X POST http://localhost:3001/api/integration/trigger
# Expected: 401 Unauthorized

# Test 3: Valid token
curl -H "Authorization: Bearer demo_token_1234567890_abc" \
  -X POST http://localhost:3001/api/integration/trigger
# Expected: 200 OK
```

### Input Validation Tests

```bash
# Test 1: Invalid UUID
curl http://localhost:3001/api/integration/status/invalid-uuid
# Expected: 400 Bad Request

# Test 2: XSS attempt
curl -X POST http://localhost:3001/api/integration/trigger \
  -H "Content-Type: application/json" \
  -d '{"description":"<script>alert(1)</script>"}'
# Expected: Input sanitized

# Test 3: Oversized request
curl -X POST http://localhost:3001/api/integration/trigger \
  -H "Content-Type: application/json" \
  -d @large-file.json
# Expected: 413 Payload Too Large
```

### Token Lifecycle Tests

```bash
# Test 1: Expired token
# (Simulate token expiration in tokenService)
curl -H "Authorization: Bearer expired_token" \
  -X POST http://localhost:3001/api/integration/trigger
# Expected: 401 Unauthorized, requiresRefresh: true

# Test 2: Token refresh
# (Call refresh endpoint)
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Authorization: Bearer expired_token"
# Expected: New token returned
```

### Audit Logging Tests

```bash
# Test 1: Verify workflow trigger logged
curl -X POST http://localhost:3001/api/integration/trigger
cat backend/logs/audit.log | grep "WORKFLOW_TRIGGER"
# Expected: Event logged

# Test 2: Verify authentication failure logged
curl -X POST http://localhost:3001/api/integration/trigger
cat backend/logs/audit.log | grep "AUTH_FAILURE"
# Expected: Event logged

# Test 3: Verify all required fields present
cat backend/logs/audit.log | jq '.[0] | keys'
# Expected: timestamp, eventType, user, sourceIP, etc.
```

---

## Security Monitoring

### Metrics to Monitor

1. **Authentication Failures**
   - Threshold: > 10 failures/minute
   - Action: Alert security team

2. **Token Expiration Rate**
   - Threshold: > 50% tokens expired
   - Action: Review token lifetime

3. **Input Validation Failures**
   - Threshold: > 100 failures/hour
   - Action: Investigate attack patterns

4. **Incident Creation Rate**
   - Threshold: > 5 incidents/hour
   - Action: Review system health

5. **Audit Log Growth**
   - Threshold: > 1GB/day
   - Action: Review log retention

### Monitoring Tools

**Recommended:**
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk**
- **Datadog**
- **New Relic**

### Alerts

```yaml
# Example alert configuration
alerts:
  - name: High Authentication Failure Rate
    condition: auth_failures > 10 per minute
    severity: high
    action: notify_security_team
    
  - name: Token Expiration Spike
    condition: token_expired_rate > 50%
    severity: medium
    action: notify_ops_team
    
  - name: Input Validation Failures
    condition: validation_failures > 100 per hour
    severity: high
    action: notify_security_team
```

---

## Security Best Practices

### Development

1. **Never commit secrets** to version control
2. **Use environment variables** for configuration
3. **Validate all inputs** before processing
4. **Log security events** comprehensively
5. **Keep dependencies updated** regularly

### Deployment

1. **Enable HTTPS/TLS** in production
2. **Use strong cipher suites** only
3. **Implement rate limiting** on all endpoints
4. **Enable security headers** (Helmet.js)
5. **Configure CORS** properly

### Operations

1. **Monitor audit logs** regularly
2. **Review security alerts** promptly
3. **Rotate tokens** periodically
4. **Update security patches** immediately
5. **Conduct security assessments** quarterly

---

## Security Contacts

### Incident Response Team

- **Security Lead:** security@example.com
- **On-Call:** +1-555-SECURITY
- **Escalation:** ciso@example.com

### Reporting Security Issues

**Email:** security@example.com  
**PGP Key:** Available at https://example.com/pgp

**Please include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested remediation

---

## Compliance

### FedRAMP Controls

See [`COMPLIANCE_MAPPING.md`](./COMPLIANCE_MAPPING.md) for detailed control mappings.

### Audit Schedule

- **Internal Audits:** Quarterly
- **External Audits:** Annually
- **Penetration Testing:** Bi-annually
- **Compliance Review:** Annually

---

## Appendix

### Security Checklist

- [ ] HTTPS/TLS enabled
- [ ] Authentication implemented
- [ ] Input validation configured
- [ ] Audit logging enabled
- [ ] Token lifecycle managed
- [ ] Security headers configured
- [ ] CORS configured
- [ ] Rate limiting implemented
- [ ] Secrets externalized
- [ ] Monitoring configured
- [ ] Incident response plan documented
- [ ] Security training completed

### References

- [NIST SP 800-53](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)
- [FedRAMP Security Controls](https://www.fedramp.gov/assets/resources/documents/FedRAMP_Security_Controls_Baseline.xlsx)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

---

**Document Version:** 1.0  
**Last Updated:** March 2026  
**Next Review:** June 2026  
**Classification:** Internal Use Only