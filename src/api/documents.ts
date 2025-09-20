import { apiClient } from './client';
import { ProjectDocument } from '../types/project';
import { ApiResponse } from './client';

// Document API types
export interface CreateDocumentData {
  name: string;
  type: string;
  content?: string;
  metadata?: Record<string, any>;
}

export interface UpdateDocumentData {
  name?: string;
  content?: string;
  metadata?: Record<string, any>;
}

export interface UploadDocumentData {
  file: File;
  metadata?: Record<string, any>;
  onProgress?: (progressEvent: ProgressEvent) => void;
}

// Documents API service
export const documentsApi = {
  /**
   * Get all documents for a project
   */
  getDocuments: async (teamId: string, projectId: string): Promise<ApiResponse<ProjectDocument[]>> => {
    return apiClient.get<ProjectDocument[]>(`/Teams/${teamId}/Projects/${projectId}/Documents`);
  },

  /**
   * Get document by ID
   */
  getDocument: async (teamId: string, projectId: string, documentId: string): Promise<ApiResponse<ProjectDocument>> => {
    return apiClient.get<ProjectDocument>(`/Teams/${teamId}/Projects/${projectId}/Documents/${documentId}`);
  },

  /**
   * Get document processing status
   */
  getDocumentStatus: async (teamId: string, projectId: string, documentId: string): Promise<any> => {
    return apiClient.get(`/Teams/${teamId}/Projects/${projectId}/Documents/${documentId}/status`);
  },

  /**
   * Create new document
   */
  createDocument: async (teamId: string, projectId: string, documentData: CreateDocumentData): Promise<ApiResponse<ProjectDocument>> => {
    return apiClient.post<ProjectDocument>(`/Teams/${teamId}/Projects/${projectId}/Documents`, documentData);
  },

  /**
   * Update document
   */
  updateDocument: async (teamId: string, projectId: string, documentId: string, documentData: UpdateDocumentData): Promise<ApiResponse<ProjectDocument>> => {
    return apiClient.put<ProjectDocument>(`/Teams/${teamId}/Projects/${projectId}/Documents/${documentId}`, documentData);
  },

  /**
   * Delete document
   */
  deleteDocument: async (teamId: string, projectId: string, documentId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/Teams/${teamId}/Projects/${projectId}/Documents/${documentId}`);
  },

  /**
   * Upload document file
   */
  uploadDocument: async (teamId: string, projectId: string, uploadData: UploadDocumentData): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append('file', uploadData.file);
    
    if (uploadData.metadata) {
      formData.append('metadata', JSON.stringify(uploadData.metadata));
    }

    return apiClient.post<any>(`/Teams/${teamId}/Projects/${projectId}/Documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes timeout for file uploads
      onUploadProgress: uploadData.onProgress,
    });
  },

  /**
   * Download document
   */
  downloadDocument: async (teamId: string, projectId: string, documentId: string): Promise<Blob> => {
    const response = await apiClient.get(`/Teams/${teamId}/Projects/${projectId}/Documents/${documentId}/download`, {
      responseType: 'blob',
    });
    return response as unknown as Blob;
  },

  /**
   * Get document content as text
   */
  getDocumentContent: async (teamId: string, projectId: string, documentId: string): Promise<ApiResponse<{ content: string }>> => {
    return apiClient.get<{ content: string }>(`/Teams/${teamId}/Projects/${projectId}/Documents/${documentId}/content`);
  },

  /**
   * Update document content
   */
  updateDocumentContent: async (teamId: string, projectId: string, documentId: string, content: string): Promise<ApiResponse<ProjectDocument>> => {
    return apiClient.put<ProjectDocument>(`/Teams/${teamId}/Projects/${projectId}/Documents/${documentId}/content`, { content });
  },

  /**
   * Search documents within a project
   */
  searchDocuments: async (teamId: string, projectId: string, query: string): Promise<ApiResponse<ProjectDocument[]>> => {
    return apiClient.get<ProjectDocument[]>(`/Teams/${teamId}/Projects/${projectId}/Documents/search`, {
      params: { q: query },
    });
  },

  /**
   * Get documents by type
   */
  getDocumentsByType: async (teamId: string, projectId: string, type: string): Promise<ApiResponse<ProjectDocument[]>> => {
    return apiClient.get<ProjectDocument[]>(`/Teams/${teamId}/Projects/${projectId}/Documents`, {
      params: { type },
    });
  },
};