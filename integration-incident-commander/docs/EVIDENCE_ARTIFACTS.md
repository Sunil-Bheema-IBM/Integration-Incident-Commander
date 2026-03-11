# Evidence Artifacts Guide

## Integration Incident Commander - Compliance Evidence Collection

This guide provides instructions for collecting and documenting evidence artifacts to demonstrate FedRAMP compliance.

---

## Overview

Evidence artifacts are tangible proof that security controls are implemented and functioning as intended. This guide covers:

1. Screenshots to capture
2. Log files to collect
3. Configuration files to document
4. Test results to record
5. Reports to generate

---

## 1. Screenshots

### Authentication Control (AC-2, IA-2)

**Screenshot 1: Successful Authentication**
- **What to capture:** API request with valid Bearer token returning 200 OK
- **Tool:** Postman, curl, or browser DevTools
- **Command:**
  ```bash
  curl -H "Authorization: Bearer demo_token_1234567890_abc" \
    http://localhost:3001/api/integration/trigger
  ```
- **Expected:** 200 OK response
- **Filename:** `evidence_auth_success.png`

**Screenshot 2: Failed Authentication - Missing Header**
- **What to capture:** API request without Authorization header returning 401
- **Command:**
  ```bash
  curl http://localhost:3001/api/integration/trigger
  ```
- **Expected:** 401 Unauthorized with error message
- **Filename:** `evidence_auth_missing_header.png`

**Screenshot 3: Failed Authentication - Invalid Format**
- **What to capture:** API request with invalid token format returning 401
- **Command:**
  ```bash
  curl -H "Authorization: InvalidToken" \
    http://localhost:3001/api/integration/trigger
  ```
- **Expected:** 401 Unauthorized with format error
- **Filename:** `evidence_auth_invalid_format.png`

### Token Lifecycle (IA-5, SC-23)

**Screenshot 4: Token Expiration Detection**
- **What to capture:** Token validation showing expired token
- **Location:** Payment Service failure with 401 error
- **Expected:** Error message "OAuth token expired"
- **Filename:** `evidence_token_expired.png`

**Screenshot 5: Token Refresh Success**
- **What to capture:** AI remediation suggesting token refresh
- **Location:** Incident Report → Recommended Actions
- **Expected:** "Enable Token Refresh Middleware" recommendation
- **Filename:** `evidence_token_refresh_recommendation.png`

### Input Validation (SI-10)

**Screenshot 6: Invalid UUID Rejected**
- **What to capture:** API request with invalid UUID returning 400
- **Command:**
  ```bash
  curl http://localhost:3001/api/integration/status/invalid-uuid
  ```
- **Expected:** 400 Bad Request with validation error
- **Filename:** `evidence_input_validation_uuid.png`

**Screenshot 7: XSS Attempt Sanitized**
- **What to capture:** Input with XSS payload being sanitized
- **Command:**
  ```bash
  curl -X POST http://localhost:3001/api/integration/trigger \
    -H "Content-Type: application/json" \
    -d '{"description":"<script>alert(1)</script>"}'
  ```
- **Expected:** Input sanitized (script tags removed)
- **Filename:** `evidence_input_validation_xss.png`

### Audit Logging (AU-2, AU-3)

**Screenshot 8: Audit Log Viewer**
- **What to capture:** Contents of audit.log showing various events
- **Command:**
  ```bash
  cat backend/logs/audit.log | jq '.'
  ```
- **Expected:** JSON-formatted audit entries with all required fields
- **Filename:** `evidence_audit_log_sample.png`

**Screenshot 9: Workflow Trigger Event**
- **What to capture:** WORKFLOW_TRIGGER event in audit log
- **Command:**
  ```bash
  cat backend/logs/audit.log | jq 'select(.eventType=="WORKFLOW_TRIGGER")'
  ```
- **Expected:** Complete audit entry with timestamp, user, IP, etc.
- **Filename:** `evidence_audit_workflow_trigger.png`

**Screenshot 10: Incident Creation Event**
- **What to capture:** INCIDENT_CREATED event in audit log
- **Command:**
  ```bash
  cat backend/logs/audit.log | jq 'select(.eventType=="INCIDENT_CREATED")'
  ```
- **Expected:** Incident creation logged with details
- **Filename:** `evidence_audit_incident_created.png`

**Screenshot 11: Remediation Applied Event**
- **What to capture:** REMEDIATION_APPLIED event in audit log
- **Command:**
  ```bash
  cat backend/logs/audit.log | jq 'select(.eventType=="REMEDIATION_APPLIED")'
  ```
- **Expected:** AI remediation logged with configuration changes
- **Filename:** `evidence_audit_remediation_applied.png`

### Compliance Reporting (CA-2)

**Screenshot 12: Compliance Dashboard**
- **What to capture:** Compliance Report tab showing all controls
- **Location:** Frontend → Compliance Report tab
- **Expected:** List of controls with PASS/FAIL/WARNING status
- **Filename:** `evidence_compliance_dashboard.png`

**Screenshot 13: Control Details**
- **What to capture:** Detailed view of a specific control
- **Location:** Compliance Report → Expand control
- **Expected:** Control description, evidence, framework mapping
- **Filename:** `evidence_compliance_control_detail.png`

**Screenshot 14: Compliance Score**
- **What to capture:** Overall compliance score and status
- **Location:** Compliance Report → Summary section
- **Expected:** Score percentage and status (Good/Excellent/etc.)
- **Filename:** `evidence_compliance_score.png`

### Incident Response (IR-4)

**Screenshot 15: AI Investigation Timeline**
- **What to capture:** AI Investigation Timeline showing all events
- **Location:** Frontend → AI Investigation Timeline
- **Expected:** Timeline with workflow trigger, failure, analysis, fix
- **Filename:** `evidence_ai_timeline.png`

**Screenshot 16: Agent Analysis**
- **What to capture:** AI Agent Investigation Timeline
- **Location:** Frontend → Agent Timeline
- **Expected:** Four agents (Product Owner, Developer, Architect, Security) with analysis
- **Filename:** `evidence_agent_analysis.png`

**Screenshot 17: Incident Report**
- **What to capture:** Final Incident Report with root cause
- **Location:** Frontend → Incident Report card
- **Expected:** Root cause, impacted services, suggested fix, confidence score
- **Filename:** `evidence_incident_report.png`

**Screenshot 18: Auto-Fix Button**
- **What to capture:** Apply AI Suggested Fix button
- **Location:** Incident Report → Auto-fix section
- **Expected:** Button with description of fix to be applied
- **Filename:** `evidence_auto_fix_button.png`

**Screenshot 19: Recovery Success**
- **What to capture:** Success banner after AI fix applied
- **Location:** Integration Workflow → Success banner
- **Expected:** "Incident Resolved Automatically" banner
- **Filename:** `evidence_recovery_success.png`

---

## 2. Log Files

### Application Logs

**File:** `backend/logs/application.log`

**What to collect:**
- Server startup logs
- API request logs
- Error logs
- Integration workflow logs

**Command to extract:**
```bash
# Last 100 lines
tail -n 100 backend/logs/application.log > evidence_application_log.txt

# Filter by date
grep "2026-03-11" backend/logs/application.log > evidence_application_log_20260311.txt
```

**Filename:** `evidence_application_log.txt`

### Audit Logs

**File:** `backend/logs/audit.log`

**What to collect:**
- All security events
- Authentication attempts
- Token lifecycle events
- Incident events
- Remediation events

**Command to extract:**
```bash
# All audit logs
cat backend/logs/audit.log > evidence_audit_log.json

# Specific event types
cat backend/logs/audit.log | jq 'select(.eventType=="WORKFLOW_TRIGGER")' > evidence_audit_workflow.json
cat backend/logs/audit.log | jq 'select(.eventCategory=="AUTHENTICATION")' > evidence_audit_auth.json
cat backend/logs/audit.log | jq 'select(.eventCategory=="SECURITY")' > evidence_audit_security.json
```

**Filenames:**
- `evidence_audit_log_complete.json`
- `evidence_audit_workflow_events.json`
- `evidence_audit_auth_events.json`
- `evidence_audit_security_events.json`

---

## 3. Configuration Files

### Authentication Configuration

**File:** `backend/middleware/authMiddleware.js`

**What to document:**
- Authentication logic
- Token validation
- Error handling
- Logging

**Command:**
```bash
cp backend/middleware/authMiddleware.js evidence_auth_middleware.js
```

**Filename:** `evidence_auth_middleware.js`

### Audit Logger Configuration

**File:** `backend/middleware/auditLogger.js`

**What to document:**
- Audit log structure
- Event types
- Required fields
- Log storage

**Command:**
```bash
cp backend/middleware/auditLogger.js evidence_audit_logger.js
```

**Filename:** `evidence_audit_logger.js`

### Token Service Configuration

**File:** `backend/services/tokenService.js`

**What to document:**
- Token generation
- Validation logic
- Expiration handling
- Refresh mechanism

**Command:**
```bash
cp backend/services/tokenService.js evidence_token_service.js
```

**Filename:** `evidence_token_service.js`

### Input Validation Configuration

**File:** `backend/middleware/inputValidation.js`

**What to document:**
- Validation rules
- Sanitization logic
- Error responses

**Command:**
```bash
cp backend/middleware/inputValidation.js evidence_input_validation.js
```

**Filename:** `evidence_input_validation.js`

---

## 4. Test Results

### Authentication Tests

**Test Script:**
```bash
#!/bin/bash
# evidence_auth_tests.sh

echo "=== Authentication Tests ==="
echo ""

echo "Test 1: Missing Authorization Header"
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  http://localhost:3001/api/integration/trigger
echo ""

echo "Test 2: Invalid Token Format"
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -H "Authorization: InvalidToken" \
  http://localhost:3001/api/integration/trigger
echo ""

echo "Test 3: Valid Token"
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -H "Authorization: Bearer demo_token_1234567890_abc" \
  http://localhost:3001/api/integration/trigger
echo ""
```

**Expected Output:**
```
=== Authentication Tests ===

Test 1: Missing Authorization Header
Status: 401

Test 2: Invalid Token Format
Status: 401

Test 3: Valid Token
Status: 200
```

**Filename:** `evidence_auth_test_results.txt`

### Input Validation Tests

**Test Script:**
```bash
#!/bin/bash
# evidence_validation_tests.sh

echo "=== Input Validation Tests ==="
echo ""

echo "Test 1: Invalid UUID"
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  http://localhost:3001/api/integration/status/invalid-uuid
echo ""

echo "Test 2: Valid UUID"
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  http://localhost:3001/api/integration/status/550e8400-e29b-41d4-a716-446655440000
echo ""
```

**Expected Output:**
```
=== Input Validation Tests ===

Test 1: Invalid UUID
Status: 400

Test 2: Valid UUID
Status: 200 or 404 (depending on existence)
```

**Filename:** `evidence_validation_test_results.txt`

---

## 5. Reports

### Compliance Report

**How to generate:**
1. Start the application
2. Navigate to Compliance Report tab
3. Click "Generate Report" (if applicable)
4. Export as JSON

**API Command:**
```bash
curl http://localhost:3001/api/compliance/report > evidence_compliance_report.json
```

**Filename:** `evidence_compliance_report.json`

### Incident Report

**How to generate:**
1. Trigger integration workflow
2. Wait for failure and AI analysis
3. Export incident report

**API Command:**
```bash
# Get incident ID from integration status
INCIDENT_ID=$(curl -s http://localhost:3001/api/integration/status/RUN_ID | jq -r '.incidentId')

# Get incident report
curl http://localhost:3001/api/incidents/$INCIDENT_ID > evidence_incident_report.json
```

**Filename:** `evidence_incident_report.json`

---

## 6. Evidence Package Structure

Organize all evidence in a structured directory:

```
evidence/
├── screenshots/
│   ├── evidence_auth_success.png
│   ├── evidence_auth_missing_header.png
│   ├── evidence_auth_invalid_format.png
│   ├── evidence_token_expired.png
│   ├── evidence_token_refresh_recommendation.png
│   ├── evidence_input_validation_uuid.png
│   ├── evidence_input_validation_xss.png
│   ├── evidence_audit_log_sample.png
│   ├── evidence_audit_workflow_trigger.png
│   ├── evidence_audit_incident_created.png
│   ├── evidence_audit_remediation_applied.png
│   ├── evidence_compliance_dashboard.png
│   ├── evidence_compliance_control_detail.png
│   ├── evidence_compliance_score.png
│   ├── evidence_ai_timeline.png
│   ├── evidence_agent_analysis.png
│   ├── evidence_incident_report.png
│   ├── evidence_auto_fix_button.png
│   └── evidence_recovery_success.png
├── logs/
│   ├── evidence_application_log.txt
│   ├── evidence_audit_log_complete.json
│   ├── evidence_audit_workflow_events.json
│   ├── evidence_audit_auth_events.json
│   └── evidence_audit_security_events.json
├── configuration/
│   ├── evidence_auth_middleware.js
│   ├── evidence_audit_logger.js
│   ├── evidence_token_service.js
│   └── evidence_input_validation.js
├── test_results/
│   ├── evidence_auth_test_results.txt
│   └── evidence_validation_test_results.txt
├── reports/
│   ├── evidence_compliance_report.json
│   └── evidence_incident_report.json
└── README.md (this file)
```

---

## 7. Evidence Collection Checklist

### Pre-Collection
- [ ] Application running on localhost:3001
- [ ] Backend logs directory exists
- [ ] Frontend accessible
- [ ] Test tools installed (curl, jq, screenshot tool)

### Screenshots
- [ ] Authentication success
- [ ] Authentication failures (2)
- [ ] Token expiration
- [ ] Token refresh recommendation
- [ ] Input validation (2)
- [ ] Audit logs (4)
- [ ] Compliance dashboard (3)
- [ ] AI timeline
- [ ] Agent analysis
- [ ] Incident report
- [ ] Auto-fix button
- [ ] Recovery success

### Log Files
- [ ] Application logs collected
- [ ] Audit logs collected (complete)
- [ ] Audit logs filtered by event type

### Configuration Files
- [ ] Authentication middleware
- [ ] Audit logger
- [ ] Token service
- [ ] Input validation

### Test Results
- [ ] Authentication tests executed
- [ ] Input validation tests executed
- [ ] Results documented

### Reports
- [ ] Compliance report generated
- [ ] Incident report generated

### Package
- [ ] All files organized in evidence/ directory
- [ ] README.md included
- [ ] Evidence package compressed (evidence.zip)

---

## 8. Automated Evidence Collection Script

```bash
#!/bin/bash
# collect_evidence.sh

echo "=== Integration Incident Commander - Evidence Collection ==="
echo ""

# Create evidence directory structure
mkdir -p evidence/{screenshots,logs,configuration,test_results,reports}

echo "Collecting log files..."
cp backend/logs/application.log evidence/logs/evidence_application_log.txt
cp backend/logs/audit.log evidence/logs/evidence_audit_log_complete.json

echo "Collecting configuration files..."
cp backend/middleware/authMiddleware.js evidence/configuration/
cp backend/middleware/auditLogger.js evidence/configuration/
cp backend/services/tokenService.js evidence/configuration/
cp backend/middleware/inputValidation.js evidence/configuration/

echo "Running authentication tests..."
bash evidence_auth_tests.sh > evidence/test_results/evidence_auth_test_results.txt

echo "Running validation tests..."
bash evidence_validation_tests.sh > evidence/test_results/evidence_validation_test_results.txt

echo "Generating compliance report..."
curl -s http://localhost:3001/api/compliance/report > evidence/reports/evidence_compliance_report.json

echo "Creating evidence package..."
zip -r evidence.zip evidence/

echo ""
echo "Evidence collection complete!"
echo "Package: evidence.zip"
echo ""
echo "Manual steps remaining:"
echo "1. Capture screenshots (see EVIDENCE_ARTIFACTS.md)"
echo "2. Generate incident report (trigger workflow first)"
echo "3. Review and validate all evidence"
```

---

## 9. Evidence Validation

Before submitting evidence, validate:

1. **Completeness:** All required artifacts collected
2. **Accuracy:** Evidence matches control requirements
3. **Clarity:** Screenshots are readable, logs are formatted
4. **Consistency:** Timestamps align across artifacts
5. **Documentation:** Each artifact has description and context

---

## 10. Submission

### Evidence Package Contents

1. **Cover Letter** - Summary of evidence
2. **Control Mapping** - Links evidence to controls
3. **Screenshots** - All required screenshots
4. **Log Files** - Application and audit logs
5. **Configuration** - Source code files
6. **Test Results** - Automated test outputs
7. **Reports** - Compliance and incident reports

### Submission Format

- **Format:** ZIP archive
- **Filename:** `IIC_Evidence_Package_YYYYMMDD.zip`
- **Size:** < 100MB (compress if needed)
- **Encryption:** AES-256 (if contains sensitive data)

---

**Document Version:** 1.0  
**Last Updated:** March 2026  
**Purpose:** FedRAMP Compliance Evidence Collection