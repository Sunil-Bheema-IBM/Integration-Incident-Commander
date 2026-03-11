# Integration Incident Commander - README.md

Here is the complete README.md content for your project:

---

# Integration Incident Commander (IIC)

> AI-Powered Multi-Agent System for Automated Integration Failure Diagnosis

## 🎯 Overview

Integration Incident Commander is a prototype application that demonstrates how AI agents can automatically diagnose integration failures in enterprise systems. The system simulates a real-world integration scenario and uses a multi-agent AI workflow to analyze failures, identify root causes, and suggest fixes.

### Key Features

- 🤖 **Multi-Agent AI System** - 4 specialized agents (Product Owner, Developer, Architect, Security)
- 🔍 **Automated Root Cause Analysis** - AI-driven investigation of integration failures
- 📊 **Real-time Investigation Timeline** - Visual representation of agent reasoning
- 🔒 **Security & Compliance** - FedRAMP-style controls and compliance reporting
- 🛠️ **Auto-Fix Capability** - Automatic remediation of common issues
- 📈 **Knowledge Graph** - MCP-powered context sharing across agents

## 🏗️ Architecture

### Integration Flow
```
Frontend → Order API → Payment Service → Database
                ↓
         (Failure Point)
                ↓
         AI Agent Analysis
                ↓
         Root Cause + Fix
```

### Multi-Agent System
```
Incident Triggered
       ↓
🎯 Product Owner: Define scope & business impact
       ↓
💻 Developer: Analyze logs & identify root cause
       ↓
🏗️ Architect: Map dependencies & assess impact
       ↓
🔒 Security: Validate compliance & security
       ↓
Final Report: Consolidated findings & solution
```

## 📦 Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- Git

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

### 3. Trigger an Incident

1. Open browser to `http://localhost:3000`
2. Click **"Trigger Integration Workflow"** button
3. Watch the integration fail (simulated OAuth token expiration)
4. Observe AI agents automatically analyze the failure
5. Review the investigation timeline and incident report
6. Click **"Apply Fix"** to remediate the issue
7. Trigger workflow again to verify fix

## 🤖 Multi-Agent Workflow

### Agent Roles

#### 🎯 Product Owner Agent
- Business impact assessment
- Priority assignment (P1/P2/P3/P4)
- Investigation scope definition
- Success criteria

#### 💻 Developer Agent
- Root cause identification
- Code location references
- Technical solution proposal
- Confidence score (85-95%)

#### 🏗️ Architect Agent
- Dependency mapping
- Blast radius assessment
- Architectural recommendations
- Integration gap identification

#### 🔒 Security Agent
- Compliance violation identification
- Security risk assessment (CVSS scoring)
- Remediation recommendations
- Framework validation (PCI DSS, SOC 2, GDPR)

**Typical Analysis Time:** 2-5 seconds  
**Overall Confidence:** 85-95%

## 📁 Project Structure

```
integration-incident-commander/
├── backend/
│   ├── server.js                 # Express server
│   ├── agents/
│   │   ├── agentOrchestrator.js  # Multi-agent coordinator
│   │   ├── productOwnerAgent.js  # Business analysis
│   │   ├── developerAgent.js     # Technical analysis
│   │   ├── architectAgent.js     # Architecture analysis
│   │   └── securityAgent.js      # Security analysis
│   ├── services/
│   │   ├── integrationService.js # Integration workflow
│   │   ├── tokenService.js       # OAuth token management
│   │   └── complianceService.js  # Compliance validation
│   ├── middleware/
│   │   ├── authMiddleware.js     # Authentication
│   │   ├── auditLogger.js        # Audit logging
│   │   └── inputValidation.js    # Input validation
│   └── logs/
│       └── combined.log          # Application logs
├── frontend/
│   ├── src/
│   │   ├── App.js                # Main application
│   │   ├── components/
│   │   │   ├── IntegrationWorkflow.js
│   │   │   ├── AIInvestigationTimeline.js
│   │   │   ├── IncidentReport.js
│   │   │   ├── ComplianceReport.js
│   │   │   └── AutoFixPanel.js
│   │   ├── context/
│   │   │   └── AppContext.js     # Global state
│   │   └── hooks/
│   │       ├── useIntegrationWorkflow.js
│   │       └── useIncidentManagement.js
└── docs/
    ├── ARCHITECTURE.md
    ├── CHALLENGE_4_WORKFLOW_EXECUTION.md
    ├── COMPLIANCE.md
    ├── SECURITY.md
    └── MCP_SERVER_GUIDE.md
```

## 🔌 API Endpoints

### Trigger Integration Workflow
```http
POST /api/integration/trigger
```

### Get AI Investigation
```http
GET /api/investigation/:workflowId
```

### Apply Fix
```http
POST /api/integration/apply-fix
```

### Get Compliance Report
```http
GET /api/compliance/report
```

## 🔒 Compliance & Security

### Implemented Controls

| Control | Description | Status | Framework |
|---------|-------------|--------|-----------|
| SEC-001 | TLS Encryption | ✅ PASS | PCI DSS 4.1, SOC 2 |
| AC-002 | Account Management | ✅ PASS | FedRAMP AC-2 |
| IA-002 | User Identification | ✅ PASS | FedRAMP IA-2 |
| IA-005 | Authenticator Management | ✅ PASS | FedRAMP IA-5 |
| AU-002 | Audit Events | ✅ PASS | FedRAMP AU-2 |
| SEC-002 | Secret Management | ⚠️ FAIL | PCI DSS 8.2 |
| AUTH-001 | Token Refresh | ⚠️ WARNING | PCI DSS 8.2.4 |
| SEC-004 | Rate Limiting | ⚠️ FAIL | OWASP API |

**Overall Compliance Score:** 85%

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process and restart
cd backend
npm start
```

### Frontend won't start
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm start
```

### AI Agents not responding
- Verify backend is running on port 5000
- Check browser console for errors
- Review `backend/logs/combined.log`

## 📚 Documentation

- [`START_HERE.md`](START_HERE.md) - Quick start guide
- [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) - System architecture
- [`CHALLENGE_4_WORKFLOW_EXECUTION.md`](docs/CHALLENGE_4_WORKFLOW_EXECUTION.md) - Real investigation example
- [`COMPLIANCE.md`](docs/COMPLIANCE.md) - Compliance documentation
- [`SECURITY.md`](docs/SECURITY.md) - Security documentation
- [`MCP_SERVER_GUIDE.md`](docs/MCP_SERVER_GUIDE.md) - MCP setup guide
- [`TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) - Common issues

## 🎓 Key Concepts

- **Multi-Agent Systems:** Specialized AI agents collaborate to solve complex problems
- **Knowledge Graphs:** MCP Memory for context sharing across agents
- **Integration Patterns:** Synchronous request-response chains
- **OAuth Token Lifecycle:** Token expiration and refresh mechanisms
- **Compliance Frameworks:** PCI DSS, SOC 2, GDPR, FedRAMP

## 🗺️ Roadmap

### Recent Updates
- ✅ Multi-agent AI workflow (Challenge 4)
- ✅ MCP server integration
- ✅ Knowledge graph for context sharing
- ✅ Frontend modernization
- ✅ FedRAMP-style compliance controls
- ✅ Auto-fix capability

### Planned Features
- [ ] Real OAuth 2.0 integration
- [ ] Circuit breaker pattern
- [ ] Distributed tracing
- [ ] Real-time collaboration visualization
- [ ] Machine learning for pattern recognition

## 📄 License

MIT License

---

**Built with ❤️ for demonstrating AI-powered integration incident management**

**Version:** 1.0.0  
**Last Updated:** March 2026

---

**Copy this entire content and save it as `README.md` in your `integration-incident-commander` directory.**
