# Integration Incident Commander - Demo Scenario

## Overview

This document provides a step-by-step walkthrough of the Integration Incident Commander demo scenario, explaining what happens at each stage and what to observe.

## Demo Scenario: Payment Service Authentication Failure

### Background Story

Your e-commerce platform processes thousands of orders daily. The integration flow is:
```
Customer Order → Order API → Payment Service → Database → Confirmation
```

Today, customers are reporting they cannot complete purchases. The system needs to quickly diagnose and resolve the issue.

## Step-by-Step Walkthrough

### Step 1: Access the Dashboard

1. Open your browser to `http://localhost:3000`
2. You'll see the Integration Incident Commander dashboard
3. Notice the clean, professional interface with:
   - Header with system title
   - "Trigger Integration Workflow" button
   - Two tabs: "Integration Workflow" and "Compliance Report"

**What to observe:**
- Modern, gradient-based design
- Clear call-to-action button
- Welcome message explaining the system

### Step 2: Trigger the Integration

1. Click the **"Trigger Integration Workflow"** button
2. The button becomes disabled
3. A status badge appears showing "Status: RUNNING"

**What happens behind the scenes:**
```
1. Frontend sends POST request to /api/integration/trigger
2. Backend creates unique run ID
3. Integration workflow starts executing
4. Frontend begins polling for status updates every 2 seconds
```

**What to observe:**
- Button state changes
- Status badge appears
- Loading indicators

### Step 3: Watch the Integration Flow

After 1-2 seconds, you'll see the workflow diagram appear with three steps:

#### Step 1: Order API (Success ✓)
- **Service**: OrderAPI
- **Status**: Success
- **Data**: 
  - Order ID: ORD-xxxxxxxx
  - Amount: $299.99
  - Currency: USD

**What happened:**
- Order received and validated
- Order ID generated
- Amount confirmed

#### Step 2: Payment Service (Failed ✗)
- **Service**: PaymentService
- **Status**: Failed
- **Error**: 401 Unauthorized
- **Message**: "Authentication token expired"
- **Details**: "OAuth token has expired. Token was issued 24 hours ago and has exceeded maximum lifetime."

**What happened:**
- Payment service attempted to process payment
- Authentication check failed
- OAuth token found to be expired
- Request rejected with 401 error

#### Step 3: Database (Not Reached)
- This step is not executed due to the failure in Step 2

**What to observe:**
- Visual workflow with color-coded steps
- Green border for success
- Red border for failure
- Detailed error information
- Timestamps for each step

### Step 4: AI Agent Analysis Begins

Once the failure is detected, the system automatically triggers AI analysis. You'll see:

1. **New section appears**: "🤖 AI Agent Investigation Timeline"
2. **Status badge**: "Analyzing..."
3. **Loading spinner**: Indicates analysis in progress

**What happens behind the scenes:**
```
1. System creates incident record
2. Incident ID generated
3. Logs collected and packaged
4. Multi-agent workflow initiated
5. Agents execute sequentially
```

### Step 5: Product Owner Agent Analysis

**Timeline Entry 1** (appears after ~500ms):

**Agent**: 👔 Product Owner
**Analysis**:
- **Summary**: "Integration failure detected in PaymentService. Payment processing is blocked. Customers cannot complete purchases."
- **Business Impact**: 
  - Severity: High
  - Priority: P1
  - Customer-facing: Yes
  - Estimated revenue loss: $5,000/hour
- **Affected Features**:
  - Payment processing
  - Order completion
  - Invoice generation
  - Refund processing

**What to observe:**
- Agent icon and role clearly displayed
- Business-focused analysis
- Impact assessment
- Timeline marker with color coding

### Step 6: Developer Agent Analysis

**Timeline Entry 2** (appears after ~1.2 seconds):

**Agent**: 💻 Developer
**Analysis**:
- **Root Cause**: "OAuth authentication token has expired. The token was issued 24 hours ago and exceeded its maximum lifetime of 1 hour."
- **Technical Details**:
  - Error Code: 401
  - Service: PaymentService
  - Message: Authentication token expired
  - Stack Trace: at PaymentService.authenticate() [line 45]
- **Confidence**: 95%
- **Suggested Fix**:
  - Immediate: Manually refresh OAuth token, restart service
  - Short-term: Implement automatic token refresh
  - Long-term: Implement OAuth 2.0 refresh token flow

**What to observe:**
- Technical depth of analysis
- High confidence level (95%)
- Actionable recommendations
- Code-level details

### Step 7: Architect Agent Analysis

**Timeline Entry 3** (appears after ~1.8 seconds):

**Agent**: 🏗️ Architect
**Analysis**:
- **Impacted Services**:
  1. OrderService (High impact) - Cannot complete order processing
  2. InvoiceService (High impact) - Cannot generate invoices
  3. NotificationService (Medium impact) - Cannot send confirmations
  4. InventoryService (Medium impact) - Cannot release inventory
- **Dependencies**:
  - Upstream: OrderService, Frontend
  - Downstream: AuthService, PaymentGateway, Database
  - External: StripeAPI, PayPalAPI
- **Recommendations**:
  - Implement circuit breaker pattern
  - Add retry logic with exponential backoff
  - Consider service mesh implementation

**What to observe:**
- System-wide impact analysis
- Dependency mapping
- Architectural recommendations
- Service status indicators

### Step 8: Security Agent Analysis

**Timeline Entry 4** (appears after ~2.4 seconds):

**Agent**: 🔒 Security
**Analysis**:
- **Security Severity**: High
- **Compliance Issues**:
  - PCI DSS 8.2.4: FAIL - Token management lacks proper controls
  - SOC 2 CC6.1: FAIL - Authentication token management issue
  - GDPR Article 32: WARNING - Service disruption affects availability
- **Security Score**: 65/100
- **Recommendations**:
  - Implement secure token management
  - Deploy secrets management solution
  - Enhance security logging

**What to observe:**
- Security-focused analysis
- Compliance framework references
- Specific control failures
- Security score

### Step 9: Final Incident Report

After all agents complete (~3 seconds total), the final report appears:

**Report Sections**:

1. **Executive Summary**
   - Clear description of the incident
   - Business impact statement

2. **Root Cause Analysis** (Highlighted)
   - Detailed root cause description
   - Technical details
   - Confidence level: 95%

3. **Impacted Services**
   - Grid view of affected services
   - Impact level for each
   - Current status

4. **Recommended Actions**
   - Immediate actions (red badge)
   - Long-term improvements (blue badge)
   - Specific, actionable steps

5. **Security & Compliance Impact**
   - Security severity
   - Compliance issues with status
   - Remediation steps

6. **Overall Confidence**
   - Circular progress indicator
   - 92% confidence score
   - Visual representation

**What to observe:**
- Professional report layout
- Color-coded sections
- Visual confidence indicators
- Comprehensive analysis

### Step 10: Review Compliance Report

1. Click the **"Compliance Report"** tab
2. System loads compliance data

**Compliance Dashboard Shows**:

1. **Overall Score**: 68%
   - Status: Fair
   - Large circular progress indicator

2. **Framework Compliance**:
   - PCI DSS: 60% (3 passed, 1 warning, 2 failed)
   - SOC 2: 67% (4 passed, 1 warning, 2 failed)
   - GDPR: 75% (3 passed, 1 warning, 1 failed)
   - OWASP: 100% (2 passed, 0 failed)

3. **Compliance Controls** (10 total):
   - ✓ TLS Encryption: PASS
   - ✓ Security Event Logging: PASS
   - ✗ Secret Management: FAIL (Critical)
   - ⚠ Strong Authentication: WARNING
   - ✓ Access Control: PASS
   - ⚠ Data Encryption at Rest: WARNING
   - ✓ Secure Error Handling: PASS
   - ✗ API Rate Limiting: FAIL
   - ✓ Input Validation: PASS
   - ✓ Audit Trail: PASS

4. **Recommendations**:
   - Critical: Implement Secrets Management Solution
   - High: Implement Secure Token Management
   - Medium: Enhance Security Logging

**What to observe:**
- Comprehensive compliance view
- Framework-specific scores
- Detailed control status
- Prioritized recommendations

## Key Takeaways

### What the Demo Demonstrates

1. **Realistic Integration Scenario**
   - Multi-step workflow
   - Authentic error conditions
   - Real-world failure patterns

2. **AI-Powered Analysis**
   - Multiple specialized agents
   - Sequential reasoning
   - Comprehensive investigation

3. **Business Value**
   - Quick root cause identification
   - Impact assessment
   - Actionable recommendations

4. **Enterprise Features**
   - Compliance monitoring
   - Security analysis
   - Audit trails

### Technical Highlights

1. **Multi-Agent Architecture**
   - Product Owner: Business perspective
   - Developer: Technical analysis
   - Architect: System design
   - Security: Compliance & security

2. **Real-Time Updates**
   - Polling mechanism
   - Progressive disclosure
   - Live status updates

3. **Professional UI**
   - Modern design
   - Responsive layout
   - Clear information hierarchy

## Demo Script (5-Minute Presentation)

### Introduction (30 seconds)
"Today I'll demonstrate the Integration Incident Commander, an AI-powered system that automatically diagnoses integration failures using multiple specialized agents."

### Trigger Integration (30 seconds)
"Let's simulate a real integration failure. I'll click this button to trigger our order processing workflow."

### Show Failure (1 minute)
"Notice how the workflow executes: Order API succeeds, but Payment Service fails with a 401 authentication error. This is a common real-world scenario."

### AI Analysis (2 minutes)
"Watch as four AI agents analyze this incident:
- Product Owner assesses business impact
- Developer identifies the technical root cause
- Architect maps system dependencies
- Security evaluates compliance implications

Each agent brings specialized expertise, and together they provide a comprehensive analysis."

### Final Report (1 minute)
"The system generates a detailed incident report with 95% confidence, identifying that the OAuth token expired and providing immediate and long-term fixes."

### Compliance (30 seconds)
"We can also view compliance status across multiple frameworks like PCI DSS, SOC 2, and GDPR."

### Conclusion (30 seconds)
"This demonstrates how AI can accelerate incident response, reduce MTTR, and provide consistent, thorough analysis of integration failures."

## Customization Ideas

### Modify the Scenario

1. **Change the failure point**:
   - Edit `backend/services/integrationService.js`
   - Modify `callPaymentService()` to succeed
   - Make `saveToDatabase()` fail instead

2. **Add new services**:
   - Add more steps to the workflow
   - Create new service methods
   - Update the flow diagram

3. **Change error types**:
   - Try 403 Forbidden
   - Try 500 Internal Server Error
   - Try 503 Service Unavailable

### Extend the Agents

1. **Add a new agent**:
   - Create `performanceAgent.js`
   - Analyze response times
   - Identify bottlenecks

2. **Enhance existing agents**:
   - Add more analysis logic
   - Include additional recommendations
   - Improve confidence calculations

## Troubleshooting the Demo

### Issue: Agents don't appear
**Solution**: Check browser console for errors, verify backend is running

### Issue: Timeline doesn't update
**Solution**: Check network tab, verify polling is working

### Issue: Report is incomplete
**Solution**: Wait for all agents to complete, check backend logs

## Next Steps

After running the demo:
1. Explore the code structure
2. Modify the scenario
3. Add new agents
4. Integrate with real services
5. Deploy to production environment