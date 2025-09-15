import React, { forwardRef } from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
  textAreaSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  textAreaSize = 'md',
  fullWidth = true,
  resize = 'vertical',
  className = '',
  id,
  rows = 4,
  ...props
}, ref) => {
  const textAreaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = [
    'block',
    'border',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-0',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'placeholder:text-gray-400',
    'dark:placeholder:text-gray-500',
  ];

  const sizeClasses = {
    sm: ['py-1.5', 'px-3', 'text-sm'],
    md: ['py-2', 'px-3', 'text-sm'],
    lg: ['py-3', 'px-4', 'text-base'],
  };

  const variantClasses = {
    default: [
      'bg-white',
      'border-gray-300',
      'text-gray-900',
      'focus:border-primary-500',
      'focus:ring-primary-500',
      'dark:bg-gray-800',
      'dark:border-gray-600',
      'dark:text-gray-100',
      'dark:focus:border-primary-400',
      'dark:focus:ring-primary-400',
    ],
    filled: [
      'bg-gray-50',
      'border-gray-200',
      'text-gray-900',
      'focus:bg-white',
      'focus:border-primary-500',
      'focus:ring-primary-500',
      'dark:bg-gray-700',
      'dark:border-gray-600',
      'dark:text-gray-100',
      'dark:focus:bg-gray-800',
      'dark:focus:border-primary-400',
      'dark:focus:ring-primary-400',
    ],
  };

  const errorClasses = error ? [
    'border-red-500',
    'focus:border-red-500',
    'focus:ring-red-500',
    'dark:border-red-400',
    'dark:focus:border-red-400',
    'dark:focus:ring-red-400',
  ] : [];

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  const widthClasses = fullWidth ? ['w-full'] : [];

  const textAreaClasses = [
    ...baseClasses,
    ...sizeClasses[textAreaSize],
    ...(error ? errorClasses : variantClasses[variant]),
    ...widthClasses,
    resizeClasses[resize],
    className,
  ].join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={textAreaId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={ref}
          id={textAreaId}
          rows={rows}
          className={textAreaClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
