// Type exports
export * from './auth';
export * from './user';
export * from './team';
export * from './project';
export * from './api';
export * from './chat';

// Common utility types
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingState {
  status: Status;
  error: string | null;
}