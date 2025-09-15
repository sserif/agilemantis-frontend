import { apiClient } from './client';
import { Team } from '../types/team';
import { User } from '../types/user';
import { ApiResponse } from './client';

// Teams API types
export interface CreateTeamData {
  name: string;
  description?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'owner' | 'admin' | 'member';
  user: User;
  joinedAt: string;
}

export interface InviteUserData {
  email: string;
  role: 'admin' | 'member';
}

// Teams API service
export const teamsApi = {
  /**
   * Get all teams for current user
   */
  getTeams: async (): Promise<ApiResponse<Team[]>> => {
    return apiClient.get<Team[]>('/teams');
  },

  /**
   * Get team by ID
   */
  getTeam: async (teamId: string): Promise<ApiResponse<Team>> => {
    return apiClient.get<Team>(`/teams/${teamId}`);
  },

  /**
   * Create new team
   */
  createTeam: async (teamData: CreateTeamData): Promise<ApiResponse<Team>> => {
    return apiClient.post<Team>('/teams', teamData);
  },

  /**
   * Update team
   */
  updateTeam: async (teamId: string, teamData: UpdateTeamData): Promise<ApiResponse<Team>> => {
    return apiClient.put<Team>(`/teams/${teamId}`, teamData);
  },

  /**
   * Delete team
   */
  deleteTeam: async (teamId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/teams/${teamId}`);
  },

  /**
   * Get team members
   */
  getTeamMembers: async (teamId: string): Promise<ApiResponse<TeamMember[]>> => {
    return apiClient.get<TeamMember[]>(`/teams/${teamId}/members`);
  },

  /**
   * Invite user to team
   */
  inviteUser: async (teamId: string, inviteData: InviteUserData): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/teams/${teamId}/invite`, inviteData);
  },

  /**
   * Remove user from team
   */
  removeUser: async (teamId: string, userId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/teams/${teamId}/members/${userId}`);
  },

  /**
   * Update user role in team
   */
  updateUserRole: async (teamId: string, userId: string, role: 'admin' | 'member'): Promise<ApiResponse<void>> => {
    return apiClient.put<void>(`/teams/${teamId}/members/${userId}/role`, { role });
  },

  /**
   * Leave team
   */
  leaveTeam: async (teamId: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/teams/${teamId}/leave`);
  }
};

export default teamsApi;
