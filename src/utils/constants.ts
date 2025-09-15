import env from './env';

export const APP_CONFIG = {
  name: env.get().appTitle,
  version: '1.0.0',
  description: 'AI-powered requirement generation platform',
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  users: {
    me: '/users/me',
    updateProfile: '/users/me',
    uploadPhoto: '/users/me/photo',
    deletePhoto: '/users/me/photo',
  },
  teams: {
    list: '/teams',
    create: '/teams',
    byId: (id: string) => `/teams/${id}`,
    members: (id: string) => `/teams/${id}/members`,
    invite: (id: string) => `/teams/${id}/invite`,
    projects: (id: string) => `/teams/${id}/projects`,
  },
  projects: {
    byId: (teamId: string, projectId: string) => `/teams/${teamId}/projects/${projectId}`,
    members: (teamId: string, projectId: string) => `/teams/${teamId}/projects/${projectId}/members`,
    files: (teamId: string, projectId: string) => `/teams/${teamId}/projects/${projectId}/files`,
    chat: (teamId: string, projectId: string) => `/teams/${teamId}/projects/${projectId}/chat`,
  },
};

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  team: (id: string) => `/teams/${id}`,
  teamMembers: (id: string) => `/teams/${id}/members`,
  teamSettings: (id: string) => `/teams/${id}/settings`,
  project: (teamId: string, projectId: string) => `/teams/${teamId}/projects/${projectId}`,
  projectChat: (teamId: string, projectId: string) => `/teams/${teamId}/projects/${projectId}/chat`,
  projectFiles: (teamId: string, projectId: string) => `/teams/${teamId}/projects/${projectId}/files`,
  projectMembers: (teamId: string, projectId: string) => `/teams/${teamId}/projects/${projectId}/members`,
  projectSettings: (teamId: string, projectId: string) => `/teams/${teamId}/projects/${projectId}/settings`,
  settings: '/settings',
  notFound: '/404',
};

export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/webp',
  ],
  allowedExtensions: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.webp'],
};

export const STORAGE_KEYS = {
  auth: 'agile-mantis-auth',
  theme: 'agile-mantis-theme',
  sidebar: 'agile-mantis-sidebar',
};