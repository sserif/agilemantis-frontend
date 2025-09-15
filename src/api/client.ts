import axios from 'axios';
import { env } from '../utils/env';

// API Response interface
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

// API Error interface
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

// Create custom error class
export class HttpError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Create Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
    });

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and response transformation
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data,
    });

    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Handle authentication errors
      if (status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        // Dispatch logout event
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }

      // Create custom error
      const apiError = new HttpError(
        data?.message || error.message || 'An error occurred',
        status,
        data?.code,
        data
      );

      return Promise.reject(apiError);
    } else if (error.request) {
      // Network error
      const networkError = new HttpError(
        'Network error - please check your connection',
        0,
        'NETWORK_ERROR'
      );
      return Promise.reject(networkError);
    } else {
      // Request setup error
      const setupError = new HttpError(
        error.message || 'Request setup error',
        0,
        'SETUP_ERROR'
      );
      return Promise.reject(setupError);
    }
  }
);

// API Client class
export class ApiClient {
  private instance: typeof axiosInstance;

  constructor(instance: typeof axiosInstance) {
    this.instance = instance;
  }

  // Generic request method
  async request<T = unknown>(config: Record<string, unknown> & { url: string; method: string }): Promise<ApiResponse<T>> {
    const response = await this.instance.request<ApiResponse<T>>(config);
    return response.data;
  }

  // GET request
  async get<T = unknown>(url: string, config?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  // POST request
  async post<T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  // PUT request
  async put<T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  // PATCH request
  async patch<T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  // DELETE request
  async delete<T = unknown>(url: string, config?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Upload file
  async upload<T = unknown>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const config: Record<string, unknown> & { url: string; method: string } = {
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent: { loaded: number; total?: number }) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      };
    }

    return this.request<T>(config);
  }

  // Set authentication token
  setAuthToken(token: string | null): void {
    if (token) {
      this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.instance.defaults.headers.common['Authorization'];
    }
  }

  // Get current base URL
  getBaseURL(): string {
    return this.instance.defaults.baseURL || '';
  }

  // Update base URL
  setBaseURL(baseURL: string): void {
    this.instance.defaults.baseURL = baseURL;
  }
}

// Create and export the main API client instance
export const apiClient = new ApiClient(axiosInstance);

// Export Axios instance for advanced usage
export { axiosInstance };

// Export default client for backward compatibility
export default apiClient;
