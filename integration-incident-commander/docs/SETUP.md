# Integration Incident Commander - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16.x or higher
- **npm**: Version 7.x or higher (comes with Node.js)
- **Git**: For cloning the repository (optional)
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge

### Verify Prerequisites

```bash
node --version  # Should show v16.x or higher
npm --version   # Should show v7.x or higher
```

## Installation

### Step 1: Navigate to Project Directory

```bash
cd integration-incident-commander
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

Expected output:
```
added 150 packages in 15s
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

Expected output:
```
added 1500 packages in 45s
```

## Configuration

### Backend Configuration

The backend runs on port 3001 by default. To change this:

1. Create a `.env` file in the `backend` directory:
```bash
cd backend
touch .env  # On Windows: type nul > .env
```

2. Add configuration:
```env
PORT=3001
NODE_ENV=development
```

### Frontend Configuration

The frontend expects the backend at `http://localhost:3001`. To change this:

1. Create a `.env` file in the `frontend` directory:
```bash
cd frontend
touch .env  # On Windows: type nul > .env
```

2. Add configuration:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Running the Application

### Option 1: Run Both Services Separately (Recommended for Development)

#### Terminal 1 - Backend
```bash
cd backend
npm start
```

Expected output:
```
[timestamp] [iic-backend] info: Integration Incident Commander Backend running on port 3001
[timestamp] [iic-backend] info: Health check: http://localhost:3001/api/health
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!

You can now view iic-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000
```

### Option 2: Using npm Scripts (Future Enhancement)

Create a `package.json` in the root directory with scripts to run both services.

## Accessing the Application

1. **Open your browser** and navigate to: `http://localhost:3000`

2. **Verify backend** is running: `http://localhost:3001/api/health`
   - Should return: `{"status":"healthy","timestamp":"..."}`

## First Run

### Test the Integration Workflow

1. Click the **"Trigger Integration Workflow"** button
2. Watch the integration flow execute
3. Observe the simulated failure in Payment Service
4. See AI agents analyze the incident
5. Review the final incident report

### View Compliance Report

1. Click the **"Compliance Report"** tab
2. Review the compliance controls
3. Check framework-specific compliance scores
4. Read recommendations

## Troubleshooting

### Backend Won't Start

**Problem**: Port 3001 already in use
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution**:
```bash
# Find process using port 3001
# On Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3001 | xargs kill -9

# Or change the port in backend/.env
PORT=3002
```

### Frontend Won't Start

**Problem**: Port 3000 already in use

**Solution**:
```bash
# The system will ask if you want to use a different port
# Press 'Y' to use port 3001 (or another available port)
```

### CORS Errors

**Problem**: Frontend can't connect to backend
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:
1. Ensure backend is running
2. Check backend URL in frontend/.env
3. Verify CORS is enabled in backend/server.js

### Module Not Found Errors

**Problem**: Missing dependencies
```
Error: Cannot find module 'express'
```

**Solution**:
```bash
# Reinstall dependencies
cd backend  # or frontend
rm -rf node_modules package-lock.json
npm install
```

### React Build Errors

**Problem**: Compilation errors in frontend

**Solution**:
```bash
cd frontend
npm install --legacy-peer-deps
```

## Development Mode

### Backend with Auto-Reload

```bash
cd backend
npm install -g nodemon  # Install nodemon globally
nodemon server.js
```

Or add to `backend/package.json`:
```json
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

Then run:
```bash
npm run dev
```

### Frontend with Hot Reload

The frontend automatically reloads when you save changes. No additional configuration needed.

## Production Build

### Build Frontend for Production

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build` directory.

### Serve Production Build

```bash
# Install serve globally
npm install -g serve

# Serve the build
serve -s build -p 3000
```

### Production Backend

```bash
cd backend
NODE_ENV=production npm start
```

## Docker Deployment (Optional)

### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml` in root:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
  
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

Run with:
```bash
docker-compose up
```

## Testing

### Backend API Testing

```bash
# Health check
curl http://localhost:3001/api/health

# Trigger integration
curl -X POST http://localhost:3001/api/integration/trigger

# Get compliance report
curl http://localhost:3001/api/compliance/report
```

### Frontend Testing

```bash
cd frontend
npm test
```

## Logs

### Backend Logs

Logs are written to:
- Console (stdout)
- `backend/logs/combined.log` (all logs)
- `backend/logs/error.log` (errors only)

View logs:
```bash
cd backend
tail -f logs/combined.log
```

### Frontend Logs

Check browser console (F12) for frontend logs and errors.

## Performance Optimization

### Backend

1. **Enable compression**:
```bash
npm install compression
```

Add to `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add caching**:
```bash
npm install node-cache
```

### Frontend

1. **Code splitting**: Already enabled with Create React App
2. **Lazy loading**: Implement for large components
3. **Image optimization**: Use WebP format
4. **Bundle analysis**:
```bash
npm install --save-dev webpack-bundle-analyzer
npm run build -- --stats
```

## Security Hardening

### Backend

1. **Add Helmet.js**:
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

2. **Rate limiting**:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

3. **Environment variables**: Never commit `.env` files

### Frontend

1. **Content Security Policy**: Configure in index.html
2. **HTTPS only**: Use HTTPS in production
3. **Sanitize inputs**: Validate all user inputs

## Monitoring

### Health Checks

Backend health endpoint: `GET /api/health`

Returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Metrics (Future Enhancement)

Consider adding:
- Prometheus for metrics collection
- Grafana for visualization
- ELK stack for log aggregation

## Backup and Recovery

### Data Backup

Currently uses in-memory storage. For production:

1. **Add database**: PostgreSQL or MongoDB
2. **Regular backups**: Automated daily backups
3. **Disaster recovery**: Multi-region deployment

## Updating

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package-name@latest
```

### Update Node.js

```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Verify
node --version
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review logs for error messages
3. Open an issue in the repository
4. Contact the development team

## Next Steps

After successful setup:
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
2. Review [API.md](./API.md) for API documentation
3. Check [DEMO_SCENARIO.md](./DEMO_SCENARIO.md) for demo walkthrough
4. Explore the code and customize as needed