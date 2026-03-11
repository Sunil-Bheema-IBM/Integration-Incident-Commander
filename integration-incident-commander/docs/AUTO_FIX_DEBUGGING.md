# Auto Fix Feature - Debugging Guide

## Overview
This document explains the Auto Fix feature implementation and how to debug issues.

## Feature Flow

### 1. Frontend Button Click
**File:** `frontend/src/components/IncidentReport.js` (Lines 71-100)

```javascript
// Button appears after Root Cause Analysis
{!fixApplied && report.rootCause && (
  <button onClick={handleApplyFix}>
    Apply AI Suggested Fix & Re-run Integration
  </button>
)}
```

### 2. Component Handler
**File:** `frontend/src/components/IncidentReport.js` (Lines 11-24)

```javascript
const handleApplyFix = async () => {
  setApplying(true);
  setError(null);
  try {
    await onApplyFix(); // Calls parent handler
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    setError(errorMsg); // Shows inline error
  } finally {
    setApplying(false);
  }
};
```

### 3. App.js Handler
**File:** `frontend/src/App.js` (Lines 101-126)

```javascript
const handleApplyFix = async () => {
  console.log('Calling applyFixAndRerun API...');
  const response = await api.applyFixAndRerun();
  console.log('API Response:', response);
  
  if (!response.runId) {
    throw new Error('No runId returned from API');
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  const status = await api.getIntegrationStatus(response.runId);
  
  setIntegrationStatus(status);
  setFixApplied(true);
  return response;
};
```

### 4. API Service
**File:** `frontend/src/services/api.js` (Lines 25-28)

```javascript
applyFixAndRerun: async () => {
  const response = await axios.post(`${API_BASE_URL}/integration/apply-fix`);
  return response.data;
}
```

**API_BASE_URL:** `http://localhost:3001/api`
**Full Endpoint:** `POST http://localhost:3001/api/integration/apply-fix`

### 5. Backend Endpoint
**File:** `backend/server.js` (Lines 151-198)

```javascript
app.post('/api/integration/apply-fix', async (req, res) => {
  integrationService.applyFix(); // Enable fix flag
  
  const runId = uuidv4();
  const integrationRun = {
    id: runId,
    status: 'running',
    fixApplied: true
  };
  
  integrationRuns.set(runId, integrationRun);
  
  // Execute workflow asynchronously
  integrationService.executeWorkflow(runId)
    .then((result) => {
      integrationRun.status = result.status;
      integrationRun.steps = result.steps;
    });
  
  res.json({
    success: true,
    runId: runId,
    message: 'AI fix applied. Integration workflow re-triggered.',
    fixApplied: 'Token Refresh Middleware Enabled'
  });
});
```

### 6. Integration Service
**File:** `backend/services/integrationService.js` (Lines 16-19)

```javascript
applyFix() {
  this.fixApplied = true;
  logger.info('AI Fix Applied: Token Refresh Middleware Enabled');
}
```

## Expected Response Format

### Success Response
```json
{
  "success": true,
  "runId": "uuid-string",
  "message": "AI fix applied. Integration workflow re-triggered.",
  "fixApplied": "Token Refresh Middleware Enabled"
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## Common Issues & Solutions

### Issue 1: "Failed to apply fix"
**Cause:** Backend server not running or not accessible

**Solution:**
```bash
# Terminal 1 - Start Backend
cd integration-incident-commander/backend
npm start

# Should see:
# Server running on port 3001
```

### Issue 2: CORS Error
**Cause:** Frontend and backend on different origins

**Solution:** Backend already has CORS enabled in `server.js`:
```javascript
app.use(cors());
```

### Issue 3: Network Error
**Cause:** Wrong API URL or port

**Check:**
- Backend runs on: `http://localhost:3001`
- Frontend expects: `http://localhost:3001/api`
- Full endpoint: `http://localhost:3001/api/integration/apply-fix`

### Issue 4: No runId in response
**Cause:** Backend error or malformed response

**Check:** Backend logs for errors

## Testing the Endpoint Directly

### Using curl
```bash
curl -X POST http://localhost:3001/api/integration/apply-fix \
  -H "Content-Type: application/json"
```

### Expected Output
```json
{
  "success": true,
  "runId": "some-uuid",
  "message": "AI fix applied. Integration workflow re-triggered.",
  "fixApplied": "Token Refresh Middleware Enabled"
}
```

### Using Browser Console
```javascript
fetch('http://localhost:3001/api/integration/apply-fix', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## Debugging Steps

### Step 1: Verify Backend is Running
```bash
cd integration-incident-commander/backend
npm start
```

Look for: `Server running on port 3001`

### Step 2: Check Backend Logs
When you click the button, you should see:
```
[INFO] Applying AI suggested fix
[INFO] Re-running integration workflow with fix applied: <uuid>
[INFO] AI Fix Applied: Token Refresh Middleware Enabled
```

### Step 3: Check Browser Console
Open DevTools (F12) → Console tab

You should see:
```
Calling applyFixAndRerun API...
API Response: {success: true, runId: "...", ...}
Integration Status: {id: "...", status: "running", ...}
```

### Step 4: Check Network Tab
Open DevTools (F12) → Network tab

Look for:
- Request: `POST http://localhost:3001/api/integration/apply-fix`
- Status: `200 OK`
- Response: JSON with `success: true`

### Step 5: Check for Errors
If you see errors, check:
1. **Console errors** - JavaScript errors
2. **Network errors** - Failed requests (red in Network tab)
3. **Backend logs** - Server-side errors

## Success Indicators

### 1. Button State Changes
- Initial: "Apply AI Suggested Fix & Re-run Integration"
- Clicking: "Applying Fix..." (with spinner)
- Success: Button disappears, success message appears

### 2. Integration Status Updates
- Status changes to "running"
- After ~3 seconds, status changes to "success"
- Success message shows: "✅ Integration Recovered Successfully!"

### 3. Workflow Visualization
- All steps show green checkmarks
- No error indicators

## Error Messages Explained

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Failed to apply fix" | Generic catch-all | Check if backend is running |
| "Network Error" | Cannot reach backend | Verify backend URL and port |
| "No runId returned from API" | Backend response malformed | Check backend logs |
| "500 Internal Server Error" | Backend crashed | Check backend console for stack trace |

## File Checklist

Verify these files exist and have correct content:

- ✅ `frontend/src/services/api.js` - API client
- ✅ `frontend/src/App.js` - Main handler
- ✅ `frontend/src/components/IncidentReport.js` - Button component
- ✅ `backend/server.js` - Endpoint definition
- ✅ `backend/services/integrationService.js` - Fix logic

## Quick Start Commands

```bash
# Terminal 1 - Backend
cd integration-incident-commander/backend
npm install
npm start

# Terminal 2 - Frontend
cd integration-incident-commander/frontend
npm install
npm start

# Browser
# Open http://localhost:3000
# Click "Trigger Integration Workflow"
# Wait for failure and AI analysis
# Click "Apply AI Suggested Fix & Re-run Integration"
```

## Expected Behavior

1. **Before Fix:**
   - Integration fails with 401 error
   - AI agents analyze the failure
   - Button appears: "Apply AI Suggested Fix & Re-run Integration"

2. **During Fix:**
   - Button shows spinner: "Applying Fix..."
   - Backend enables token refresh middleware
   - New integration workflow starts

3. **After Fix:**
   - Button disappears
   - Success message appears
   - Integration status shows "success"
   - All workflow steps are green

## Contact

If issues persist after following this guide, check:
1. Node.js version (should be 14+)
2. npm packages installed correctly
3. No port conflicts (3000, 3001)
4. Firewall not blocking localhost connections