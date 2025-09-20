// Chat-related types based on the AgileMantis API swagger documentation
import { ChatMessage } from './project';

export interface ChatRequest {
  /** The user's message to send to the AI assistant (1-4000 characters) */
  message: string;
  /** Optional existing thread ID to continue a conversation */
  threadId?: string;
}

export interface ChatResponse {
  /** The AI assistant's response to the user's message */
  response: string;
  /** The thread ID for this conversation */
  threadId: string;
  /** Timestamp when the response was generated */
  generatedAt?: string;
  /** The original user message that prompted this response */
  userMessage: string;
  /** Indicates if this is the start of a new conversation thread */
  isNewThread?: boolean;
  /** The project ID this conversation belongs to */
  projectId?: string;
  /** Optional metadata about the conversation or response generation */
  metadata?: string;
}

export interface ChatThread {
  id: string;
  projectId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  currentThreadId?: string;
  isLoading: boolean;
  isTyping: boolean;
  error?: string;
}