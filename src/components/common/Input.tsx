import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  inputSize = 'md',
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

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
    sm: leftIcon || rightIcon ? ['py-1.5', 'pl-8', 'pr-3', 'text-sm'] : ['py-1.5', 'px-3', 'text-sm'],
    md: leftIcon || rightIcon ? ['py-2', 'pl-10', 'pr-3', 'text-sm'] : ['py-2', 'px-3', 'text-sm'],
    lg: leftIcon || rightIcon ? ['py-3', 'pl-12', 'pr-4', 'text-base'] : ['py-3', 'px-4', 'text-base'],
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

  const widthClasses = fullWidth ? ['w-full'] : [];

  const inputClasses = [
    ...baseClasses,
    ...sizeClasses[inputSize],
    ...(error ? errorClasses : variantClasses[variant]),
    ...widthClasses,
    className,
  ].join(' ');

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const iconPositionClasses = {
    sm: 'left-2.5',
    md: 'left-3',
    lg: 'left-4',
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className={`absolute ${iconPositionClasses[inputSize]} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none`}>
            <span className={iconSizeClasses[inputSize]}>{leftIcon}</span>
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none`}>
            <span className={iconSizeClasses[inputSize]}>{rightIcon}</span>
          </div>
        )}
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

Input.displayName = 'Input';

export default Input;
