import { apiClient } from './client';
import { User } from '../types/user';
import { ApiResponse } from './client';

// Auth API types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RefreshTokenResponse {
  token: string;
}

// Auth API service
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/logout');
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (): Promise<ApiResponse<RefreshTokenResponse>> => {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh');
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/auth/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.put<User>('/auth/profile', userData);
  },

  /**
   * Change user password
   */
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/change-password', data);
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: { token: string; password: string }): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/reset-password', data);
  }
};

export default authApi;
