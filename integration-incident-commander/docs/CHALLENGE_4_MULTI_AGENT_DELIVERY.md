# Challenge 4: Multi-Agent Delivery Loop

## Overview

This document describes the **Multi-Agent Delivery Loop** - a repeatable end-to-end workflow that demonstrates how multiple specialized AI agents collaborate to investigate and resolve integration incidents using Custom Modes and MCP servers.

## Workflow Architecture

```
Incident Request
      ↓
[Product Owner Mode] ← MCP: Filesystem (read incident)
      ↓
Investigation Scope Defined
      ↓
[Developer Mode] ← MCP: Filesystem (analyze logs/code)
      ↓
Root Cause Identified
      ↓
[Architect Mode] ← MCP: Filesystem (analyze dependencies)
      ↓
Impact Assessment Complete
      ↓
[Security Mode] ← MCP: Filesystem (compliance check)
      ↓
Security Validation Complete
      ↓
Final Artifacts Generated
```

## Custom Modes Created

Four specialized modes have been created in `.bob/custom_modes.yaml`:

### 1. 🎯 Product Owner Mode (`product-owner`)
**Purpose:** Requirements and incident scope definition

**Capabilities:**
- Analyzes incident reports and defines investigation scope
- Prioritizes issues based on business impact
- Creates clear requirements and acceptance criteria
- Documents incident summaries and status updates
- Communicates with stakeholders

**Tool Access:**
- Read files (logs, docs, configs)
- Edit documentation files only (`.md`, `.txt`, `.json`)
- Use MCP servers for context gathering

**Focus:** Business impact and stakeholder communication

### 2. 💻 Developer Mode (`developer`)
**Purpose:** Code analysis and technical investigation

**Capabilities:**
- Analyzes application logs and error messages
- Debugs integration failures and API issues
- Identifies root causes in code
- Proposes technical fixes and workarounds
- Implements code patches
- Tests and validates solutions

**Tool Access:**
- Read files (all types)
- Edit all files (full code access)
- Execute commands (testing, debugging)
- Use MCP servers for code analysis

**Focus:** Technical root cause and implementation

### 3. 🏗️ Architect Mode (`architect`)
**Purpose:** System design and dependency analysis

**Capabilities:**
- Analyzes system architecture and dependencies
- Identifies impacted services and components
- Assesses cascading failure risks
- Designs resilient integration patterns
- Evaluates scalability implications
- Recommends architectural improvements

**Tool Access:**
- Read files (all types)
- Edit documentation and config files only (`.md`, `.json`, `.yaml`)
- Use MCP servers for system analysis

**Focus:** System-wide impact and architectural resilience

### 4. 🔒 Security Mode (`security`)
**Purpose:** Security and compliance validation

**Capabilities:**
- Analyzes security implications of incidents
- Identifies compliance violations
- Assesses data exposure risks
- Validates authentication and authorization
- Checks for security vulnerabilities
- Ensures audit trail completeness

**Tool Access:**
- Read files (all types)
- Edit documentation and security reports only (`.md`, `.json`)
- Use MCP servers for security pattern analysis

**Focus:** Security, privacy, and compliance

## MCP Servers Used

### Required MCP Servers (Minimum 2)

#### 1. **Filesystem MCP Server** (Primary)
**Purpose:** File operations and content analysis

**Operations Used:**
- `read_file` - Read incident reports, logs, code files
- `search_files` - Search for error patterns, security issues
- `list_files` - Discover project structure
- `write_file` - Generate reports and documentation

**Evidence to Capture:**
- Screenshot of MCP server connection in Bob
- File read operations showing incident data
- Search results for error patterns
- Generated documentation files

#### 2. **Git MCP Server** (Secondary)
**Purpose:** Version control and change history analysis

**Operations Used:**
- `git_log` - Review recent changes related to incident
- `git_diff` - Compare code versions
- `git_blame` - Identify code ownership
- `git_status` - Check current repository state

**Evidence to Capture:**
- Screenshot of Git MCP operations
- Commit history related to incident
- Diff output showing problematic changes
- Blame information for affected code

### Optional MCP Servers (Enhanced Workflow)

#### 3. **GitHub MCP Server** (Optional)
**Purpose:** Issue tracking and PR management

**Operations:**
- Create incident tracking issues
- Link PRs to incidents
- Update issue status
- Add comments with findings

#### 4. **Slack MCP Server** (Optional)
**Purpose:** Team communication and notifications

**Operations:**
- Send incident notifications
- Post investigation updates
- Share resolution status

## Complete Workflow Execution

### Phase 1: Incident Intake (Product Owner Mode)

**Objective:** Define investigation scope and business impact

**Steps:**
1. Switch to Product Owner mode: `/mode product-owner`
2. Read incident report using Filesystem MCP
3. Analyze business impact
4. Define investigation scope
5. Create incident summary document

**MCP Operations:**
```
Filesystem MCP:
- read_file: backend/logs/integration.log
- read_file: backend/logs/audit.log
- write_file: docs/incidents/INC-001-summary.md
```

**Deliverables:**
- `docs/incidents/INC-001-summary.md` - Incident scope document
- Priority level assigned
- Stakeholder list identified

**Evidence to Capture:**
- Screenshot: Product Owner mode active
- Screenshot: Reading incident logs via Filesystem MCP
- Screenshot: Generated incident summary document

### Phase 2: Technical Investigation (Developer Mode)

**Objective:** Identify root cause through log and code analysis

**Steps:**
1. Switch to Developer mode: `/mode developer`
2. Analyze error logs using Filesystem MCP
3. Search codebase for related issues
4. Trace execution flow
5. Identify exact failure point
6. Document technical findings

**MCP Operations:**
```
Filesystem MCP:
- read_file: backend/services/integrationService.js
- search_files: pattern="401 Unauthorized", path="backend/"
- read_file: backend/services/paymentService.js
- write_file: docs/incidents/INC-001-technical-analysis.md

Git MCP:
- git_log: path="backend/services/paymentService.js", limit=10
- git_diff: commit1="HEAD~5", commit2="HEAD", path="backend/services/"
```

**Deliverables:**
- `docs/incidents/INC-001-technical-analysis.md` - Root cause analysis
- Code references with line numbers
- Proposed fix with code examples

**Evidence to Capture:**
- Screenshot: Developer mode active
- Screenshot: Log analysis via Filesystem MCP
- Screenshot: Code search results
- Screenshot: Git history via Git MCP
- Screenshot: Technical analysis document

### Phase 3: Architecture Assessment (Architect Mode)

**Objective:** Assess system-wide impact and dependencies

**Steps:**
1. Switch to Architect mode: `/mode architect`
2. Map service dependencies using Filesystem MCP
3. Identify all impacted services
4. Assess cascading failure risks
5. Recommend architectural improvements
6. Document impact assessment

**MCP Operations:**
```
Filesystem MCP:
- read_file: docs/ARCHITECTURE.md
- list_files: path="backend/services/", recursive=true
- search_files: pattern="paymentService", path="backend/"
- write_file: docs/incidents/INC-001-impact-assessment.md
```

**Deliverables:**
- `docs/incidents/INC-001-impact-assessment.md` - Impact analysis
- Dependency map
- Architectural recommendations

**Evidence to Capture:**
- Screenshot: Architect mode active
- Screenshot: Service dependency analysis
- Screenshot: Impact assessment document

### Phase 4: Security Validation (Security Mode)

**Objective:** Validate security and compliance implications

**Steps:**
1. Switch to Security mode: `/mode security`
2. Review audit logs using Filesystem MCP
3. Check for compliance violations
4. Assess data exposure risks
5. Validate security controls
6. Document security findings

**MCP Operations:**
```
Filesystem MCP:
- read_file: backend/logs/audit.log
- search_files: pattern="authentication|authorization", path="backend/"
- read_file: backend/middleware/authMiddleware.js
- read_file: docs/COMPLIANCE_MAPPING.md
- write_file: docs/incidents/INC-001-security-report.md
```

**Deliverables:**
- `docs/incidents/INC-001-security-report.md` - Security analysis
- Compliance status
- Security recommendations

**Evidence to Capture:**
- Screenshot: Security mode active
- Screenshot: Audit log review
- Screenshot: Security pattern search
- Screenshot: Security report document

### Phase 5: Final Resolution (Product Owner Mode)

**Objective:** Consolidate findings and communicate resolution

**Steps:**
1. Switch back to Product Owner mode: `/mode product-owner`
2. Review all agent findings
3. Create executive summary
4. Update incident status
5. Generate final report

**MCP Operations:**
```
Filesystem MCP:
- read_file: docs/incidents/INC-001-technical-analysis.md
- read_file: docs/incidents/INC-001-impact-assessment.md
- read_file: docs/incidents/INC-001-security-report.md
- write_file: docs/incidents/INC-001-final-report.md
- write_file: docs/incidents/INC-001-status-update.md
```

**Deliverables:**
- `docs/incidents/INC-001-final-report.md` - Complete incident report
- `docs/incidents/INC-001-status-update.md` - Stakeholder communication
- Lessons learned document

**Evidence to Capture:**
- Screenshot: Final report generation
- Screenshot: All incident documents created
- Screenshot: Status update document

## Sample Incident Scenario

### Incident: Payment API Authentication Failure

**Initial Report:**
```
Incident ID: INC-001
Title: Payment API returning 401 Unauthorized
Severity: High
Reported: 2026-03-11 14:00 UTC
Impact: Order processing blocked for 50+ customers
```

**Expected Workflow Output:**

1. **Product Owner Analysis:**
   - Business Impact: High - Revenue loss, customer dissatisfaction
   - Priority: P1 - Critical
   - Scope: Payment integration workflow
   - Stakeholders: Engineering, Customer Support, Finance

2. **Developer Investigation:**
   - Root Cause: OAuth token expired (24-hour TTL exceeded)
   - Location: `backend/services/paymentService.js:45`
   - Fix: Implement token refresh middleware
   - Code: Token lifecycle service enhancement

3. **Architect Assessment:**
   - Impacted Services: Order Service, Invoice Service, Notification Service
   - Cascading Risk: Medium - Retry logic prevents total failure
   - Recommendation: Implement circuit breaker pattern
   - Design: Token refresh with exponential backoff

4. **Security Validation:**
   - Compliance Status: PASS - No data exposure
   - Audit Trail: Complete - All auth attempts logged
   - Security Control: Token lifecycle management needed
   - Recommendation: Implement automated token rotation

5. **Final Resolution:**
   - Status: Resolved
   - Solution: Token refresh middleware implemented
   - Prevention: Automated token lifecycle management
   - Lessons: Add token expiration monitoring

## Evidence Collection Guide

### Required Screenshots (Minimum 12)

#### Product Owner Mode (3 screenshots)
1. **PO-01:** Product Owner mode activated in Bob
2. **PO-02:** Reading incident logs via Filesystem MCP
3. **PO-03:** Generated incident summary document

#### Developer Mode (4 screenshots)
4. **DEV-01:** Developer mode activated in Bob
5. **DEV-02:** Log analysis via Filesystem MCP (error search)
6. **DEV-03:** Git history analysis via Git MCP
7. **DEV-04:** Technical analysis document with code references

#### Architect Mode (2 screenshots)
8. **ARCH-01:** Architect mode activated in Bob
9. **ARCH-02:** Impact assessment document with dependency map

#### Security Mode (2 screenshots)
10. **SEC-01:** Security mode activated in Bob
11. **SEC-02:** Security report with compliance status

#### Final Artifacts (1 screenshot)
12. **FINAL-01:** All generated incident documents in file explorer

### MCP Server Evidence

#### Filesystem MCP Evidence
- File read operations log
- Search results for error patterns
- Generated documentation files
- File modification timestamps

#### Git MCP Evidence
- Git log output showing recent changes
- Git diff showing problematic code
- Git blame showing code ownership
- Repository status output

## Execution Instructions

### Prerequisites
1. Bob IDE with Custom Modes support
2. Filesystem MCP server configured
3. Git MCP server configured
4. Integration Incident Commander project loaded

### Step-by-Step Execution

```bash
# 1. Start the application
cd integration-incident-commander/backend
npm install
npm start

# In another terminal
cd integration-incident-commander/frontend
npm install
npm start

# 2. Trigger an incident
# Open http://localhost:3000
# Click "Trigger Integration Workflow"
# Wait for failure to occur

# 3. Begin multi-agent workflow in Bob
# Follow Phase 1-5 steps above
# Capture screenshots at each phase
# Save all generated documents
```

### Mode Switching Commands

```
/mode product-owner    # Switch to Product Owner mode
/mode developer        # Switch to Developer mode
/mode architect        # Switch to Architect mode
/mode security         # Switch to Security mode
```

### Sample Prompts for Each Mode

#### Product Owner Mode
```
"Analyze the integration failure incident and create an incident summary 
document that defines the investigation scope, business impact, and 
stakeholder communication plan."
```

#### Developer Mode
```
"Investigate the Payment API 401 error by analyzing logs and code. 
Identify the root cause and propose a technical solution with code examples."
```

#### Architect Mode
```
"Assess the system-wide impact of the Payment API failure. Map all 
dependent services and recommend architectural improvements for resilience."
```

#### Security Mode
```
"Validate the security and compliance implications of the authentication 
failure. Check audit logs and ensure no data exposure occurred."
```

## Success Criteria

### Workflow Completion Checklist

- [ ] All 4 custom modes created and functional
- [ ] Minimum 2 MCP servers used (Filesystem + Git)
- [ ] Complete workflow executed from incident to resolution
- [ ] All 5 phases completed with deliverables
- [ ] Minimum 12 screenshots captured
- [ ] All incident documents generated:
  - [ ] INC-001-summary.md
  - [ ] INC-001-technical-analysis.md
  - [ ] INC-001-impact-assessment.md
  - [ ] INC-001-security-report.md
  - [ ] INC-001-final-report.md
  - [ ] INC-001-status-update.md
- [ ] MCP server evidence collected
- [ ] Lessons learned documented

## Benefits Demonstrated

### 1. Role Specialization
Each mode focuses on its domain expertise:
- Product Owner: Business impact
- Developer: Technical implementation
- Architect: System design
- Security: Compliance and risk

### 2. Tool Access Control
Modes have appropriate permissions:
- Product Owner: Documentation only
- Developer: Full code access
- Architect: Architecture files
- Security: Security reports

### 3. MCP Integration
Multiple MCP servers provide:
- File operations (Filesystem)
- Version control (Git)
- Enhanced context gathering
- Automated evidence collection

### 4. Repeatable Process
The workflow is:
- Standardized across incidents
- Documented and auditable
- Scalable to any incident type
- Traceable through artifacts

### 5. Collaboration Model
Demonstrates:
- Clear handoffs between roles
- Shared context through documents
- Cumulative knowledge building
- Final synthesis of findings

## Troubleshooting

### Mode Not Available
**Issue:** Custom mode not showing in Bob
**Solution:** 
1. Verify `.bob/custom_modes.yaml` exists
2. Restart Bob IDE
3. Check YAML syntax

### MCP Server Connection Failed
**Issue:** Cannot connect to MCP server
**Solution:**
1. Verify MCP server is running
2. Check Bob settings for MCP configuration
3. Test connection with simple operation

### File Access Denied
**Issue:** Mode cannot edit certain files
**Solution:**
1. Check mode's `fileRegex` restrictions
2. Use appropriate mode for file type
3. Switch to Developer mode for full access

## Next Steps

After completing Challenge 4:

1. **Review Evidence:** Compile all screenshots and documents
2. **Analyze Metrics:** Measure workflow efficiency
3. **Document Lessons:** Capture improvement opportunities
4. **Extend Workflow:** Add more specialized modes
5. **Integrate Tools:** Add more MCP servers
6. **Automate Handoffs:** Create mode transition triggers

## Conclusion

Challenge 4 demonstrates a production-ready multi-agent delivery loop that:
- Uses 4 specialized custom modes
- Integrates 2+ MCP servers
- Executes a complete incident workflow
- Generates comprehensive evidence
- Produces actionable artifacts
- Follows enterprise best practices

This workflow can be adapted for any integration incident, providing a repeatable, auditable, and efficient investigation process.