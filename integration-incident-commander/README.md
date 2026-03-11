# Integration Incident Commander (IIC)

## Overview

The Integration Incident Commander is an AI-powered system that automatically diagnoses integration failures using a multi-agent workflow. It simulates real enterprise integration scenarios and provides intelligent root cause analysis.

## Architecture

```
Frontend (React) → Backend API (Node.js/Express) → AI Agents → Integration Services
                                                        ↓
                                                   Log Analysis
```

## Features

- **Simulated Integration Workflow**: Order API → Payment Service → Database
- **Multi-Agent AI System**: Product Owner, Developer, Architect, and Security agents
- **Automated Root Cause Analysis**: AI-driven incident diagnosis
- **Real-time Investigation Timeline**: Track agent reasoning process
- **Compliance Validation**: Security and compliance checks
- **Interactive Dashboard**: Monitor integration status and incidents

## Project Structure

```
integration-incident-commander/
├── frontend/              # React dashboard
├── backend/              # Node.js Express API
├── agents/               # Multi-agent AI system
├── logs/                 # Sample logs and log storage
├── docs/                 # Documentation
└── README.md
```

## Prerequisites

- Node.js 16+ and npm
- Modern web browser

## Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Start Backend Server

```bash
cd backend
npm start
```

Backend will run on `http://localhost:3001`

### 3. Start Frontend

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

### 4. Access Dashboard

Open your browser and navigate to `http://localhost:3000`

## Usage

### Basic Workflow

1. **Trigger Integration**: Click "Trigger Integration Workflow" button
2. **Simulate Failure**: The system will simulate a payment API failure
3. **Watch AI Analysis**: Observe the multi-agent investigation timeline
4. **Review Report**: See the final incident report with root cause and fix suggestions
5. **Apply AI Fix**: Click "Apply AI Suggested Fix & Re-run Integration" to automatically fix and retry

### Auto-Fix Feature

After the AI agents complete their analysis, you can:
- Click the **"Apply AI Suggested Fix & Re-run Integration"** button
- The system will automatically enable the token refresh middleware
- A new integration workflow will be triggered
- Watch the integration succeed with the fix applied
- See the success message: "✅ Integration Recovered Successfully!"

### Testing the Auto-Fix Endpoint

If the auto-fix button shows "Failed to apply fix", run this test:

```bash
cd backend
node test-apply-fix.js
```

This will verify:
- Backend server is running
- Endpoint is accessible
- Response format is correct

For detailed debugging, see [`docs/AUTO_FIX_DEBUGGING.md`](docs/AUTO_FIX_DEBUGGING.md)

## Multi-Agent System

### Agent Roles

1. **Product Owner Agent**: Defines investigation scope
2. **Developer Agent**: Analyzes technical root cause
3. **Architect Agent**: Identifies system dependencies
4. **Security Agent**: Evaluates compliance risks

### Agent Workflow

```
Incident Triggered
    ↓
Product Owner Agent (Scope Definition)
    ↓
Developer Agent (Log Analysis)
    ↓
Architect Agent (Dependency Impact)
    ↓
Security Agent (Compliance Check)
    ↓
Final Incident Report
```

## Sample Incident Scenario

**Scenario**: Payment API Authentication Failure

**Simulated Error**:
- Service: Payment API
- Error Code: 401 Unauthorized
- Message: "Authentication token expired"

**AI Analysis Output**:
- Root Cause: OAuth token expiration
- Impacted Services: Order Service, Invoice Service
- Suggested Fix: Refresh token configuration
- Confidence: 92%

## Compliance Controls

The system validates:
- ✅ TLS/HTTPS encryption
- ✅ Log generation
- ⚠️ Secret management
- ✅ API authentication

## Technology Stack

- **Frontend**: React, Axios, CSS3
- **Backend**: Node.js, Express
- **AI Engine**: Custom multi-agent reasoning
- **Storage**: JSON file-based storage
- **Logging**: Winston

## API Endpoints

### Integration Workflow
- `POST /api/integration/trigger` - Trigger integration workflow
- `GET /api/integration/status/:id` - Get integration status
- `POST /api/integration/apply-fix` - Apply AI fix and re-run integration

### Incident Analysis
- `GET /api/incidents/:id` - Get incident details
- `GET /api/incidents/:id/timeline` - Get agent investigation timeline

### Compliance
- `GET /api/compliance/report` - Get compliance report

## Development

### Backend Structure
```
backend/
├── server.js              # Express server
├── routes/                # API routes
├── services/              # Business logic
├── agents/                # AI agent implementations
└── utils/                 # Utilities
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/        # React components
│   ├── services/          # API services
│   └── App.js            # Main application
└── public/
```

## Modernization Example

This project demonstrates modernization by:
- Converting callback-based Node.js to async/await patterns
- Using modern ES6+ JavaScript features
- Implementing microservices architecture
- Adding AI-driven automation

## Future Enhancements

- Real integration with actual microservices
- Machine learning model training on historical incidents
- Slack/Teams notifications
- Advanced compliance frameworks (SOC2, HIPAA)
- Kubernetes deployment support

## License

MIT License

## Support

For issues or questions, please open an issue in the repository.