import React from 'react';

export type StatusType = 'processing' | 'failed' | 'completed' | 'idle';

interface StatusIndicatorProps {
  status: StatusType;
  message?: string;
  className?: string;
  showLabel?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  className = '',
  showLabel = true
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ),
          label: 'Processing',
          dotColor: 'bg-yellow-400'
        };
      case 'failed':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          label: 'Failed',
          dotColor: 'bg-red-400'
        };
      case 'completed':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          label: 'Processed',
          dotColor: 'bg-green-400'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
          label: 'File',
          dotColor: 'bg-gray-400'
        };
    }
  };

  const config = getStatusConfig();

  if (showLabel) {
    return (
      <div 
        className={`inline-flex items-center gap-2 px-2 py-1 rounded-full border text-xs font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
        title={message}
      >
        {config.icon}
        <span>{config.label}</span>
        {message && (
          <span className="text-xs opacity-75 max-w-20 truncate">
            {message}
          </span>
        )}
      </div>
    );
  }

  // Compact dot indicator
  return (
    <div 
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${config.bgColor} ${config.borderColor} border ${className}`}
      title={`${config.label}${message ? `: ${message}` : ''}`}
    >
      <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
    </div>
  );
};