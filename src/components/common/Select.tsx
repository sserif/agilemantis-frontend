import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'filled';
  selectSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  variant = 'default',
  selectSize = 'md',
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

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
    'appearance-none',
    'bg-no-repeat',
    'bg-right',
    'pr-10',
  ];

  const sizeClasses = {
    sm: ['py-1.5', 'pl-3', 'text-sm'],
    md: ['py-2', 'pl-3', 'text-sm'],
    lg: ['py-3', 'pl-4', 'text-base'],
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

  const selectClasses = [
    ...baseClasses,
    ...sizeClasses[selectSize],
    ...(error ? errorClasses : variantClasses[variant]),
    ...widthClasses,
    className,
  ].join(' ');

  // Custom dropdown arrow background
  const arrowStyle = {
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundSize: '1.5em 1.5em',
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          style={arrowStyle}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';

export default Select;
