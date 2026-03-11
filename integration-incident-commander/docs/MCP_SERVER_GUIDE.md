# MCP Server Configuration and Usage Guide

## Overview

This guide explains how to configure and use MCP (Model Context Protocol) servers with the Integration Incident Commander multi-agent workflow.

## What are MCP Servers?

MCP servers provide AI agents with access to external tools and data sources through a standardized protocol. They enable:

- **File Operations:** Read, write, search files
- **Version Control:** Git operations and history
- **API Integration:** External service access
- **Database Queries:** Data retrieval and analysis
- **Tool Execution:** Custom command execution

## Required MCP Servers

### 1. Filesystem MCP Server (Required)

**Purpose:** Provides file system access for reading logs, code, and generating reports.

#### Configuration

**Bob Settings Location:**
```
Settings > MCP Servers > Add Server
```

**Server Configuration:**
```json
{
  "name": "filesystem",
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "c:/wmio_builds/11.2.4/wm-integration-cloud/integration-incident-commander"],
  "env": {}
}
```

#### Available Operations

| Operation | Purpose | Example |
|-----------|---------|---------|
| `read_file` | Read file contents | Read incident logs |
| `write_file` | Create/update files | Generate reports |
| `search_files` | Search file contents | Find error patterns |
| `list_files` | List directory contents | Discover structure |
| `get_file_info` | Get file metadata | Check timestamps |

#### Usage Examples

**Read Incident Log:**
```
Using Filesystem MCP, read the integration log file at:
backend/logs/integration.log
```

**Search for Errors:**
```
Using Filesystem MCP, search for "401 Unauthorized" pattern in:
backend/ directory (recursive)
```

**Generate Report:**
```
Using Filesystem MCP, write incident summary to:
docs/incidents/INC-001-summary.md
```

#### Evidence to Capture

1. **Screenshot:** Filesystem MCP server configuration in Bob settings
2. **Screenshot:** File read operation showing log contents
3. **Screenshot:** Search results for error patterns
4. **Screenshot:** Generated document in file explorer
5. **Log Export:** MCP operation log showing all file operations

---

### 2. Git MCP Server (Required)

**Purpose:** Provides version control access for analyzing code changes and history.

#### Configuration

**Bob Settings Location:**
```
Settings > MCP Servers > Add Server
```

**Server Configuration:**
```json
{
  "name": "git",
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-git", "c:/wmio_builds/11.2.4/wm-integration-cloud/integration-incident-commander"],
  "env": {}
}
```

#### Available Operations

| Operation | Purpose | Example |
|-----------|---------|---------|
| `git_log` | View commit history | Recent changes to service |
| `git_diff` | Compare versions | See what changed |
| `git_blame` | Find code author | Who wrote this code |
| `git_status` | Check repo state | Uncommitted changes |
| `git_show` | Show commit details | Full commit info |

#### Usage Examples

**View Recent Changes:**
```
Using Git MCP, show the last 10 commits for:
backend/services/paymentService.js
```

**Compare Versions:**
```
Using Git MCP, show diff between HEAD~5 and HEAD for:
backend/services/ directory
```

**Find Code Owner:**
```
Using Git MCP, show blame information for:
backend/services/paymentService.js line 45
```

#### Evidence to Capture

1. **Screenshot:** Git MCP server configuration in Bob settings
2. **Screenshot:** Git log output showing recent commits
3. **Screenshot:** Git diff showing code changes
4. **Screenshot:** Git blame showing code ownership
5. **Log Export:** Git operation history

---

## Optional MCP Servers

### 3. GitHub MCP Server (Optional)

**Purpose:** Issue tracking and pull request management.

#### Configuration

```json
{
  "name": "github",
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_TOKEN": "your_github_token_here"
  }
}
```

#### Operations

- Create issues for incidents
- Link PRs to incidents
- Update issue status
- Add investigation comments

---

### 4. Slack MCP Server (Optional)

**Purpose:** Team communication and notifications.

#### Configuration

```json
{
  "name": "slack",
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": {
    "SLACK_TOKEN": "your_slack_token_here"
  }
}
```

#### Operations

- Send incident notifications
- Post investigation updates
- Share resolution status
- Alert stakeholders

---

## MCP Server Setup Instructions

### Step 1: Install Node.js and npm

```bash
# Verify installation
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
```

### Step 2: Configure Filesystem MCP Server

1. Open Bob IDE
2. Go to **Settings** > **MCP Servers**
3. Click **Add Server**
4. Enter configuration:
   - **Name:** filesystem
   - **Type:** stdio
   - **Command:** npx
   - **Args:** `-y @modelcontextprotocol/server-filesystem c:/wmio_builds/11.2.4/wm-integration-cloud/integration-incident-commander`
5. Click **Save**
6. Verify connection (green indicator)

### Step 3: Configure Git MCP Server

1. In Bob IDE, go to **Settings** > **MCP Servers**
2. Click **Add Server**
3. Enter configuration:
   - **Name:** git
   - **Type:** stdio
   - **Command:** npx
   - **Args:** `-y @modelcontextprotocol/server-git c:/wmio_builds/11.2.4/wm-integration-cloud/integration-incident-commander`
4. Click **Save**
5. Verify connection (green indicator)

### Step 4: Test MCP Servers

**Test Filesystem MCP:**
```
In Bob, ask: "Using Filesystem MCP, list files in the backend/logs directory"
```

**Test Git MCP:**
```
In Bob, ask: "Using Git MCP, show the last 5 commits"
```

---

## MCP Operations by Phase

### Phase 1: Product Owner (Incident Intake)

**Filesystem MCP Operations:**
```
1. read_file: backend/logs/integration.log
2. read_file: backend/logs/audit.log
3. write_file: docs/incidents/INC-001-summary.md
```

**Expected Output:**
- Incident log contents
- Audit trail data
- Generated summary document

---

### Phase 2: Developer (Technical Investigation)

**Filesystem MCP Operations:**
```
1. read_file: backend/services/integrationService.js
2. search_files: pattern="401|Unauthorized", path="backend/"
3. read_file: backend/services/paymentService.js
4. write_file: docs/incidents/INC-001-technical-analysis.md
```

**Git MCP Operations:**
```
1. git_log: path="backend/services/paymentService.js", limit=10
2. git_diff: commit1="HEAD~5", commit2="HEAD"
3. git_blame: path="backend/services/paymentService.js", line=45
```

**Expected Output:**
- Service code contents
- Error pattern matches
- Recent commit history
- Code change diffs
- Technical analysis document

---

### Phase 3: Architect (Impact Assessment)

**Filesystem MCP Operations:**
```
1. read_file: docs/ARCHITECTURE.md
2. list_files: path="backend/services/", recursive=true
3. search_files: pattern="paymentService", path="backend/"
4. write_file: docs/incidents/INC-001-impact-assessment.md
```

**Expected Output:**
- Architecture documentation
- Service file list
- Dependency references
- Impact assessment document

---

### Phase 4: Security (Compliance Validation)

**Filesystem MCP Operations:**
```
1. read_file: backend/logs/audit.log
2. search_files: pattern="authentication|authorization", path="backend/"
3. read_file: backend/middleware/authMiddleware.js
4. read_file: docs/COMPLIANCE_MAPPING.md
5. write_file: docs/incidents/INC-001-security-report.md
```

**Expected Output:**
- Audit log entries
- Security pattern matches
- Authentication code
- Compliance documentation
- Security report document

---

### Phase 5: Product Owner (Final Resolution)

**Filesystem MCP Operations:**
```
1. read_file: docs/incidents/INC-001-technical-analysis.md
2. read_file: docs/incidents/INC-001-impact-assessment.md
3. read_file: docs/incidents/INC-001-security-report.md
4. write_file: docs/incidents/INC-001-final-report.md
5. write_file: docs/incidents/INC-001-status-update.md
```

**Expected Output:**
- All agent findings
- Consolidated final report
- Stakeholder status update

---

## Evidence Collection Template

### MCP Server Evidence Package

Create a folder: `evidence/mcp-operations/`

#### Required Evidence Files

1. **mcp-config-screenshots/**
   - `filesystem-mcp-config.png` - Server configuration
   - `git-mcp-config.png` - Server configuration
   - `mcp-connection-status.png` - Both servers connected

2. **filesystem-operations/**
   - `read-integration-log.png` - Reading log file
   - `search-error-patterns.png` - Search results
   - `write-incident-summary.png` - Document generation
   - `list-services.png` - Directory listing

3. **git-operations/**
   - `git-log-output.png` - Commit history
   - `git-diff-output.png` - Code changes
   - `git-blame-output.png` - Code ownership

4. **operation-logs/**
   - `filesystem-operations.log` - All file operations
   - `git-operations.log` - All git operations
   - `mcp-timestamps.log` - Operation timing

5. **generated-documents/**
   - All 6 incident documents (INC-001-*.md)
   - Timestamps showing creation order

---

## Troubleshooting

### MCP Server Not Connecting

**Symptom:** Red indicator in Bob settings

**Solutions:**
1. Verify Node.js and npm are installed
2. Check command path is correct
3. Ensure working directory exists
4. Restart Bob IDE
5. Check Bob logs for errors

**Test Command:**
```bash
# Test Filesystem MCP manually
npx -y @modelcontextprotocol/server-filesystem c:/wmio_builds/11.2.4/wm-integration-cloud/integration-incident-commander

# Test Git MCP manually
npx -y @modelcontextprotocol/server-git c:/wmio_builds/11.2.4/wm-integration-cloud/integration-incident-commander
```

---

### Operation Timeout

**Symptom:** MCP operation takes too long

**Solutions:**
1. Check file size (large files take longer)
2. Reduce search scope
3. Use specific file paths
4. Increase timeout in Bob settings

---

### Permission Denied

**Symptom:** Cannot read/write files

**Solutions:**
1. Check file permissions
2. Verify working directory access
3. Run Bob with appropriate permissions
4. Check antivirus blocking

---

### Git Operations Failing

**Symptom:** Git MCP returns errors

**Solutions:**
1. Verify Git is installed: `git --version`
2. Check repository is initialized
3. Ensure .git directory exists
4. Verify Git configuration

---

## Best Practices

### 1. Operation Sequencing
- Read before write
- Search before detailed read
- Validate before commit

### 2. Error Handling
- Check operation success
- Capture error messages
- Retry on transient failures

### 3. Evidence Collection
- Screenshot every operation
- Export operation logs
- Save timestamps
- Document context

### 4. Performance
- Use specific paths
- Limit search scope
- Cache read results
- Batch operations

### 5. Security
- Don't expose tokens in screenshots
- Sanitize sensitive data
- Use secure connections
- Audit all operations

---

## MCP Operation Checklist

### Pre-Workflow
- [ ] Filesystem MCP configured and connected
- [ ] Git MCP configured and connected
- [ ] Test operations successful
- [ ] Evidence folder created
- [ ] Screenshot tool ready

### During Workflow
- [ ] Screenshot each MCP operation
- [ ] Verify operation success
- [ ] Save operation output
- [ ] Document operation context
- [ ] Export operation logs

### Post-Workflow
- [ ] Compile all screenshots
- [ ] Export MCP logs
- [ ] Verify all documents generated
- [ ] Archive evidence package
- [ ] Document lessons learned

---

## Support Resources

### MCP Documentation
- Official MCP Protocol: https://modelcontextprotocol.io
- Filesystem Server: https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
- Git Server: https://github.com/modelcontextprotocol/servers/tree/main/src/git

### Bob IDE Support
- Bob Documentation: Check Bob help menu
- MCP Settings: Settings > MCP Servers
- Operation Logs: View > Output > Bob MCP

### Project Documentation
- Workflow Guide: [`CHALLENGE_4_MULTI_AGENT_DELIVERY.md`](./CHALLENGE_4_MULTI_AGENT_DELIVERY.md)
- Quick Start: [`CHALLENGE_4_QUICK_START.md`](./CHALLENGE_4_QUICK_START.md)
- Architecture: [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## Summary

**MCP Servers Enable:**
- ✅ Automated file operations
- ✅ Version control integration
- ✅ Evidence collection
- ✅ Repeatable workflows
- ✅ Audit trail generation

**Required for Challenge 4:**
- ✅ Filesystem MCP (file operations)
- ✅ Git MCP (version control)
- ✅ Minimum 2 servers used
- ✅ Evidence captured for each
- ✅ Operations documented

**Success Metrics:**
- All MCP operations successful
- Evidence package complete
- Workflow repeatable
- Documentation comprehensive