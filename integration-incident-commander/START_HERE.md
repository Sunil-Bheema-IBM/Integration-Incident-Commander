# 🚀 Quick Start Guide - Integration Incident Commander

## ⚠️ IMPORTANT: Read This First

The "Request failed with status code 404" error means **the backend server is not running**.

## Why the 404 Happened

**Root Cause:** Backend server not started

**Technical Details:**
- Frontend calls: `POST http://localhost:3001/api/integration/apply-fix`
- Backend route exists: Line 151 in `backend/server.js`
- Route definition: `app.post('/api/integration/apply-fix', ...)`
- **Problem:** Backend server must be running on port 3001

## ✅ Solution: Start Both Servers

### Step 1: Start Backend (REQUIRED)

Open a terminal and run:

```bash
cd integration-incident-commander/backend
npm install
npm start
```

**Wait for this message:**
```
Integration Incident Commander Backend running on port 3001
Health check: http://localhost:3001/api/health
```

### Step 2: Start Frontend

Open a **NEW** terminal (keep backend running) and run:

```bash
cd integration-incident-commander/frontend
npm install
npm start
```

Frontend will open at `http://localhost:3000`

### Step 3: Verify Backend is Running

Open a **third** terminal and test:

```bash
curl http://localhost:3001/api/health
```

**Expected response:**
```json
{"status":"healthy","timestamp":"2026-03-11T06:26:37.253Z"}
```

If you get "Connection refused" - backend is not running (go back to Step 1)

## 🎯 Complete Demo Flow

1. **Trigger Integration**
   - Click "Trigger Integration Workflow" button
   - Wait for integration to fail (simulated 401 error)

2. **Watch AI Analysis**
   - Product Owner Agent analyzes scope
   - Developer Agent identifies root cause
   - Architect Agent checks dependencies
   - Security Agent evaluates compliance
   - Wait for "Analysis Complete" status

3. **Apply AI Fix**
   - Click "Apply AI Suggested Fix & Re-run Integration" button
   - Button shows spinner: "Applying Fix..."
   - Backend enables token refresh middleware
   - New integration workflow starts
   - Button disappears after success

4. **Verify Success**
   - Success message appears: "✅ Integration Recovered Successfully!"
   - Integration status shows "success"
   - All workflow steps show green checkmarks

## 🔍 Troubleshooting

### Problem: "Request failed with status code 404"

**Cause:** Backend not running

**Fix:**
```bash
# Terminal 1
cd integration-incident-commander/backend
npm start
```

### Problem: "ECONNREFUSED" or "Network Error"

**Cause:** Backend not accessible

**Fix:**
1. Check backend is running (see Step 1 above)
2. Verify no firewall blocking port 3001
3. Check backend logs for errors

### Problem: Button shows "Failed to apply fix"

**Cause:** Generic error (check browser console)

**Fix:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error details
4. Check Network tab for failed requests

### Problem: Port 3001 already in use

**Windows:**
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3001 | xargs kill -9
```

## 📊 Verification Checklist

Before clicking the Auto-Fix button, verify:

- [ ] Backend terminal shows "running on port 3001"
- [ ] Frontend opened at http://localhost:3000
- [ ] Integration workflow triggered successfully
- [ ] Integration failed with 401 error
- [ ] All 4 AI agents completed analysis
- [ ] "Apply AI Suggested Fix" button is visible
- [ ] Browser console shows no errors

## 🧪 Test the Endpoint Directly

If the button still doesn't work, test the endpoint:

```bash
cd integration-incident-commander/backend
node test-apply-fix.js
```

**Expected output:**
```
✅ SUCCESS! Response received:
{
  "success": true,
  "runId": "...",
  "message": "AI fix applied. Integration workflow re-triggered.",
  "fixApplied": "Token Refresh Middleware Enabled"
}
```

## 📝 API Endpoint Details

**Frontend API Call:**
- File: `frontend/src/services/api.js` (Line 26)
- Method: `POST`
- URL: `http://localhost:3001/api/integration/apply-fix`
- Body: None (empty POST)

**Backend Route:**
- File: `backend/server.js` (Line 151)
- Route: `app.post('/api/integration/apply-fix', ...)`
- Handler: Applies fix, creates new integration run, returns runId

**Response Format:**
```json
{
  "success": true,
  "runId": "uuid-string",
  "message": "AI fix applied. Integration workflow re-triggered.",
  "fixApplied": "Token Refresh Middleware Enabled"
}
```

## 🎬 Video Walkthrough (Text Version)

1. **Terminal 1:** `cd backend && npm start` → Wait for "running on port 3001"
2. **Terminal 2:** `cd frontend && npm start` → Browser opens
3. **Browser:** Click "Trigger Integration Workflow"
4. **Wait:** ~10 seconds for AI analysis to complete
5. **Browser:** Click "Apply AI Suggested Fix & Re-run Integration"
6. **Result:** Success message appears, integration recovers

## 📚 Additional Documentation

- **Detailed Debugging:** [`docs/AUTO_FIX_DEBUGGING.md`](docs/AUTO_FIX_DEBUGGING.md)
- **Implementation Details:** [`docs/AUTO_FIX_IMPLEMENTATION.md`](docs/AUTO_FIX_IMPLEMENTATION.md)
- **Quick Troubleshooting:** [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)
- **Architecture:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

## ⚡ Quick Commands

```bash
# Start everything (run each in separate terminal)
cd integration-incident-commander/backend && npm start
cd integration-incident-commander/frontend && npm start

# Test backend endpoint
cd integration-incident-commander/backend && node test-apply-fix.js

# Check backend health
curl http://localhost:3001/api/health

# View backend logs
# (They appear in the terminal where you ran npm start)
```

## 🆘 Still Not Working?

1. **Check both terminals are running**
   - Backend: Should show "running on port 3001"
   - Frontend: Should show "webpack compiled successfully"

2. **Check browser console (F12)**
   - Look for red errors
   - Check Network tab for failed requests

3. **Restart everything**
   ```bash
   # Stop both servers (Ctrl+C in both terminals)
   # Then start again:
   cd backend && npm start
   cd frontend && npm start  # in new terminal
   ```

4. **Clean install**
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   npm start
   ```

## ✅ Success Indicators

When everything works correctly:

1. ✅ Backend logs: "Integration Incident Commander Backend running on port 3001"
2. ✅ Frontend opens: http://localhost:3000
3. ✅ Integration fails: 401 Unauthorized error
4. ✅ AI analysis completes: 4 agents finish
5. ✅ Button appears: "Apply AI Suggested Fix & Re-run Integration"
6. ✅ Button click: Shows spinner "Applying Fix..."
7. ✅ Button disappears: After successful API call
8. ✅ Success message: "✅ Integration Recovered Successfully!"
9. ✅ Integration status: Changes to "success"
10. ✅ Workflow steps: All show green checkmarks

---

**Remember:** The backend MUST be running before the frontend can make API calls!