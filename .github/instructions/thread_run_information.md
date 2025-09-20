# Thread Run Endpoints Usage Examples

This document provides examples of how to use the thread run creation and monitoring endpoints.

## Endpoint Overview

### Create Run
**POST** `/api/projects/{projectId}/threads/{threadId}/runs`

Creates a new run to continue a conversation thread with the project's assistant.

### Monitor Run Status  
**GET** `/api/projects/{projectId}/threads/{threadId}/runs/{runId}`

Checks the current status and details of a specific run.

## Authentication
Both endpoints require a valid JWT token with access to the specified project.

## Run Creation

### Request Body

```json
{
  "message": "Your question or message to the assistant",
  "instructions": "Optional specific instructions for this run (up to 2000 characters)"
}
```

### Example Usage

#### 1. Basic Thread Run Creation

```bash
curl -X POST "https://api.agilemantis.com/api/projects/123e4567-e89b-12d3-a456-426614174000/threads/thread_abc123/runs" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can you help me understand the authentication flow in this project?"
  }'
```

#### 2. Thread Run with Custom Instructions

```bash
curl -X POST "https://api.agilemantis.com/api/projects/123e4567-e89b-12d3-a456-426614174000/threads/thread_abc123/runs" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain the database schema for users and teams",
    "instructions": "Focus on the relationships between entities and provide specific code examples from the uploaded documents."
  }'
```

## Run Status Monitoring

### Check Run Status

```bash
curl -X GET "https://api.agilemantis.com/api/projects/123e4567-e89b-12d3-a456-426614174000/threads/thread_abc123/runs/run_def456789" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Complete Workflow Example

Here's how to create a run and monitor it until completion:

```javascript
async function createAndMonitorRun(projectId, threadId, message) {
  const baseUrl = 'https://api.agilemantis.com/api/projects';
  const headers = {
    'Authorization': `Bearer ${yourToken}`,
    'Content-Type': 'application/json'
  };

  try {
    // Step 1: Create the run
    console.log('🚀 Creating run...');
    const createResponse = await fetch(`${baseUrl}/${projectId}/threads/${threadId}/runs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        message,
        instructions: "Provide detailed explanations with code examples where applicable."
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create run: ${createResponse.status}`);
    }

    const runData = await createResponse.json();
    console.log(`✅ Run created: ${runData.runId}`);
    console.log(`📊 Initial status: ${runData.status}`);

    // Step 2: Monitor the run until completion
    const finalStatus = await monitorRunProgress(projectId, threadId, runData.runId, headers);
    
    return {
      ...runData,
      finalStatus
    };

  } catch (error) {
    console.error('❌ Error in run workflow:', error.message);
    throw error;
  }
}

async function monitorRunProgress(projectId, threadId, runId, headers) {
  const baseUrl = 'https://api.agilemantis.com/api/projects';
  const maxAttempts = 30; // Maximum polling attempts
  const pollInterval = 2000; // 2 seconds between checks

  console.log(`🔄 Monitoring run ${runId}...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `${baseUrl}/${projectId}/threads/${threadId}/runs/${runId}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`Failed to get run status: ${response.status}`);
      }

      const runStatus = await response.json();
      console.log(`📊 Attempt ${attempt}: Status = ${runStatus.status}`);

      // Check if run is complete
      switch (runStatus.status.toLowerCase()) {
        case 'completed':
          console.log('✅ Run completed successfully!');
          console.log(`⏱️  Total time: ${new Date(runStatus.completedAt) - new Date(runStatus.createdAt)}ms`);
          return runStatus;

        case 'failed':
          console.log('❌ Run failed!');
          throw new Error(`Run failed: ${runStatus.errorMessage || 'Unknown error'}`);

        case 'expired':
          console.log('⏰ Run expired!');
          throw new Error('Run expired before completion');

        case 'queued':
        case 'in_progress':
          // Continue polling
          console.log(`⏳ Run ${runStatus.status}, waiting...`);
          break;

        default:
          console.log(`❓ Unknown status: ${runStatus.status}`);
      }

      // Wait before next poll (except on last attempt)
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }

    } catch (error) {
      console.error(`❌ Error checking run status (attempt ${attempt}):`, error.message);
      
      // Continue polling unless it's the last attempt
      if (attempt === maxAttempts) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }

  throw new Error(`Run monitoring timed out after ${maxAttempts} attempts`);
}

// Usage Example
async function exampleUsage() {
  try {
    const result = await createAndMonitorRun(
      '123e4567-e89b-12d3-a456-426614174000',
      'thread_abc123',
      'What are the best practices for error handling in this codebase?'
    );

    console.log('🎉 Workflow completed!');
    console.log('Final run data:', {
      runId: result.runId,
      status: result.finalStatus.status,
      createdAt: result.createdAt,
      completedAt: result.finalStatus.completedAt
    });

    // Now you can fetch the assistant's response from the thread messages
    // using GET /api/projects/{projectId}/threads/{threadId}

  } catch (error) {
    console.error('💥 Workflow failed:', error.message);
  }
}

// Run the example
exampleUsage();
```

## Response Structures

### Create Run Response (201 Created)

```json
{
  "runId": "run_def456789",
  "threadId": "thread_abc123", 
  "status": "queued",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "startedAt": null,
  "completedAt": null,
  "assistantId": "asst_xyz789",
  "projectId": "123e4567-e89b-12d3-a456-426614174000",
  "instructions": "Focus on the relationships between entities and provide specific code examples from the uploaded documents.",
  "userMessage": "Explain the database schema for users and teams"
}
```

### Get Run Status Response (200 OK)

```json
{
  "runId": "run_def456789",
  "threadId": "thread_abc123",
  "status": "completed",
  "createdAt": "2024-01-15T10:30:00.000Z", 
  "startedAt": "2024-01-15T10:30:02.000Z",
  "completedAt": "2024-01-15T10:32:15.000Z",
  "assistantId": "asst_xyz789",
  "projectId": "123e4567-e89b-12d3-a456-426614174000",
  "instructions": null,
  "userMessage": null
}
```

### Run Status Values

- **`"queued"`** - Run is waiting to start
- **`"in_progress"`** - Run is currently executing  
- **`"completed"`** - Run finished successfully
- **`"failed"`** - Run encountered an error
- **`"expired"`** - Run timed out

## Error Responses

### 400 Bad Request
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Message": ["The Message field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied to project"
}
```

### 404 Not Found
```json
{
  "message": "Thread not found"
}
```
*or*
```json
{
  "message": "Run not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "An error occurred while creating the thread run"
}
```
*or*
```json
{
  "message": "An error occurred while checking the run status"
}
```

## Best Practices

### 1. Polling Strategy
- Poll every 2-3 seconds for run status updates
- Set a maximum timeout (e.g., 60 seconds)
- Handle network errors gracefully with retries

### 2. Error Handling
```javascript
function handleRunError(status, runData) {
  switch (status) {
    case 'failed':
      console.error('Run failed:', runData.errorMessage);
      // Handle failure - maybe retry or show user error
      break;
    case 'expired':
      console.warn('Run timed out');
      // Handle timeout - maybe retry with shorter request
      break;
    default:
      console.error('Unknown run status:', status);
  }
}
```

### 3. User Experience
```javascript
function updateRunProgress(status, runData) {
  const messages = {
    'queued': '⏳ Your request is queued...',
    'in_progress': '🤖 Assistant is processing your request...',
    'completed': '✅ Response ready!',
    'failed': '❌ Something went wrong',
    'expired': '⏰ Request timed out'
  };
  
  updateUI(messages[status] || 'Unknown status');
}
```

### 4. Resource Cleanup
Always clean up polling intervals and abort ongoing requests when components unmount or users navigate away.

## Integration Tips

### With React/Vue/Angular
```javascript
// React hook example
function useRunMonitoring(projectId, threadId) {
  const [runData, setRunData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createRun = async (message, instructions) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createAndMonitorRun(projectId, threadId, message);
      setRunData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { runData, isLoading, error, createRun };
}
```

### Next Steps After Run Completion

Once a run completes successfully:

1. **Fetch Updated Thread Messages**
   ```bash
   GET /api/projects/{projectId}/threads/{threadId}
   ```

2. **Display Assistant Response**
   The assistant's response will be the latest message in the thread with `role: "assistant"`

3. **Continue Conversation**
   Create a new run with the user's next message to continue the conversation

The `runId` from the response is your key to tracking and managing the conversation flow!

## Response Structure

### Success Response (200 OK)

```json
{
  "runId": "run_def456789",
  "threadId": "thread_abc123",
  "status": "queued",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "startedAt": null,
  "completedAt": null,
  "assistantId": "asst_xyz789",
  "projectId": "123e4567-e89b-12d3-a456-426614174000",
  "instructions": "Focus on the relationships between entities and provide specific code examples from the uploaded documents.",
  "userMessage": "Explain the database schema for users and teams"
}
```

### Using the Response Data

The response provides essential information about the created run:

#### Key Fields Explained

- **`runId`**: Unique identifier for this run - use this to track run status or retrieve results
- **`threadId`**: Confirms which thread this run belongs to
- **`status`**: Current run status - can be:
  - `"queued"` - Run is waiting to start
  - `"in_progress"` - Run is currently executing
  - `"completed"` - Run finished successfully
  - `"failed"` - Run encountered an error
  - `"expired"` - Run timed out
- **`createdAt`**: When the run was created
- **`startedAt`**: When the run actually began processing (null if not started yet)
- **`completedAt`**: When the run finished (null if not completed yet)
- **`assistantId`**: The Azure OpenAI assistant handling this run
- **`projectId`**: The project this run belongs to
- **`instructions`**: The instructions provided to the assistant
- **`userMessage`**: The user message that was added to the thread

#### Example: Monitoring Run Progress

```javascript
// After creating a run, you can monitor its progress
async function createAndMonitorRun(projectId, threadId, message) {
  // Step 1: Create the run
  const response = await fetch(`/api/projects/${projectId}/threads/${threadId}/runs`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + yourToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });
  
  const runData = await response.json();
  console.log('Run created:', runData.runId);
  console.log('Initial status:', runData.status);
  
  // Step 2: Use the runId for further operations
  return {
    runId: runData.runId,
    threadId: runData.threadId,
    status: runData.status,
    createdAt: new Date(runData.createdAt)
  };
}
```

#### Example: Displaying Run Information

```javascript
function displayRunInfo(runResponse) {
  console.log(`
    🤖 Assistant Run Created
    ────────────────────────
    Run ID: ${runResponse.runId}
    Thread: ${runResponse.threadId}
    Status: ${runResponse.status.toUpperCase()}
    
    📝 Message: "${runResponse.userMessage}"
    ${runResponse.instructions ? `🎯 Instructions: "${runResponse.instructions}"` : ''}
    
    ⏰ Created: ${new Date(runResponse.createdAt).toLocaleString()}
    ${runResponse.startedAt ? `🚀 Started: ${new Date(runResponse.startedAt).toLocaleString()}` : '⏳ Not started yet'}
    ${runResponse.completedAt ? `✅ Completed: ${new Date(runResponse.completedAt).toLocaleString()}` : ''}
  `);
}
```

## Error Responses

### 400 Bad Request
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Message": ["The Message field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied to project"
}
```

### 404 Not Found
```json
{
  "message": "Thread not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Failed to create thread run",
  "details": "Error details here"
}
```

## Integration Flow

### Typical Usage Pattern

1. **Get existing thread** (or create a new one via chat endpoint)
2. **Create a run** using this endpoint to continue the conversation
3. **Monitor the run status** (you may need additional endpoints for this)
4. **Retrieve the assistant's response** (typically through thread messages endpoint)

### Complete Example Workflow

```javascript
async function continueConversation(projectId, threadId, userMessage) {
  try {
    // Create a run to continue the thread
    const runResponse = await fetch(`/api/projects/${projectId}/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${yourToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        instructions: "Provide detailed explanations with code examples where applicable."
      })
    });

    if (!runResponse.ok) {
      throw new Error(`HTTP ${runResponse.status}: ${runResponse.statusText}`);
    }

    const runData = await runResponse.json();
    
    // Display run information
    console.log('✅ Run created successfully!');
    console.log('Run ID:', runData.runId);
    console.log('Status:', runData.status);
    console.log('User message:', runData.userMessage);
    
    // You can now use runData.runId to:
    // - Check run status periodically
    // - Retrieve the assistant's response when completed
    // - Cancel the run if needed
    
    return runData;
    
  } catch (error) {
    console.error('❌ Failed to create run:', error.message);
    throw error;
  }
}

// Usage
continueConversation(
  '123e4567-e89b-12d3-a456-426614174000',
  'thread_abc123',
  'What are the best practices for error handling in this codebase?'
).then(runData => {
  console.log('Run created with ID:', runData.runId);
}).catch(console.error);
```

## Next Steps

After creating a run, you typically want to:

1. **Poll for completion** - Check the run status periodically
2. **Retrieve messages** - Get the assistant's response using the thread messages endpoint
3. **Handle errors** - Check for failed runs and handle appropriately

The `runId` from the response is your key to tracking and managing the conversation flow.