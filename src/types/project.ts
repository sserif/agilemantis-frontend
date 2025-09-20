import { User } from './user';

export interface Project {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  ownerId: string;
  members: ProjectMember[];
  documents: ProjectDocument[];
  agentContext: AgentContext;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  userId: string;
  user: User;
  role: ProjectRole;
  joinedAt: string;
}

export type ProjectRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface ProjectFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  content?: string;
  metadata?: Record<string, any>;
  processingStatus?: 'processing' | 'failed' | 'completed';
}

export interface AgentContext {
  systemPrompt: string;
  instructions: string;
  modelConfig?: Record<string, unknown>;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  ownerId: string;
  agentContext: AgentContext;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  agentContext?: AgentContext;
}

export interface AddProjectMemberRequest {
  userId: string;
  role: ProjectRole;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  type: 'user' | 'agent';
  attachments?: ChatAttachment[];
  createdAt: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  scope: 'project' | 'conversation';
}

export interface SendMessageRequest {
  content: string;
  attachments?: File[];
  attachmentScope?: 'project' | 'conversation';
}