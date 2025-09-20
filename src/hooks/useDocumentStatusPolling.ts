import { useEffect, useRef, useState } from 'react';
import { documentsApi } from '../api/documents';

export interface UseDocumentStatusPollingOptions {
  teamId: string;
  projectId: string;
  documentId: string;
  onStatusChange?: (status: 'processing' | 'failed' | 'completed', message?: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  interval?: number; // polling interval in ms, default 2000
  maxAttempts?: number; // max polling attempts, default 30
}

export const useDocumentStatusPolling = (options: UseDocumentStatusPollingOptions) => {
  const {
    teamId,
    projectId,
    documentId,
    onStatusChange,
    onComplete,
    onError,
    interval = 2000,
    maxAttempts = 30
  } = options;

  const [status, setStatus] = useState<'processing' | 'failed' | 'completed' | 'idle'>('idle');
  const [message, setMessage] = useState<string | undefined>();
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef(0);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
    attemptsRef.current = 0;
  };

  const startPolling = () => {
    if (isPolling) return;
    
    setIsPolling(true);
    setStatus('processing');
    setError(null);
    attemptsRef.current = 0;

    const poll = async () => {
      try {
        attemptsRef.current += 1;
        
        const response = await documentsApi.getDocumentStatus(teamId, projectId, documentId);
        const statusData = response.data;
        
        setStatus(statusData.status);
        setMessage(statusData.message);
        
        onStatusChange?.(statusData.status, statusData.message);

        if (statusData.status === 'completed') {
          stopPolling();
          onComplete?.();
        } else if (statusData.status === 'failed') {
          stopPolling();
        } else if (attemptsRef.current >= maxAttempts) {
          // Max attempts reached, stop polling
          stopPolling();
          const timeoutError = new Error(`Processing status check timed out after ${maxAttempts} attempts`);
          setError(timeoutError);
          onError?.(timeoutError);
        }
      } catch (err) {
        console.error('Error polling document status:', err);
        const error = err instanceof Error ? err : new Error('Unknown error occurred');
        setError(error);
        
        // Stop polling on error after a few attempts
        if (attemptsRef.current >= 3) {
          stopPolling();
          onError?.(error);
        }
      }
    };

    // Poll immediately, then set up interval
    poll();
    intervalRef.current = setInterval(poll, interval);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return {
    status,
    message,
    isPolling,
    error,
    startPolling,
    stopPolling,
  };
};