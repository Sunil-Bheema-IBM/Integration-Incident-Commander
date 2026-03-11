# AI Investigation Timeline Feature

## Overview

The AI Investigation Timeline provides a comprehensive, chronological view of all events during an integration workflow execution, from initial trigger through AI analysis to recovery.

## Purpose

- **Transparency**: Shows exactly what the AI system is doing at each step
- **Debugging**: Helps understand the sequence of events leading to failures
- **Demo-Friendly**: Provides an engaging visual narrative of the AI investigation process
- **Audit Trail**: Creates a complete record of all actions taken

## Timeline Events

### Event Types

| Event Type | Icon | Description | Color |
|------------|------|-------------|-------|
| `workflow_triggered` | 🚀 | Integration workflow started | Gray |
| `step_success` | ✓ | Workflow step completed successfully | Green |
| `step_failed` | ✗ | Workflow step failed | Red |
| `incident_created` | 📋 | Incident created for analysis | Gray |
| `agent_analyzing` | 🤖 | AI agent analyzing the issue | Blue (pulsing) |
| `root_cause` | 🔍 | Root cause identified | Gray |
| `fix_suggested` | 💡 | AI suggested fix generated | Yellow |
| `fix_applied` | ⚡ | AI fix applied to system | Yellow |
| `workflow_rerun` | 🔄 | Workflow re-running with fix | Gray |
| `recovery_success` | ✅ | Integration recovered successfully | Green |

### Event Structure

```javascript
{
  type: 'agent_analyzing',
  message: 'Developer Agent analyzing',
  details: 'Analyzing logs for authentication errors',
  timestamp: '2026-03-11T10:23:20.270Z'
}
```

## Complete Flow Example

### Typical Timeline Sequence

1. **Workflow Triggered**
   ```
   🚀 Integration workflow triggered
      Starting Order → Payment → Database flow
   ```

2. **Step Success**
   ```
   ✓ OrderAPI completed successfully
   ```

3. **Step Failed**
   ```
   ✗ PaymentService failed
      Authentication token expired
   ```

4. **Incident Created**
   ```
   📋 Incident created - Starting AI analysis
   ```

5. **Agent Analysis** (Multiple agents)
   ```
   🤖 Product Owner Agent analyzing
      Defining investigation scope
   
   🤖 Developer Agent analyzing
      Analyzing logs for technical root cause
   
   🤖 Architect Agent analyzing
      Checking system dependencies
   
   🤖 Security Agent analyzing
      Validating OAuth token policy
   ```

6. **Root Cause Identified**
   ```
   🔍 Root cause identified
      OAuth token expiration - Token was issued 24 hours ago
   ```

7. **Fix Suggested**
   ```
   💡 AI suggested fix generated
      Token Refresh Middleware recommended
   ```

8. **Fix Applied** (When user clicks button)
   ```
   ⚡ AI fix applied
      Enabling Token Refresh Middleware
   ```

9. **Workflow Re-run**
   ```
   🔄 Re-running integration workflow
      Testing with fix applied
   ```

10. **Recovery Success**
    ```
    ✅ Integration recovered successfully
       All services operational
    ```

## Implementation

### Component Files

**[`AIInvestigationTimeline.js`](integration-incident-commander/frontend/src/components/AIInvestigationTimeline.js)**
- React component that renders the timeline
- Maps event types to icons and colors
- Displays timestamp and details for each event

**[`AIInvestigationTimeline.css`](integration-incident-commander/frontend/src/components/AIInvestigationTimeline.css)**
- Vertical timeline styling
- Color-coded event markers
- Pulsing animation for active analysis
- Responsive design

### State Management

**In App.js:**

```javascript
const [investigationEvents, setInvestigationEvents] = useState([]);

const addTimelineEvent = (type, message, details = null) => {
  const event = {
    type,
    message,
    details,
    timestamp: new Date().toISOString()
  };
  setInvestigationEvents(prev => [...prev, event]);
};
```

### Event Tracking

**Workflow Steps** (Lines 73-93):
```javascript
useEffect(() => {
  if (integrationStatus && integrationStatus.steps) {
    integrationStatus.steps.forEach((step) => {
      if (step.success) {
        addTimelineEvent('step_success', `${step.service} completed successfully`);
      } else if (step.success === false) {
        addTimelineEvent('step_failed', `${step.service} failed`, step.error?.message);
      }
    });
  }
}, [integrationStatus]);
```

**Incident Analysis** (Lines 95-125):
```javascript
useEffect(() => {
  if (incident) {
    addTimelineEvent('incident_created', 'Incident created - Starting AI analysis');
    
    if (incident.timeline) {
      incident.timeline.forEach(timelineItem => {
        addTimelineEvent('agent_analyzing', `${timelineItem.agent} analyzing`, timelineItem.action);
      });
    }
    
    if (incident.report && incident.status === 'completed') {
      addTimelineEvent('root_cause', 'Root cause identified', incident.report.rootCause?.description);
      addTimelineEvent('fix_suggested', 'AI suggested fix generated', 'Token Refresh Middleware recommended');
    }
  }
}, [incident]);
```

**Fix Application** (Lines 176-210):
```javascript
const handleApplyFix = async () => {
  addTimelineEvent('fix_applied', 'AI fix applied', 'Enabling Token Refresh Middleware');
  
  const response = await api.applyFixAndRerun();
  
  addTimelineEvent('workflow_rerun', 'Re-running integration workflow', 'Testing with fix applied');
  
  if (status.status === 'success') {
    addTimelineEvent('recovery_success', 'Integration recovered successfully', 'All services operational');
  }
};
```

## UI Placement

The timeline appears between the action buttons and the integration workflow diagram:

```
┌─────────────────────────────────────┐
│ [Trigger Integration Workflow]      │
│ Status: FAILED                       │
├─────────────────────────────────────┤
│ 🔬 AI Investigation Timeline         │
│ ┌─────────────────────────────────┐ │
│ │ 🚀 Integration workflow triggered│ │
│ │ ✓ OrderAPI completed             │ │
│ │ ✗ PaymentService failed          │ │
│ │ 📋 Incident created              │ │
│ │ 🤖 Developer Agent analyzing     │ │
│ │ 🔍 Root cause identified         │ │
│ │ 💡 AI suggested fix generated    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Integration Workflow                 │
│ (Detailed step visualization)        │
└─────────────────────────────────────┘
```

## Visual Design

### Timeline Structure

```
┌─────────────────────────────────────┐
│ 🔬 AI Investigation Timeline  8 events│
├─────────────────────────────────────┤
│                                      │
│  ●─── Integration workflow triggered │
│  │    10:23:20 AM                    │
│  │    Starting Order → Payment flow  │
│  │                                   │
│  ●─── OrderAPI completed successfully│
│  │    10:23:21 AM                    │
│  │                                   │
│  ●─── PaymentService failed          │
│       10:23:22 AM                    │
│       Authentication token expired   │
│                                      │
└─────────────────────────────────────┘
```

### Color Coding

- **Green**: Success events (✓, ✅)
- **Red**: Failure events (✗)
- **Blue**: Analysis events (🤖) - with pulsing animation
- **Yellow**: Fix events (💡, ⚡)
- **Gray**: Info events (🚀, 📋, 🔍, 🔄)

### Animations

**Pulsing Effect** for active analysis:
```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
  }
}
```

## Benefits

### For Users

1. **Visibility**: See exactly what's happening at each step
2. **Understanding**: Learn how AI agents work together
3. **Confidence**: Trust the AI's analysis process
4. **Debugging**: Identify where issues occur

### For Demos

1. **Engagement**: Visual storytelling of AI capabilities
2. **Clarity**: Easy to follow narrative
3. **Professional**: Polished, modern UI
4. **Impressive**: Shows sophisticated AI orchestration

### For Development

1. **Debugging**: Track event sequence
2. **Testing**: Verify all events fire correctly
3. **Audit**: Complete record of actions
4. **Monitoring**: Real-time visibility

## State Reset

When "Trigger Integration Workflow" is clicked, the timeline is cleared:

```javascript
const handleTriggerIntegration = async () => {
  setInvestigationEvents([]);  // Clear timeline
  // ... rest of trigger logic
};
```

This ensures each workflow run has its own clean timeline.

## Future Enhancements

1. **Export Timeline**: Download as JSON or PDF
2. **Filter Events**: Show/hide specific event types
3. **Search**: Find specific events in long timelines
4. **Timestamps**: Show relative time (e.g., "2 seconds ago")
5. **Expand/Collapse**: Collapsible detail sections
6. **Real-time Updates**: WebSocket for live updates
7. **Event Grouping**: Group related events together
8. **Performance Metrics**: Show duration between events

## Summary

The AI Investigation Timeline provides a comprehensive, visual narrative of the entire integration workflow and AI analysis process. It enhances transparency, aids debugging, and creates an engaging demo experience by showing exactly how the AI system investigates and resolves integration failures.

**Key Features:**
- ✅ Chronological event tracking
- ✅ Color-coded event types
- ✅ Detailed event information
- ✅ Clean vertical timeline design
- ✅ Pulsing animation for active analysis
- ✅ Automatic event detection
- ✅ State reset on new workflow
- ✅ Responsive design