import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import type { Team, TeamMember } from '../types/team';
import { teamsApi } from '../api/teams';

// Team State Types
export interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  isLoading: boolean;
  error: string | null;
}

export interface TeamContextType extends TeamState {
  fetchTeams: () => Promise<void>;
  fetchTeam: (teamId: string) => Promise<void>;
  createTeam: (teamData: Partial<Team>) => Promise<Team>;
  updateTeam: (teamId: string, teamData: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  addMember: (teamId: string, userId: string, role: 'owner' | 'member') => Promise<void>;
  removeMember: (teamId: string, userId: string) => Promise<void>;
  updateMemberRole: (teamId: string, userId: string, role: 'owner' | 'member') => Promise<void>;
  setCurrentTeam: (team: Team | null) => void;
  clearError: () => void;
}

// Team Actions
type TeamAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_TEAMS'; payload: Team[] }
  | { type: 'SET_CURRENT_TEAM'; payload: Team | null }
  | { type: 'ADD_TEAM'; payload: Team }
  | { type: 'UPDATE_TEAM'; payload: { teamId: string; teamData: Partial<Team> } }
  | { type: 'REMOVE_TEAM'; payload: string }
  | { type: 'ADD_MEMBER'; payload: { teamId: string; member: TeamMember } }
  | { type: 'REMOVE_MEMBER'; payload: { teamId: string; userId: string } }
  | { type: 'UPDATE_MEMBER_ROLE'; payload: { teamId: string; userId: string; role: 'owner' | 'member' } };

// Initial State
const initialState: TeamState = {
  teams: [],
  currentTeam: null,
  isLoading: false,
  error: null,
};

// Team Reducer
function teamReducer(state: TeamState, action: TeamAction): TeamState {
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
    case 'SET_TEAMS':
      console.log('TeamContext reducer: SET_TEAMS action received', action.payload);
      return {
        ...state,
        teams: action.payload,
        isLoading: false,
      };
    case 'SET_CURRENT_TEAM':
      return {
        ...state,
        currentTeam: action.payload,
      };
    case 'ADD_TEAM':
      return {
        ...state,
        teams: [...state.teams, action.payload],
      };
    case 'UPDATE_TEAM':
      return {
        ...state,
        teams: state.teams.map(team =>
          team.id === action.payload.teamId
            ? { ...team, ...action.payload.teamData }
            : team
        ),
        currentTeam: state.currentTeam?.id === action.payload.teamId
          ? { ...state.currentTeam, ...action.payload.teamData }
          : state.currentTeam,
      };
    case 'REMOVE_TEAM':
      return {
        ...state,
        teams: state.teams.filter(team => team.id !== action.payload),
        currentTeam: state.currentTeam?.id === action.payload ? null : state.currentTeam,
      };
    case 'ADD_MEMBER':
      return {
        ...state,
        teams: state.teams.map(team =>
          team.id === action.payload.teamId
            ? { ...team, members: [...team.members, action.payload.member] }
            : team
        ),
        currentTeam: state.currentTeam?.id === action.payload.teamId
          ? { ...state.currentTeam, members: [...state.currentTeam.members, action.payload.member] }
          : state.currentTeam,
      };
    case 'REMOVE_MEMBER':
      return {
        ...state,
        teams: state.teams.map(team =>
          team.id === action.payload.teamId
            ? { ...team, members: team.members.filter(member => member.userId !== action.payload.userId) }
            : team
        ),
        currentTeam: state.currentTeam?.id === action.payload.teamId
          ? { ...state.currentTeam, members: state.currentTeam.members.filter(member => member.userId !== action.payload.userId) }
          : state.currentTeam,
      };
    case 'UPDATE_MEMBER_ROLE':
      return {
        ...state,
        teams: state.teams.map(team =>
          team.id === action.payload.teamId
            ? {
              ...team,
              members: team.members.map(member =>
                member.userId === action.payload.userId
                  ? { ...member, role: action.payload.role }
                  : member
              )
            }
            : team
        ),
        currentTeam: state.currentTeam?.id === action.payload.teamId
          ? {
            ...state.currentTeam,
            members: state.currentTeam.members.map(member =>
              member.userId === action.payload.userId
                ? { ...member, role: action.payload.role }
                : member
            )
          }
          : state.currentTeam,
      };
    default:
      return state;
  }
}

// Create Context
const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Team Provider Component
export function TeamProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(teamReducer, initialState);

  // Fetch teams function
  const fetchTeams = useCallback(async (): Promise<void> => {
    console.log('🚀 TeamContext: fetchTeams called - starting execution');
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      console.log('Fetching teams from API...');

      // Call actual API
      const response = await teamsApi.getTeams();
      console.log('TeamContext: Full API response:', response);
      console.log('TeamContext: response.data:', response.data);
      console.log('TeamContext: typeof response.data:', typeof response.data);
      
      // The server returns the array directly, not wrapped in a data property
      const teams = Array.isArray(response) ? response : response.data || response;
      console.log('TeamContext: Extracted teams:', teams);

      console.log('TeamContext: Setting teams in context:', teams);
      dispatch({ type: 'SET_TEAMS', payload: teams });
      console.log('TeamContext: SET_TEAMS action dispatched');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch teams';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, []);

  // Fetch team function
  const fetchTeam = async (teamId: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      console.log('Fetching team:', teamId);

      // Call actual API
      const response = await teamsApi.getTeam(teamId);
      const team = response.data;

      dispatch({ type: 'SET_CURRENT_TEAM', payload: team });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  // Create team function
  const createTeam = async (teamData: Partial<Team>): Promise<Team> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      console.log('Creating team:', teamData);

      // Call actual API
      const response = await teamsApi.createTeam({
        name: teamData.name || 'New Team',
        description: teamData.description
      });
      const newTeam = response.data;

      dispatch({ type: 'ADD_TEAM', payload: newTeam });
      dispatch({ type: 'SET_LOADING', payload: false });

      return newTeam;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create team';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Update team function
  const updateTeam = async (teamId: string, teamData: Partial<Team>): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      console.log('Updating team:', teamId, teamData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({ type: 'UPDATE_TEAM', payload: { teamId, teamData } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update team';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Delete team function
  const deleteTeam = async (teamId: string): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      console.log('Deleting team:', teamId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({ type: 'REMOVE_TEAM', payload: teamId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete team';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Add member function
  const addMember = async (teamId: string, userId: string, role: 'owner' | 'member'): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      console.log('Adding member to team:', teamId, userId, role);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newMember: TeamMember = {
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

      dispatch({ type: 'ADD_MEMBER', payload: { teamId, member: newMember } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add member';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Remove member function
  const removeMember = async (teamId: string, userId: string): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      console.log('Removing member from team:', teamId, userId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({ type: 'REMOVE_MEMBER', payload: { teamId, userId } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove member';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Update member role function
  const updateMemberRole = async (teamId: string, userId: string, role: 'owner' | 'member'): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      console.log('Updating member role:', teamId, userId, role);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({ type: 'UPDATE_MEMBER_ROLE', payload: { teamId, userId, role } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update member role';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Set current team function
  const setCurrentTeam = (team: Team | null): void => {
    dispatch({ type: 'SET_CURRENT_TEAM', payload: team });
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: TeamContextType = {
    ...state,
    fetchTeams,
    fetchTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember,
    updateMemberRole,
    setCurrentTeam,
    clearError,
  };

  return (
    <TeamContext.Provider value={contextValue}>
      {children}
    </TeamContext.Provider>
  );
}

// Custom hook to use team context
export function useTeam(): TeamContextType {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}

export default TeamContext;
