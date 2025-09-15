import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Project, ProjectMember } from '../types/project';

// Project State Types
export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProjectContextType extends ProjectState {
  fetchProjects: (teamId?: string) => Promise<void>;
  fetchProject: (projectId: string) => Promise<void>;
  createProject: (teamId: string, projectData: Partial<Project>) => Promise<Project>;
  updateProject: (projectId: string, projectData: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addMember: (projectId: string, userId: string, role: 'owner' | 'contributor' | 'reader') => Promise<void>;
  removeMember: (projectId: string, userId: string) => Promise<void>;
  updateMemberRole: (projectId: string, userId: string, role: 'owner' | 'contributor' | 'reader') => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  clearError: () => void;
}

// Project Actions
type ProjectAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { projectId: string; projectData: Partial<Project> } }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'ADD_MEMBER'; payload: { projectId: string; member: ProjectMember } }
  | { type: 'REMOVE_MEMBER'; payload: { projectId: string; userId: string } }
  | { type: 'UPDATE_MEMBER_ROLE'; payload: { projectId: string; userId: string; role: 'owner' | 'contributor' | 'reader' } };

// Initial State
const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

// Project Reducer
function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
        isLoading: false,
      };
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.projectId
            ? { ...project, ...action.payload.projectData }
            : project
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, ...action.payload.projectData }
          : state.currentProject,
      };
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload ? null : state.currentProject,
      };
    case 'ADD_MEMBER':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.projectId
            ? { ...project, members: [...project.members, action.payload.member] }
            : project
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, members: [...state.currentProject.members, action.payload.member] }
          : state.currentProject,
      };
    case 'REMOVE_MEMBER':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.projectId
            ? { ...project, members: project.members.filter(member => member.userId !== action.payload.userId) }
            : project
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? { ...state.currentProject, members: state.currentProject.members.filter(member => member.userId !== action.payload.userId) }
          : state.currentProject,
      };
    case 'UPDATE_MEMBER_ROLE':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.projectId
            ? {
              ...project,
              members: project.members.map(member =>
                member.userId === action.payload.userId
                  ? { ...member, role: action.payload.role }
                  : member
              )
            }
            : project
        ),
        currentProject: state.currentProject?.id === action.payload.projectId
          ? {
            ...state.currentProject,
            members: state.currentProject.members.map(member =>
              member.userId === action.payload.userId
                ? { ...member, role: action.payload.role }
                : member
            )
          }
          : state.currentProject,
      };
    default:
      return state;
  }
}

// Create Context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Project Provider Component
export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Fetch projects function
  const fetchProjects = async (teamId?: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // TODO: Replace with actual API call
      console.log('Fetching projects for team:', teamId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock projects data
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Frontend Redesign',
          description: 'Complete redesign of the frontend application',
          teamId: teamId || '1',
          ownerId: '1',
          members: [],
          files: [],
          agentContext: {
            systemPrompt: 'Frontend development assistant',
            instructions: 'Help with React, TypeScript, and CSS development',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'API Integration',
          description: 'Integration with third-party APIs',
          teamId: teamId || '1',
          ownerId: '1',
          members: [],
          files: [],
          agentContext: {
            systemPrompt: 'API integration assistant',
            instructions: 'Help with REST API integration and backend services',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      dispatch({ type: 'SET_PROJECTS', payload: mockProjects });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  // Fetch project function
  const fetchProject = async (projectId: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // TODO: Replace with actual API call
      console.log('Fetching project:', projectId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find project from existing projects or create mock
      const existingProject = state.projects.find(project => project.id === projectId);
      if (existingProject) {
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: existingProject });
      } else {
        // Mock project if not found
        const mockProject: Project = {
          id: projectId,
          name: `Project ${projectId}`,
          description: 'Mock project data',
          teamId: '1',
          ownerId: '1',
          members: [],
          files: [],
          agentContext: {
            systemPrompt: 'General project assistant',
            instructions: 'Help with project management and development',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: mockProject });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  // Create project function
  const createProject = async (teamId: string, projectData: Partial<Project>): Promise<Project> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // TODO: Replace with actual API call
      console.log('Creating project:', teamId, projectData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newProject: Project = {
        id: Date.now().toString(),
        name: projectData.name || 'New Project',
        description: projectData.description || '',
        teamId,
        ownerId: '1', // TODO: Get from auth context
        members: [],
        files: [],
        agentContext: {
          systemPrompt: 'Project assistant',
          instructions: 'Help with project development and management',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...projectData,
      };

      dispatch({ type: 'ADD_PROJECT', payload: newProject });
      dispatch({ type: 'SET_LOADING', payload: false });

      return newProject;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Update project function
  const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      console.log('Updating project:', projectId, projectData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({ type: 'UPDATE_PROJECT', payload: { projectId, projectData } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Delete project function
  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      console.log('Deleting project:', projectId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({ type: 'REMOVE_PROJECT', payload: projectId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Add member function
  const addMember = async (projectId: string, userId: string, role: 'owner' | 'contributor' | 'reader'): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      console.log('Adding member to project:', projectId, userId, role);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newMember: ProjectMember = {
        userId,
        user: {
          id: userId,
          email: `user${userId}@example.com`,
          name: `User ${userId}`,
          roles: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        role,
        joinedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_MEMBER', payload: { projectId, member: newMember } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add member';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Remove member function
  const removeMember = async (projectId: string, userId: string): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      console.log('Removing member from project:', projectId, userId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({ type: 'REMOVE_MEMBER', payload: { projectId, userId } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove member';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Update member role function
  const updateMemberRole = async (projectId: string, userId: string, role: 'owner' | 'contributor' | 'reader'): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      console.log('Updating member role:', projectId, userId, role);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({ type: 'UPDATE_MEMBER_ROLE', payload: { projectId, userId, role } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update member role';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Set current project function
  const setCurrentProject = (project: Project | null): void => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: ProjectContextType = {
    ...state,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
    updateMemberRole,
    setCurrentProject,
    clearError,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}

// Custom hook to use project context
export function useProject(): ProjectContextType {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

export default ProjectContext;
