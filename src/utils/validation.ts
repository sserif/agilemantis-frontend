// Form validation utilities

export interface ValidationRule {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  email?: boolean | string;
  url?: boolean | string;
  custom?: (value: unknown) => string | boolean;
}

export interface ValidationError {
  type: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormTouched {
  [key: string]: boolean;
}

export interface FormValues {
  [key: string]: unknown;
}

/**
 * Validates a single field value against a validation rule
 */
export function validateField(value: unknown, rules: ValidationRule): ValidationError | null {
  // Required validation
  if (rules.required) {
    const isEmpty = value === undefined || value === null || value === '' ||
      (Array.isArray(value) && value.length === 0);
    if (isEmpty) {
      const message = typeof rules.required === 'string' ? rules.required : 'This field is required';
      return { type: 'required', message };
    }
  }

  // Skip other validations if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return null;
  }

  // Email validation
  if (rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value !== 'string' || !emailRegex.test(value)) {
      const message = typeof rules.email === 'string' ? rules.email : 'Please enter a valid email address';
      return { type: 'email', message };
    }
  }

  // URL validation
  if (rules.url) {
    try {
      if (typeof value !== 'string') {
        const message = typeof rules.url === 'string' ? rules.url : 'Please enter a valid URL';
        return { type: 'url', message };
      }
      new URL(value);
    } catch {
      const message = typeof rules.url === 'string' ? rules.url : 'Please enter a valid URL';
      return { type: 'url', message };
    }
  }

  // Pattern validation
  if (rules.pattern) {
    if (typeof value !== 'string') {
      return { type: 'pattern', message: 'Invalid format' };
    }
    if (typeof rules.pattern === 'object' && 'value' in rules.pattern) {
      const pattern = rules.pattern.value;
      const message = rules.pattern.message;
      if (!pattern.test(value)) {
        return { type: 'pattern', message };
      }
    } else {
      const pattern = rules.pattern as RegExp;
      if (!pattern.test(value)) {
        return { type: 'pattern', message: 'Invalid format' };
      }
    }
  }

  // String length validations
  if (typeof value === 'string') {
    if (rules.minLength) {
      const minLength = typeof rules.minLength === 'object' ? rules.minLength.value : rules.minLength;
      const message = typeof rules.minLength === 'object'
        ? rules.minLength.message
        : `Must be at least ${minLength} characters`;
      if (value.length < minLength) {
        return { type: 'minLength', message };
      }
    }

    if (rules.maxLength) {
      const maxLength = typeof rules.maxLength === 'object' ? rules.maxLength.value : rules.maxLength;
      const message = typeof rules.maxLength === 'object'
        ? rules.maxLength.message
        : `Must be no more than ${maxLength} characters`;
      if (value.length > maxLength) {
        return { type: 'maxLength', message };
      }
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined) {
      const min = typeof rules.min === 'object' ? rules.min.value : rules.min;
      const message = typeof rules.min === 'object'
        ? rules.min.message
        : `Must be at least ${min}`;
      if (value < min) {
        return { type: 'min', message };
      }
    }

    if (rules.max !== undefined) {
      const max = typeof rules.max === 'object' ? rules.max.value : rules.max;
      const message = typeof rules.max === 'object'
        ? rules.max.message
        : `Must be no more than ${max}`;
      if (value > max) {
        return { type: 'max', message };
      }
    }
  }

  // Custom validation
  if (rules.custom) {
    const result = rules.custom(value);
    if (typeof result === 'string') {
      return { type: 'custom', message: result };
    }
    if (result === false) {
      return { type: 'custom', message: 'Invalid value' };
    }
  }

  return null;
}

/**
 * Validates an entire form against validation rules
 */
export function validateForm(
  values: FormValues,
  rules: { [key: string]: ValidationRule }
): FormErrors {
  const errors: FormErrors = {};

  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];
    const error = validateField(value, fieldRules);

    if (error) {
      errors[field] = error.message;
    }
  });

  return errors;
}

/**
 * Checks if a form has any errors
 */
export function hasFormErrors(errors: FormErrors): boolean {
  return Object.values(errors).some(error => error !== undefined && error !== '');
}

/**
 * Gets the first error message from form errors
 */
export function getFirstError(errors: FormErrors): string | undefined {
  return Object.values(errors).find(error => error !== undefined && error !== '');
}

/**
 * Common validation rules
 */
export const commonRules = {
  required: { required: true },
  email: { required: true, email: true },
  password: {
    required: true,
    minLength: { value: 8, message: 'Password must be at least 8 characters' },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    }
  },
  name: {
    required: true,
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    maxLength: { value: 50, message: 'Name must be no more than 50 characters' }
  },
  url: { url: true },
  phone: {
    pattern: {
      value: /^[+]?[1-9][\d]{0,15}$/,
      message: 'Please enter a valid phone number'
    }
  }
};

/**
 * Debounced validation function
 */
export function createDebouncedValidator(
  validateFn: (value: unknown) => ValidationError | null,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout;

  return (value: unknown, callback: (error: ValidationError | null) => void) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const error = validateFn(value);
      callback(error);
    }, delay);
  };
}

export default {
  validateField,
  validateForm,
  hasFormErrors,
  getFirstError,
  commonRules,
  createDebouncedValidator,
};
