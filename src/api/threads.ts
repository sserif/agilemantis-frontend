import { ThreadListResponse, ThreadListRequest, ThreadDetailResponse } from '../types/project';
import { apiClient } from './client';

/**
 * API service for managing project threads
 */
export const threadsApi = {
  /**
   * Get project threads with cursor-based pagination
   * @param request Thread list request parameters
   * @returns Promise<ThreadListResponse>
   */
  getProjectThreads: async (request: ThreadListRequest): Promise<ThreadListResponse> => {
    try {
      const params = new URLSearchParams();
      
      // Add query parameters
      if (request.limit) params.append('limit', request.limit.toString());
      if (request.order) params.append('order', request.order);
      if (request.after) params.append('after', request.after);
      if (request.before) params.append('before', request.before);

      const queryString = params.toString();
      const url = `/teams/${request.teamId}/projects/${request.projectId}/threads${queryString ? '?' + queryString : ''}`;

      const response: any = await apiClient.get(url);

      // Handle response structure - data might be in response.data or response directly
      let responseData;
      if (response.data && response.data.threads) {
        responseData = response.data;
      } else if (response.threads) {
        responseData = response;
      } else {
        throw new Error('Invalid response format: no threads array found');
      }

      return responseData as ThreadListResponse;
    } catch (error: any) {
      console.error('Error fetching project threads:', error);
      
      if (error.response) {
        const status = error.response.status;
        
        switch (status) {
          case 404:
            throw new Error('Project not found or you do not have access to it');
          case 403:
            throw new Error('You do not have permission to view threads for this project');
          case 400:
            throw new Error('Invalid request parameters');
          default:
            throw new Error(`Failed to fetch threads: ${error.response.data?.message || error.message}`);
        }
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to the server');
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  },

  /**
   * Get the first page of threads for a project (most recent)
   * @param teamId Team ID
   * @param projectId Project ID
   * @param limit Number of threads to fetch (default: 20)
   * @returns Promise<ThreadListResponse>
   */
  getInitialThreads: async (teamId: string, projectId: string, limit: number = 20): Promise<ThreadListResponse> => {
    return threadsApi.getProjectThreads({
      teamId,
      projectId,
      limit,
      order: 'desc' // Most recent first
    });
  },

  /**
   * Get the next page of threads using cursor pagination
   * @param teamId Team ID
   * @param projectId Project ID
   * @param cursor Next cursor from previous response
   * @param limit Number of threads to fetch (default: 20)
   * @returns Promise<ThreadListResponse>
   */
  getNextThreads: async (teamId: string, projectId: string, cursor: string, limit: number = 20): Promise<ThreadListResponse> => {
    return threadsApi.getProjectThreads({
      teamId,
      projectId,
      limit,
      order: 'desc',
      after: cursor
    });
  },

  /**
   * Get the previous page of threads using cursor pagination
   * @param teamId Team ID
   * @param projectId Project ID
   * @param cursor Previous cursor from previous response
   * @param limit Number of threads to fetch (default: 20)
   * @returns Promise<ThreadListResponse>
   */
  getPreviousThreads: async (teamId: string, projectId: string, cursor: string, limit: number = 20): Promise<ThreadListResponse> => {
    return threadsApi.getProjectThreads({
      teamId,
      projectId,
      limit,
      order: 'desc',
      before: cursor
    });
  },

  /**
   * Get thread details with all messages
   * @param teamId Team ID
   * @param projectId Project ID
   * @param threadId Thread ID
   * @returns Promise<ThreadDetailResponse>
   */
  getThreadDetails: async (teamId: string, projectId: string, threadId: string): Promise<ThreadDetailResponse> => {
    try {
      const url = `/teams/${teamId}/projects/${projectId}/threads/${threadId}`;
      const response: any = await apiClient.get(url);

      // Handle response structure - data might be in response.data or response directly
      let responseData;
      if (response.data && response.data.thread && response.data.messages) {
        responseData = response.data;
      } else if (response.thread && response.messages) {
        responseData = response;
      } else {
        throw new Error('Invalid response format: missing thread or messages data');
      }

      return responseData as ThreadDetailResponse;
    } catch (error: any) {
      console.error('Error fetching thread details:', error);
      
      if (error.response) {
        const status = error.response.status;
        
        switch (status) {
          case 404:
            throw new Error('Thread not found or you do not have access to it');
          case 403:
            throw new Error('You do not have permission to view this thread');
          case 400:
            throw new Error('Invalid thread ID or request parameters');
          default:
            throw new Error(`Failed to fetch thread details: ${error.response.data?.message || error.message}`);
        }
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to the server');
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }
};

export default threadsApi;