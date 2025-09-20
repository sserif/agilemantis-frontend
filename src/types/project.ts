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

// Thread-related types for the new Project Threads API
export interface ThreadInfo {
  threadId: string;
  createdAt: string;
  lastActivityAt?: string;
  messageCount: number;
  firstMessage?: string;
  lastMessage?: string;
  isActive: boolean;
  projectId: string;
}

export interface ThreadListResponse {
  threads: ThreadInfo[];
  projectId: string;
  hasMore: boolean;
  limit: number;
  nextCursor?: string;
  previousCursor?: string;
  order?: string;
}

export interface ThreadListRequest {
  teamId: string;
  projectId: string;
  limit?: number;
  order?: 'asc' | 'desc';
  after?: string;
  before?: string;
}

// Thread message and detail types for thread detail view
export interface ThreadMessage {
  messageId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: string;
  userId?: string;
  metadata?: string;
}

export interface ThreadDetailResponse {
  thread: ThreadInfo;
  messages: ThreadMessage[];
  projectId: string;
}

// Thread run types for continuing existing conversations
export interface RunRequest {
  message: string;
  instructions?: string;
}

export interface RunResponse {
  runId: string;
  threadId: string;
  status: RunStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  assistantId: string;
  projectId: string;
  instructions?: string;
  userMessage: string;
}

export type RunStatus = 'queued' | 'in_progress' | 'completed' | 'failed' | 'expired';