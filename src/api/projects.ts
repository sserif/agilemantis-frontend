import { apiClient } from './client';
import { Project, ProjectDocument } from '../types/project';
import { User } from '../types/user';
import { ApiResponse } from './client';

// Projects API types
export interface CreateProjectData {
  name: string;
  description?: string;
  teamId: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  user: User;
  joinedAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'agent';
  timestamp: string;
  userId?: string;
  attachments?: string[];
}

export interface AddProjectMemberData {
  userId: string;
  role: 'admin' | 'member' | 'viewer';
}

// Projects API service
export const projectsApi = {
  /**
   * Get all projects for a team
   */
  getProjects: async (teamId: string): Promise<ApiResponse<Project[]>> => {
    return apiClient.get<Project[]>(`/Teams/${teamId}/Projects`);
  },

  /**
   * Get project by ID
   */
  getProject: async (teamId: string, projectId: string): Promise<ApiResponse<Project>> => {
    return apiClient.get<Project>(`/Teams/${teamId}/Projects/${projectId}`);
  },

  /**
   * Create new project
   */
  createProject: async (projectData: CreateProjectData): Promise<ApiResponse<Project>> => {
    return apiClient.post<Project>(`/Teams/${projectData.teamId}/Projects`, projectData);
  },

  /**
   * Update project
   */
  updateProject: async (teamId: string, projectId: string, projectData: UpdateProjectData): Promise<ApiResponse<Project>> => {
    return apiClient.put<Project>(`/Teams/${teamId}/Projects/${projectId}`, projectData);
  },

  /**
   * Delete project
   */
  deleteProject: async (teamId: string, projectId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/Teams/${teamId}/Projects/${projectId}`);
  },

  /**
   * Get project members
   */
  getProjectMembers: async (teamId: string, projectId: string): Promise<ApiResponse<ProjectMember[]>> => {
    return apiClient.get<ProjectMember[]>(`/teams/${teamId}/projects/${projectId}/members`);
  },

  /**
   * Add member to project
   */
  addProjectMember: async (teamId: string, projectId: string, memberData: AddProjectMemberData): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/teams/${teamId}/projects/${projectId}/members`, memberData);
  },

  /**
   * Remove member from project
   */
  removeProjectMember: async (teamId: string, projectId: string, userId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/teams/${teamId}/projects/${projectId}/members/${userId}`);
  },

  /**
   * Update member role in project
   */
  updateProjectMemberRole: async (teamId: string, projectId: string, userId: string, role: string): Promise<ApiResponse<void>> => {
    return apiClient.put<void>(`/teams/${teamId}/projects/${projectId}/members/${userId}/role`, { role });
  },

  /**
   * Get project documents
   */
  getProjectDocuments: async (teamId: string, projectId: string): Promise<ApiResponse<ProjectDocument[]>> => {
    return apiClient.get<ProjectDocument[]>(`/teams/${teamId}/projects/${projectId}/documents`);
  },

  /**
   * Upload document to project
   */
  uploadDocument: async (teamId: string, projectId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<ProjectDocument>> => {
    return apiClient.upload<ProjectDocument>(`/teams/${teamId}/projects/${projectId}/documents`, file, onProgress);
  },

  /**
   * Delete document from project
   */
  deleteDocument: async (teamId: string, projectId: string, fileId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/teams/${teamId}/projects/${projectId}/documents/${fileId}`);
  },

  /**
   * Get project chat messages
   */
  getChatMessages: async (teamId: string, projectId: string, limit?: number, offset?: number): Promise<ApiResponse<ChatMessage[]>> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    return apiClient.get<ChatMessage[]>(`/teams/${teamId}/projects/${projectId}/chat?${params.toString()}`);
  },

  /**
   * Send chat message
   */
  sendChatMessage: async (teamId: string, projectId: string, content: string, attachments?: string[]): Promise<ApiResponse<ChatMessage>> => {
    return apiClient.post<ChatMessage>(`/teams/${teamId}/projects/${projectId}/chat`, {
      content,
      attachments
    });
  }
};

export default projectsApi;
