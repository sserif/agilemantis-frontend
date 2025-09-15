import type { User } from './user';
import type { Project } from './project';

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: TeamMember[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  userId: string;
  user: User;
  role: TeamRole;
  joinedAt: string;
}

export type TeamRole = 'owner' | 'member';

export interface CreateTeamRequest {
  name: string;
  description?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
}

export interface InviteUserRequest {
  email: string;
  role: TeamRole;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  status: 'pending' | 'accepted' | 'expired';
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
}