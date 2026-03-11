# Troubleshooting Guide

## Quick Diagnostics

### Problem: "Failed to apply fix" error when clicking the button

**Most Common Cause:** Backend server is not running

**Quick Fix:**
```bash
# Terminal 1 - Start Backend
cd integration-incident-commander/backend
npm start

# You should see: "Server running on port 3001"
```

### Problem: Button doesn't appear after incident analysis

**Possible Causes:**
1. AI analysis not completed yet (wait for "Analysis Complete" status)
2. `fixApplied` state is already true
3. No root cause in the report

**Check:**
- Wait for all 4 agents to complete (Product Owner → Developer → Architect → Security)
- Refresh the page and trigger a new integration workflow

### Problem: Button shows spinner forever

**Cause:** API call is hanging or backend is not responding

**Fix:**
1. Check backend console for errors
2. Check browser console (F12) for network errors
3. Verify backend is running on port 3001

## Step-by-Step Debugging

### Step 1: Verify Backend is Running

```bash
cd integration-incident-commander/backend
npm start
```

**Expected Output:**
```
Server running on port 3001
```

**If you see an error:**
- Port 3001 already in use: Kill the process or use a different port
- Module not found: Run `npm install`

### Step 2: Test the Endpoint Directly

```bash
cd integration-incident-commander/backend
node test-apply-fix.js
```

**Expected Output:**
```
✅ SUCCESS! Response received:
{
  "success": true,
  "runId": "...",
  "message": "AI fix applied. Integration workflow re-triggered.",
  "fixApplied": "Token Refresh Middleware Enabled"
}
```

**If you see an error:**
- Connection refused: Backend is not running (go to Step 1)
- 404 Not Found: Endpoint path is wrong (check server.js)
- 500 Internal Server Error: Check backend console for stack trace

### Step 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Click the "Apply AI Suggested Fix" button
4. Look for these messages:

**Expected:**
```
Calling applyFixAndRerun API...
API Response: {success: true, runId: "...", ...}
Integration Status: {id: "...", status: "running", ...}
```

**If you see errors:**
- Network Error: Backend not accessible
- CORS Error: Backend CORS not configured (should be enabled by default)
- 404 Error: Wrong API URL

### Step 4: Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click the button
4. Look for the request to `apply-fix`

**Check:**
- Request URL: Should be `http://localhost:3001/api/integration/apply-fix`
- Method: Should be `POST`
- Status: Should be `200 OK`
- Response: Should contain `{success: true, runId: "..."}`

### Step 5: Check Backend Logs

When you click the button, backend should log:

```
[INFO] Applying AI suggested fix
[INFO] Re-running integration workflow with fix applied: <uuid>
[INFO] AI Fix Applied: Token Refresh Middleware Enabled
[INFO] Starting integration workflow: <uuid>
[INFO] Integration succeeded after applying AI fix: <uuid>
```

**If you don't see these logs:**
- Request is not reaching the backend
- Check if frontend is using the correct API URL

## Common Error Messages

### "Failed to apply fix"
- **Cause:** Generic error catch-all
- **Solution:** Check backend is running, check browser console for details

### "Network Error"
- **Cause:** Cannot connect to backend
- **Solution:** Verify backend is running on port 3001

### "No runId returned from API"
- **Cause:** Backend response is malformed
- **Solution:** Check backend logs for errors, verify endpoint returns correct format

### "CORS Error"
- **Cause:** Cross-origin request blocked
- **Solution:** Verify backend has `app.use(cors())` in server.js (should be there by default)

## Environment Checklist

- [ ] Node.js 16+ installed
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] No firewall blocking localhost connections
- [ ] Browser allows localhost connections

## Port Conflicts

### Backend Port (3001) Already in Use

**Windows:**
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3001 | xargs kill -9
```

### Frontend Port (3000) Already in Use

React will automatically prompt to use a different port (3001, 3002, etc.)

## File Verification

Verify these files exist and have correct content:

```bash
# Backend files
integration-incident-commander/backend/server.js
integration-incident-commander/backend/services/integrationService.js
integration-incident-commander/backend/package.json

# Frontend files
integration-incident-commander/frontend/src/App.js
integration-incident-commander/frontend/src/services/api.js
integration-incident-commander/frontend/src/components/IncidentReport.js
```

## Still Having Issues?

1. **Read the detailed debugging guide:**
   - See [`docs/AUTO_FIX_DEBUGGING.md`](docs/AUTO_FIX_DEBUGGING.md)

2. **Check the architecture documentation:**
   - See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

3. **Verify the setup:**
   - See [`docs/SETUP.md`](docs/SETUP.md)

4. **Try a clean restart:**
   ```bash
   # Stop all servers (Ctrl+C in both terminals)
   
   # Clean install backend
   cd integration-incident-commander/backend
   rm -rf node_modules package-lock.json
   npm install
   npm start
   
   # Clean install frontend (in new terminal)
   cd integration-incident-commander/frontend
   rm -rf node_modules package-lock.json
   npm install
   npm start
   ```

## Success Indicators

When everything is working correctly:

1. ✅ Backend logs show "Server running on port 3001"
2. ✅ Frontend opens at http://localhost:3000
3. ✅ Clicking "Trigger Integration Workflow" shows failure
4. ✅ AI agents analyze the failure (4 agents complete)
5. ✅ "Apply AI Suggested Fix" button appears
6. ✅ Clicking button shows "Applying Fix..." with spinner
7. ✅ Button disappears after success
8. ✅ Success message appears: "✅ Integration Recovered Successfully!"
9. ✅ Integration status shows "success"
10. ✅ All workflow steps show green checkmarks

## Contact

If you've followed all steps and still have issues, please:
1. Check the browser console for errors
2. Check the backend console for errors
3. Run the test script: `node backend/test-apply-fix.js`
4. Review the detailed debugging guide in `docs/AUTO_FIX_DEBUGGING.md`