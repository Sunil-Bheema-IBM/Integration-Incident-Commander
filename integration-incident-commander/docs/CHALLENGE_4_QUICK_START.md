# Challenge 4: Quick Start Guide

## 🚀 Quick Reference

This is a condensed guide for executing the Multi-Agent Delivery Loop. For complete details, see [`CHALLENGE_4_MULTI_AGENT_DELIVERY.md`](./CHALLENGE_4_MULTI_AGENT_DELIVERY.md).

## Prerequisites Checklist

- [ ] Bob IDE installed with Custom Modes support
- [ ] Filesystem MCP server configured
- [ ] Git MCP server configured (optional but recommended)
- [ ] Integration Incident Commander project loaded
- [ ] Application running (backend on :3001, frontend on :3000)

## 5-Phase Workflow

### Phase 1: 🎯 Product Owner - Incident Intake
**Mode:** `/mode product-owner`

**Prompt:**
```
Analyze the Payment API authentication failure incident. Create an incident 
summary document that defines investigation scope, business impact, priority, 
and affected stakeholders. Use Filesystem MCP to read logs.
```

**MCP Operations:**
- Read: `backend/logs/integration.log`
- Read: `backend/logs/audit.log`
- Write: `docs/incidents/INC-001-summary.md`

**Evidence:** Screenshot mode + MCP operations + generated document

---

### Phase 2: 💻 Developer - Technical Investigation
**Mode:** `/mode developer`

**Prompt:**
```
Investigate the Payment API 401 Unauthorized error. Analyze logs and code 
to identify the root cause. Search for authentication patterns and review 
recent changes using Git MCP. Document technical findings with code references.
```

**MCP Operations:**
- Read: `backend/services/integrationService.js`
- Search: pattern="401|Unauthorized" in `backend/`
- Read: `backend/services/paymentService.js`
- Git log: `backend/services/paymentService.js`
- Write: `docs/incidents/INC-001-technical-analysis.md`

**Evidence:** Screenshot mode + log analysis + code search + git history + document

---

### Phase 3: 🏗️ Architect - Impact Assessment
**Mode:** `/mode architect`

**Prompt:**
```
Assess the system-wide impact of the Payment API failure. Map service 
dependencies, identify all impacted components, evaluate cascading risks, 
and recommend architectural improvements for resilience.
```

**MCP Operations:**
- Read: `docs/ARCHITECTURE.md`
- List: `backend/services/` (recursive)
- Search: pattern="paymentService" in `backend/`
- Write: `docs/incidents/INC-001-impact-assessment.md`

**Evidence:** Screenshot mode + dependency analysis + document

---

### Phase 4: 🔒 Security - Compliance Validation
**Mode:** `/mode security`

**Prompt:**
```
Validate security and compliance implications of the authentication failure. 
Review audit logs, check for data exposure, validate security controls, 
and assess compliance status against FedRAMP requirements.
```

**MCP Operations:**
- Read: `backend/logs/audit.log`
- Search: pattern="authentication|authorization" in `backend/`
- Read: `backend/middleware/authMiddleware.js`
- Read: `docs/COMPLIANCE_MAPPING.md`
- Write: `docs/incidents/INC-001-security-report.md`

**Evidence:** Screenshot mode + audit review + security patterns + document

---

### Phase 5: 🎯 Product Owner - Final Resolution
**Mode:** `/mode product-owner`

**Prompt:**
```
Review all agent findings and create a comprehensive final report. 
Consolidate technical analysis, impact assessment, and security validation 
into an executive summary with resolution status and lessons learned.
```

**MCP Operations:**
- Read: `docs/incidents/INC-001-technical-analysis.md`
- Read: `docs/incidents/INC-001-impact-assessment.md`
- Read: `docs/incidents/INC-001-security-report.md`
- Write: `docs/incidents/INC-001-final-report.md`
- Write: `docs/incidents/INC-001-status-update.md`

**Evidence:** Screenshot final report + all documents

---

## MCP Servers Used

### 1. Filesystem MCP (Required)
**Purpose:** File operations and content analysis

**Key Operations:**
- `read_file` - Read logs, code, documentation
- `search_files` - Find error patterns, security issues
- `list_files` - Discover project structure
- `write_file` - Generate incident reports

### 2. Git MCP (Required)
**Purpose:** Version control and change history

**Key Operations:**
- `git_log` - Review recent changes
- `git_diff` - Compare code versions
- `git_blame` - Identify code ownership
- `git_status` - Check repository state

---

## Evidence Collection

### Required Screenshots (12 minimum)

| # | Phase | Description |
|---|-------|-------------|
| 1 | PO-01 | Product Owner mode activated |
| 2 | PO-02 | Reading incident logs via Filesystem MCP |
| 3 | PO-03 | Generated incident summary document |
| 4 | DEV-01 | Developer mode activated |
| 5 | DEV-02 | Log analysis via Filesystem MCP |
| 6 | DEV-03 | Git history via Git MCP |
| 7 | DEV-04 | Technical analysis document |
| 8 | ARCH-01 | Architect mode activated |
| 9 | ARCH-02 | Impact assessment document |
| 10 | SEC-01 | Security mode activated |
| 11 | SEC-02 | Security report document |
| 12 | FINAL-01 | All incident documents in explorer |

---

## Expected Deliverables

### Generated Documents (6 files)

1. **INC-001-summary.md**
   - Business impact analysis
   - Investigation scope
   - Priority and stakeholders

2. **INC-001-technical-analysis.md**
   - Root cause identification
   - Code references with line numbers
   - Proposed technical solution

3. **INC-001-impact-assessment.md**
   - Service dependency map
   - Impacted components list
   - Architectural recommendations

4. **INC-001-security-report.md**
   - Security implications
   - Compliance status
   - Data exposure assessment

5. **INC-001-final-report.md**
   - Executive summary
   - Consolidated findings
   - Resolution status

6. **INC-001-status-update.md**
   - Stakeholder communication
   - Lessons learned
   - Prevention measures

---

## Execution Timeline

| Phase | Mode | Duration | Key Activity |
|-------|------|----------|--------------|
| 1 | Product Owner | 5-10 min | Define scope |
| 2 | Developer | 10-15 min | Root cause analysis |
| 3 | Architect | 5-10 min | Impact assessment |
| 4 | Security | 5-10 min | Compliance check |
| 5 | Product Owner | 5-10 min | Final report |
| **Total** | | **30-55 min** | **Complete workflow** |

---

## Success Criteria

- ✅ All 4 custom modes used
- ✅ Minimum 2 MCP servers utilized
- ✅ Complete workflow executed
- ✅ All 6 documents generated
- ✅ Minimum 12 screenshots captured
- ✅ MCP evidence collected
- ✅ Workflow repeatable

---

## Troubleshooting

### Mode Not Available
```bash
# Check custom modes file exists
ls integration-incident-commander/.bob/custom_modes.yaml

# Restart Bob IDE
# Verify YAML syntax
```

### MCP Connection Failed
```bash
# Verify MCP server running
# Check Bob settings > MCP Servers
# Test with simple read operation
```

### File Access Denied
```bash
# Check mode's file restrictions
# Use Developer mode for full access
# Verify file path is correct
```

---

## Quick Commands

```bash
# Start application
cd integration-incident-commander/backend && npm start
cd integration-incident-commander/frontend && npm start

# Trigger incident
# Open http://localhost:3000
# Click "Trigger Integration Workflow"

# Mode switching
/mode product-owner
/mode developer
/mode architect
/mode security

# View generated documents
ls integration-incident-commander/docs/incidents/
```

---

## Next Steps After Completion

1. **Compile Evidence Package**
   - Organize all 12+ screenshots
   - Export MCP operation logs
   - Archive incident documents

2. **Review Metrics**
   - Workflow execution time
   - Document quality
   - MCP operation efficiency

3. **Document Lessons**
   - What worked well
   - Improvement opportunities
   - Process refinements

4. **Extend Workflow**
   - Add more specialized modes
   - Integrate additional MCP servers
   - Automate handoffs

---

## Support

For detailed information:
- Full workflow: [`CHALLENGE_4_MULTI_AGENT_DELIVERY.md`](./CHALLENGE_4_MULTI_AGENT_DELIVERY.md)
- Architecture: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- Setup: [`SETUP.md`](./SETUP.md)
- Demo scenario: [`DEMO_SCENARIO.md`](./DEMO_SCENARIO.md)

---

**Ready to execute?** Start with Phase 1 and follow the prompts! 🚀