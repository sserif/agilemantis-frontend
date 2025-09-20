import { RunRequest, RunResponse, RunStatus } from '../types/project';
import { apiClient } from './client';

/**
 * API service for managing thread runs
 */
export const runsApi = {
  /**
   * Create a new run to continue a conversation thread
   * @param teamId Team ID
   * @param projectId Project ID
   * @param threadId Thread ID
   * @param request Run request with message and optional instructions
   * @returns Promise<RunResponse>
   */
  createRun: async (teamId: string, projectId: string, threadId: string, request: RunRequest): Promise<RunResponse> => {
    try {
      const url = `/teams/${teamId}/projects/${projectId}/threads/${threadId}/runs`;
      const response: any = await apiClient.post(url, request);

      // Handle response structure - data might be in response.data or response directly
      let responseData;
      if (response.data && response.data.runId) {
        responseData = response.data;
      } else if (response.runId) {
        responseData = response;
      } else {
        throw new Error('Invalid response format: missing runId');
      }

      return responseData as RunResponse;
    } catch (error: any) {
      console.error('Error creating thread run:', error);
      
      if (error.response) {
        const status = error.response.status;
        
        switch (status) {
          case 400:
            throw new Error('Invalid request: ' + (error.response.data?.message || 'Bad request'));
          case 401:
            throw new Error('You must be logged in to create runs');
          case 403:
            throw new Error('You do not have permission to create runs in this thread');
          case 404:
            throw new Error('Thread not found or you do not have access to it');
          default:
            throw new Error(`Failed to create run: ${error.response.data?.message || error.message}`);
        }
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to the server');
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  },

  /**
   * Get the status and details of a specific thread run
   * @param teamId Team ID
   * @param projectId Project ID
   * @param threadId Thread ID
   * @param runId Run ID
   * @returns Promise<RunResponse>
   */
  getRunStatus: async (teamId: string, projectId: string, threadId: string, runId: string): Promise<RunResponse> => {
    try {
      const url = `/teams/${teamId}/projects/${projectId}/threads/${threadId}/runs/${runId}`;
      const response: any = await apiClient.get(url);

      // Handle response structure - data might be in response.data or response directly
      let responseData;
      if (response.data && response.data.runId) {
        responseData = response.data;
      } else if (response.runId) {
        responseData = response;
      } else {
        throw new Error('Invalid response format: missing runId');
      }

      return responseData as RunResponse;
    } catch (error: any) {
      console.error('Error getting run status:', error);
      
      if (error.response) {
        const status = error.response.status;
        
        switch (status) {
          case 404:
            throw new Error('Run not found or you do not have access to it');
          case 403:
            throw new Error('You do not have permission to view this run');
          case 400:
            throw new Error('Invalid run ID or request parameters');
          default:
            throw new Error(`Failed to get run status: ${error.response.data?.message || error.message}`);
        }
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to the server');
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  },

  /**
   * Monitor a run until completion with polling
   * @param teamId Team ID
   * @param projectId Project ID
   * @param threadId Thread ID
   * @param runId Run ID
   * @param options Polling options
   * @returns Promise<RunResponse>
   */
  monitorRun: async (
    teamId: string, 
    projectId: string, 
    threadId: string, 
    runId: string,
    options: {
      maxAttempts?: number;
      pollInterval?: number;
      onStatusUpdate?: (status: RunStatus, runData: RunResponse) => void;
    } = {}
  ): Promise<RunResponse> => {
    const { 
      maxAttempts = 30, 
      pollInterval = 2000, 
      onStatusUpdate 
    } = options;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const runData = await runsApi.getRunStatus(teamId, projectId, threadId, runId);
        
        // Call status update callback if provided
        if (onStatusUpdate) {
          onStatusUpdate(runData.status, runData);
        }

        // Check if run is complete
        switch (runData.status) {
          case 'completed':
            return runData;

          case 'failed':
            throw new Error(`Run failed: ${runData.status}`);

          case 'expired':
            throw new Error('Run expired before completion');

          case 'queued':
          case 'in_progress':
            // Continue polling
            break;

          default:
            console.warn(`Unknown run status: ${runData.status}`);
        }

        // Wait before next poll (except on last attempt)
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }

      } catch (error: any) {
        // If it's the last attempt or a non-network error, throw
        if (attempt === maxAttempts || !error.message.includes('Network error')) {
          throw error;
        }
        
        // For network errors, wait and retry
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }

    throw new Error(`Run monitoring timed out after ${maxAttempts} attempts`);
  },

  /**
   * Create a run and monitor it until completion
   * @param teamId Team ID
   * @param projectId Project ID
   * @param threadId Thread ID
   * @param request Run request
   * @param monitorOptions Monitoring options
   * @returns Promise<RunResponse>
   */
  createAndMonitorRun: async (
    teamId: string,
    projectId: string,
    threadId: string,
    request: RunRequest,
    monitorOptions?: {
      maxAttempts?: number;
      pollInterval?: number;
      onStatusUpdate?: (status: RunStatus, runData: RunResponse) => void;
    }
  ): Promise<RunResponse> => {
    // Create the run
    const runData = await runsApi.createRun(teamId, projectId, threadId, request);
    
    // Monitor until completion
    return runsApi.monitorRun(teamId, projectId, threadId, runData.runId, monitorOptions);
  }
};

export default runsApi;