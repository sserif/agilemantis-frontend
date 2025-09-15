import { apiClient } from './client';
import { User } from '../types/user';
import { ApiResponse } from './client';

// Users API types
export interface UpdateUserData {
  name?: string;
  email?: string;
  avatar?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
  };
}

export interface UserSearch {
  query: string;
  limit?: number;
}

export interface UserInvite {
  id: string;
  email: string;
  teamId: string;
  teamName: string;
  role: string;
  invitedBy: string;
  invitedAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

// Users API service
export const usersApi = {
  /**
   * Get user by ID
   */
  getUser: async (userId: string): Promise<ApiResponse<User>> => {
    return apiClient.get<User>(`/users/${userId}`);
  },

  /**
   * Update user data (admin only)
   */
  updateUser: async (userId: string, userData: UpdateUserData): Promise<ApiResponse<User>> => {
    return apiClient.put<User>(`/users/${userId}`, userData);
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/users/me');
  },

  /**
   * Update current user profile
   */
  updateProfile: async (profileData: UpdateUserData): Promise<ApiResponse<User>> => {
    return apiClient.put<User>('/users/me', profileData);
  },

  /**
   * Search users by query
   */
  searchUsers: async (searchData: UserSearch): Promise<ApiResponse<User[]>> => {
    const params = new URLSearchParams();
    params.append('q', searchData.query);
    if (searchData.limit) {
      params.append('limit', searchData.limit.toString());
    }

    return apiClient.get<User[]>(`/users/search?${params.toString()}`);
  },

  /**
   * Get user's team invitations
   */
  getUserInvites: async (): Promise<ApiResponse<UserInvite[]>> => {
    return apiClient.get<UserInvite[]>('/users/me/invites');
  },

  /**
   * Accept team invitation
   */
  acceptInvite: async (inviteId: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/users/me/invites/${inviteId}/accept`);
  },

  /**
   * Decline team invitation
   */
  declineInvite: async (inviteId: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/users/me/invites/${inviteId}/decline`);
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ url: string }>> => {
    return apiClient.upload<{ url: string }>('/users/me/avatar', file, onProgress);
  },

  /**
   * Delete user account
   */
  deleteAccount: async (): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>('/users/me');
  }
};

export default usersApi;
