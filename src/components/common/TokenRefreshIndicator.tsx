import React, { useState, useEffect } from 'react';
import LoadingIndicator from './LoadingIndicator';

// Global state for token refresh status
let isRefreshingToken = false;
const refreshListeners: (() => void)[] = [];

export const setTokenRefreshStatus = (status: boolean) => {
  isRefreshingToken = status;
  refreshListeners.forEach(listener => listener());
};

export const useTokenRefreshStatus = () => {
  const [isRefreshing, setIsRefreshing] = useState(isRefreshingToken);

  useEffect(() => {
    const listener = () => setIsRefreshing(isRefreshingToken);
    refreshListeners.push(listener);

    return () => {
      const index = refreshListeners.indexOf(listener);
      if (index > -1) {
        refreshListeners.splice(index, 1);
      }
    };
  }, []);

  return isRefreshing;
};

const TokenRefreshIndicator: React.FC = () => {
  const isRefreshing = useTokenRefreshStatus();

  if (!isRefreshing) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center gap-3">
      <LoadingIndicator size="sm" />
      <div>
        <p className="text-sm font-medium text-gray-900">Refreshing session...</p>
        <p className="text-xs text-gray-500">Please wait a moment</p>
      </div>
    </div>
  );
};

export default TokenRefreshIndicator;