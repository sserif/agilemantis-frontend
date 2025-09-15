export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  picture?: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  name: string;
  scope: 'team' | 'project';
  scopeId: string;
}

export interface UserProfile {
  name: string;
  bio?: string;
  picture?: string;
}

export interface UpdateUserRequest {
  name?: string;
  bio?: string;
}

export interface UploadPhotoResponse {
  photoUrl: string;
}