import { apiClient } from './client';
import { ChatRequest, ChatResponse } from '../types/chat';

export const chatApi = {
  /**
   * Send a message to the project's AI assistant
   * @param teamId - The team ID
   * @param projectId - The project ID
   * @param request - The chat request with message and optional threadId
   * @returns Promise<ChatResponse> - The AI assistant's response
   */
  async sendMessage(
    teamId: string, 
    projectId: string, 
    request: ChatRequest
  ): Promise<ChatResponse> {
    try {
      const url = `/Teams/${teamId}/Projects/${projectId}/Chat`;
      console.log('Sending chat message:', { 
        teamId, 
        projectId, 
        request, 
        url,
        fullUrl: `${apiClient.getBaseURL()}${url}`
      });
      
      const response = await apiClient.post<any>(url, request);
      
      console.log('Full API response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'null');
      
      // The ApiClient should return an ApiResponse<T> object with a data property
      // But if that's not happening, we need to handle it differently
      let chatResponse: ChatResponse;
      
      if (response && response.data) {
        // Standard ApiResponse structure
        chatResponse = response.data;
        console.log('Using response.data:', chatResponse);
      } else if (response && typeof response === 'object' && (response as any).response) {
        // Direct response without ApiResponse wrapper
        chatResponse = response as unknown as ChatResponse;
        console.log('Using direct response:', chatResponse);
      } else {
        console.error('Unexpected response structure:', response);
        throw new Error('Unexpected response structure from chat API');
      }

      console.log('Parsed chat response:', chatResponse);

      // Ensure required fields exist
      console.log('Field validation:', {
        hasResponse: !!chatResponse.response,
        hasThreadId: !!chatResponse.threadId,
        responseValue: chatResponse.response,
        threadIdValue: chatResponse.threadId,
        allFields: Object.keys(chatResponse)
      });

      if (!chatResponse.response || !chatResponse.threadId) {
        console.error('Invalid chat response structure:', chatResponse);
        throw new Error(`Invalid response format: missing required fields. Has response: ${!!chatResponse.response}, Has threadId: ${!!chatResponse.threadId}`);
      }

      return chatResponse;
    } catch (error: any) {
      console.error('Failed to send chat message:', {
        error,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        url: error?.config?.url
      });
      
      // Provide more helpful error messages
      if (error?.response?.status === 404) {
        throw new Error('Chat endpoint not found. The chat feature may not be available yet.');
      } else if (error?.response?.status === 403) {
        throw new Error('You don\'t have permission to chat with this project.');
      } else if (error?.response?.status === 400) {
        throw new Error('Invalid message format. Please check your message and try again.');
      } else {
        throw new Error(error?.message || 'Failed to send message. Please try again.');
      }
    }
  }
};