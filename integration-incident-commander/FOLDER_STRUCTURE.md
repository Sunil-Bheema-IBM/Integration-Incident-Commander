# Integration Incident Commander - Complete Folder Structure

## Overview

This document provides a detailed explanation of the project's folder structure and the purpose of each directory and file.

## Root Directory Structure

```
integration-incident-commander/
├── frontend/                 # React application
├── backend/                  # Node.js Express API
├── agents/                   # AI agent implementations (symlinked to backend/agents)
├── logs/                     # Application logs
├── docs/                     # Documentation
├── README.md                 # Project overview
├── FOLDER_STRUCTURE.md       # This file
└── .gitignore               # Git ignore rules
```

---

## 📁 frontend/ - React Application

**Purpose**: User interface for the Integration Incident Commander

```
frontend/
├── package.json              # Frontend dependencies and scripts
├── public/
│   └── index.html           # HTML template
└── src/
    ├── index.js             # React entry point
    ├── index.css            # Global styles
    ├── App.js               # Main application component
    ├── App.css              # Main application styles
    ├── services/
    │   └── api.js           # API communication service
    └── components/
        ├── IntegrationWorkflow.js      # Workflow visualization
        ├── IntegrationWorkflow.css
        ├── AgentTimeline.js            # Agent investigation timeline
        ├── AgentTimeline.css
        ├── IncidentReport.js           # Final incident report
        ├── IncidentReport.css
        ├── ComplianceReport.js         # Compliance dashboard
        └── ComplianceReport.css
```

### Frontend Components Explained

**public/**
- `index.html`: Base HTML template that React mounts to

**src/**
- `index.js`: Application entry point, renders App component
- `index.css`: Global CSS styles (body, fonts, etc.)
- `App.js`: Main container component with state management
- `App.css`: Styles for main app layout

**src/services/**
- `api.js`: Axios-based API client for backend communication
  - Trigger integration
  - Get status updates
  - Fetch incident details
  - Get compliance reports

**src/components/**
- `IntegrationWorkflow.js`: Displays the integration flow steps
  - Shows Order API → Payment Service → Database
  - Color-coded success/failure indicators
  - Error details display

- `AgentTimeline.js`: Shows AI agent investigation progress
  - Timeline visualization
  - Agent-specific analysis display
  - Confidence indicators
  - Real-time updates

- `IncidentReport.js`: Comprehensive incident analysis
  - Root cause display
  - Impacted services
  - Recommended fixes
  - Security impact
  - Overall confidence score

- `ComplianceReport.js`: Compliance dashboard
  - Overall compliance score
  - Framework-specific scores
  - Control status (PASS/FAIL/WARNING)
  - Recommendations

---

## 📁 backend/ - Node.js Express API

**Purpose**: REST API server, business logic, and data management

```
backend/
├── package.json              # Backend dependencies
├── server.js                 # Express server entry point
├── agents/
│   ├── agentOrchestrator.js         # Coordinates multi-agent workflow
│   ├── productOwnerAgent.js         # Business impact analysis
│   ├── developerAgent.js            # Technical root cause analysis
│   ├── architectAgent.js            # System architecture analysis
│   └── securityAgent.js             # Security & compliance analysis
├── services/
│   ├── integrationService.js        # Integration workflow simulation
│   └── complianceService.js         # Compliance evaluation
└── utils/
    └── logger.js                     # Winston logging configuration
```

### Backend Structure Explained

**Root Level**
- `package.json`: Dependencies (express, cors, uuid, winston)
- `server.js`: Main Express server
  - API routes
  - Middleware configuration
  - In-memory storage (Map objects)
  - Error handling

**agents/**
- `agentOrchestrator.js`: Multi-agent workflow coordinator
  - Executes agents sequentially
  - Aggregates results
  - Generates final report
  - Calculates overall confidence

- `productOwnerAgent.js`: Business perspective
  - Assesses business impact
  - Identifies affected features
  - Sets priority level
  - Defines investigation scope

- `developerAgent.js`: Technical perspective
  - Analyzes error codes
  - Identifies root cause
  - Suggests immediate fixes
  - Provides code-level details

- `architectAgent.js`: System design perspective
  - Maps service dependencies
  - Identifies impacted services
  - Assesses architectural impact
  - Recommends improvements

- `securityAgent.js`: Security perspective
  - Evaluates security severity
  - Checks compliance (PCI DSS, SOC 2, GDPR)
  - Analyzes data exposure risk
  - Provides security recommendations

**services/**
- `integrationService.js`: Integration workflow simulator
  - Simulates Order API (success)
  - Simulates Payment Service (failure)
  - Simulates Database operations
  - Generates realistic logs

- `complianceService.js`: Compliance evaluation
  - Evaluates 10 security controls
  - Checks 4 frameworks (PCI DSS, SOC 2, GDPR, OWASP)
  - Calculates compliance scores
  - Generates recommendations

**utils/**
- `logger.js`: Winston logging setup
  - Console logging
  - File logging (combined.log, error.log)
  - Timestamp formatting
  - Log levels (info, error, warn)

---

## 📁 agents/ - AI Agent Implementations

**Purpose**: Symbolic link or copy of backend/agents for easy access

```
agents/
├── agentOrchestrator.js
├── productOwnerAgent.js
├── developerAgent.js
├── architectAgent.js
└── securityAgent.js
```

**Note**: This is typically a symbolic link to `backend/agents/` for convenience. If you need standalone access to agents, you can copy them here.

**Creating Symbolic Link**:
```bash
# On Mac/Linux
ln -s backend/agents agents

# On Windows (as Administrator)
mklink /D agents backend\agents
```

---

## 📁 logs/ - Application Logs

**Purpose**: Store application logs generated by Winston

```
logs/
├── combined.log              # All logs (info, warn, error)
├── error.log                 # Error logs only
└── .gitkeep                  # Keep directory in git
```

### Log Files Explained

**combined.log**
- Contains all log levels
- Includes timestamps
- Service name tagged
- JSON formatted

Example:
```json
{
  "level": "info",
  "message": "Integration workflow triggered: abc-123",
  "service": "iic-backend",
  "timestamp": "2024-01-01 12:00:00"
}
```

**error.log**
- Contains only error-level logs
- Critical for debugging
- Includes stack traces

**Note**: These files are auto-generated when the backend starts. They're excluded from git via .gitignore.

---

## 📁 docs/ - Documentation

**Purpose**: Comprehensive project documentation

```
docs/
├── ARCHITECTURE.md           # System architecture details
├── SETUP.md                  # Installation and setup guide
├── DEMO_SCENARIO.md          # Step-by-step demo walkthrough
└── PROJECT_SUMMARY.md        # Project overview and summary
```

### Documentation Files Explained

**ARCHITECTURE.md**
- System architecture diagrams
- Component descriptions
- Data flow explanations
- Technology stack details
- Design patterns used
- Scalability considerations

**SETUP.md**
- Prerequisites
- Installation steps
- Configuration options
- Running the application
- Troubleshooting guide
- Production deployment

**DEMO_SCENARIO.md**
- Demo story and context
- Step-by-step walkthrough
- What to observe at each step
- Expected outputs
- Demo script (5-minute presentation)
- Customization ideas

**PROJECT_SUMMARY.md**
- Project overview
- Key features
- Technical achievements
- File structure
- Success metrics
- Next steps

---

## Root Level Files

### README.md
**Purpose**: Project introduction and quick start guide

**Contents**:
- Project overview
- Features list
- Quick start instructions
- Technology stack
- Project structure
- Usage examples
- API endpoints
- Future enhancements

### FOLDER_STRUCTURE.md
**Purpose**: This file - explains the complete folder structure

### .gitignore
**Purpose**: Specifies files to exclude from version control

**Excludes**:
- `node_modules/` - Dependencies
- `logs/*.log` - Log files
- `.env` - Environment variables
- `build/` - Production builds
- IDE files (.vscode, .idea)
- OS files (.DS_Store, Thumbs.db)

---

## Complete File Tree

```
integration-incident-commander/
│
├── README.md                                    # Project overview
├── FOLDER_STRUCTURE.md                          # This file
├── .gitignore                                   # Git ignore rules
│
├── frontend/                                    # React Application
│   ├── package.json                            # Frontend dependencies
│   ├── public/
│   │   └── index.html                          # HTML template
│   └── src/
│       ├── index.js                            # React entry point
│       ├── index.css                           # Global styles
│       ├── App.js                              # Main component
│       ├── App.css                             # Main styles
│       ├── services/
│       │   └── api.js                          # API client
│       └── components/
│           ├── IntegrationWorkflow.js          # Workflow display
│           ├── IntegrationWorkflow.css
│           ├── AgentTimeline.js                # Timeline display
│           ├── AgentTimeline.css
│           ├── IncidentReport.js               # Report display
│           ├── IncidentReport.css
│           ├── ComplianceReport.js             # Compliance display
│           └── ComplianceReport.css
│
├── backend/                                     # Express API
│   ├── package.json                            # Backend dependencies
│   ├── server.js                               # Express server
│   ├── agents/
│   │   ├── agentOrchestrator.js               # Agent coordinator
│   │   ├── productOwnerAgent.js               # Business agent
│   │   ├── developerAgent.js                  # Technical agent
│   │   ├── architectAgent.js                  # Architecture agent
│   │   └── securityAgent.js                   # Security agent
│   ├── services/
│   │   ├── integrationService.js              # Integration simulator
│   │   └── complianceService.js               # Compliance checker
│   └── utils/
│       └── logger.js                           # Logging setup
│
├── agents/                                      # Symlink to backend/agents
│   └── (same as backend/agents/)
│
├── logs/                                        # Application logs
│   ├── combined.log                            # All logs
│   ├── error.log                               # Error logs
│   └── .gitkeep                                # Keep in git
│
└── docs/                                        # Documentation
    ├── ARCHITECTURE.md                         # Architecture guide
    ├── SETUP.md                                # Setup guide
    ├── DEMO_SCENARIO.md                        # Demo walkthrough
    └── PROJECT_SUMMARY.md                      # Project summary
```

---

## File Count Summary

- **Total Directories**: 11
- **Total Files**: 35+
- **Frontend Files**: 13
- **Backend Files**: 10
- **Documentation Files**: 5
- **Configuration Files**: 4

---

## Storage Strategy

### Current Implementation (In-Memory)
```javascript
// In server.js
const incidents = new Map();
const integrationRuns = new Map();
```

**Pros**:
- Simple and fast
- No database setup required
- Perfect for demo/prototype

**Cons**:
- Data lost on restart
- Not suitable for production

### Future Enhancement (SQLite)

**Proposed Structure**:
```
backend/
└── database/
    ├── db.sqlite                # SQLite database file
    ├── schema.sql               # Database schema
    └── migrations/              # Database migrations
        └── 001_initial.sql
```

**Tables**:
- `integration_runs` - Integration execution records
- `incidents` - Incident records
- `agent_analyses` - Agent analysis results
- `compliance_reports` - Compliance evaluations

---

## Development Workflow

### Starting Development
```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Start backend (Terminal 1)
cd backend && npm start

# 3. Start frontend (Terminal 2)
cd frontend && npm start

# 4. Access application
# Open http://localhost:3000
```

### Adding New Features

**New Agent**:
1. Create `backend/agents/newAgent.js`
2. Implement `analyze()` method
3. Register in `agentOrchestrator.js`

**New Component**:
1. Create `frontend/src/components/NewComponent.js`
2. Create `frontend/src/components/NewComponent.css`
3. Import and use in `App.js`

**New API Endpoint**:
1. Add route in `backend/server.js`
2. Add service method if needed
3. Add API call in `frontend/src/services/api.js`

---

## Deployment Structure

### Production Build
```
integration-incident-commander/
├── backend/
│   └── (same as development)
├── frontend/
│   └── build/                   # Production build
│       ├── static/
│       │   ├── css/
│       │   └── js/
│       └── index.html
└── logs/
```

### Docker Structure (Optional)
```
integration-incident-commander/
├── Dockerfile.backend           # Backend container
├── Dockerfile.frontend          # Frontend container
├── docker-compose.yml           # Orchestration
└── .dockerignore               # Docker ignore
```

---

## Summary

This folder structure provides:

✅ **Clear Separation**: Frontend, backend, agents, logs, docs
✅ **Modularity**: Easy to find and modify components
✅ **Scalability**: Simple to add new features
✅ **Maintainability**: Well-organized and documented
✅ **Best Practices**: Industry-standard structure

The structure is designed to be:
- **Simple** for quick understanding
- **Organized** for easy navigation
- **Extensible** for future growth
- **Professional** for enterprise use