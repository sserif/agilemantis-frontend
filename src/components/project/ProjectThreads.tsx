import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ThreadInfo } from '../../types/project';
import { threadsApi } from '../../api/threads';
import { LoadingIndicator } from '../common';

interface ProjectThreadsProps {
  teamId: string;
  projectId: string;
  currentThreadId?: string;
  onThreadSelect?: (threadId: string) => void;
  className?: string;
}

export const ProjectThreads: React.FC<ProjectThreadsProps> = ({
  teamId,
  projectId,
  currentThreadId,
  onThreadSelect,
  className = ''
}) => {
  const [threads, setThreads] = useState<ThreadInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingTriggerRef = useRef<HTMLDivElement>(null);

  // Load initial threads
  const loadInitialThreads = useCallback(async () => {
    if (!teamId || !projectId) return;

    setIsLoading(true);
    setError(undefined);

    try {
      const response = await threadsApi.getInitialThreads(teamId, projectId, 20);
      
      if (!response) {
        throw new Error('No response received from threads API');
      }

      const threads = response.threads || [];
      const hasMore = response.hasMore || false;
      const nextCursor = response.nextCursor || undefined;

      setThreads(threads);
      setHasMore(hasMore);
      setNextCursor(nextCursor);
    } catch (err: any) {
      console.error('Failed to load initial threads:', err);
      setError(err.message || 'Failed to load threads');
    } finally {
      setIsLoading(false);
    }
  }, [teamId, projectId]);

  // Load more threads for infinite scroll
  const loadMoreThreads = useCallback(async () => {
    if (!teamId || !projectId || !nextCursor || !hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const response = await threadsApi.getNextThreads(teamId, projectId, nextCursor!, 20);
      
      if (!response) {
        throw new Error('No response received from threads API');
      }

      const newThreads = response.threads || [];
      const responseHasMore = response.hasMore || false;
      const responseNextCursor = response.nextCursor || undefined;

      setThreads(prev => [...prev, ...newThreads]);
      setHasMore(responseHasMore);
      setNextCursor(responseNextCursor);
    } catch (err: any) {
      console.error('Failed to load more threads:', err);
      setError(err.message || 'Failed to load more threads');
    } finally {
      setIsLoadingMore(false);
    }
  }, [teamId, projectId, nextCursor, hasMore, isLoadingMore, threads.length]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!loadingTriggerRef.current || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreThreads();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loadingTriggerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, loadMoreThreads]);

  // Load initial data when component mounts or params change
  useEffect(() => {
    loadInitialThreads();
  }, [loadInitialThreads]);

  // Format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Truncate message preview
  const truncateMessage = (message: string, maxLength: number = 80): string => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className={`w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 h-full ${className}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Recent Threads</h3>
        </div>
        <div className="p-4">
          <LoadingIndicator size="sm" text="Loading threads..." />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Recent Threads</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {threads.length} conversation{threads.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 flex-shrink-0">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadInitialThreads}
            className="text-xs text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 mt-1"
          >
            Try again
          </button>
        </div>
      )}

      {/* Threads List */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {threads.length === 0 && !error ? (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No conversations yet. Start chatting to create your first thread!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {threads.map((thread) => (
              <div
                key={thread.threadId}
                onClick={() => onThreadSelect?.(thread.threadId)}
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  currentThreadId === thread.threadId
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500'
                    : ''
                }`}
              >
                {/* Thread Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      thread.isActive 
                        ? 'bg-green-500' 
                        : 'bg-gray-400 dark:bg-gray-500'
                    }`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {thread.messageCount} message{thread.messageCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatRelativeTime(thread.lastActivityAt || thread.createdAt)}
                  </span>
                </div>

                {/* First Message Preview */}
                {thread.firstMessage && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {truncateMessage(thread.firstMessage, 60)}
                    </p>
                  </div>
                )}

                {/* Last Message Preview */}
                {thread.lastMessage && thread.lastMessage !== thread.firstMessage && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Latest: {truncateMessage(thread.lastMessage, 50)}
                    </p>
                  </div>
                )}

                {/* Thread ID (for debugging) */}
                <div className="mt-2">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
                    {thread.threadId.slice(-8)}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading trigger for infinite scroll */}
            {hasMore && (
              <div ref={loadingTriggerRef} className="p-4">
                {isLoadingMore ? (
                  <LoadingIndicator size="sm" text="Loading more..." />
                ) : (
                  <div className="text-center">
                    <button
                      onClick={loadMoreThreads}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Load more threads
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore && threads.length > 0 && (
              <div className="p-4 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  No more threads to load
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectThreads;