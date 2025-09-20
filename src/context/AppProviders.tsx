import { ReactNode, useEffect } from 'react';
import { Auth0ProviderWrapper, useAuth0 } from './Auth0Context';
import { TeamProvider, useTeam } from './TeamContext';
import { ProjectProvider } from './ProjectContext';

// Inner component that handles teams loading
function TeamsLoader({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const { fetchTeams } = useTeam();

  // Load teams when user logs in AND token is ready
  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      // Add a small delay to ensure token is stored in localStorage
      const timer = setTimeout(() => {
        const token = localStorage.getItem('auth0_id_token');
        if (token) {
          console.log('User authenticated with token, loading teams...');
          console.log('🔄 AppProviders: About to call fetchTeams()');
          fetchTeams().then(() => {
            console.log('✅ AppProviders: fetchTeams completed successfully');
          }).catch(error => {
            console.error('❌ AppProviders: Failed to load teams after login:', error);
          });
        } else {
          console.warn('User authenticated but no token found, retrying...');
          // Retry after another delay
          setTimeout(() => {
            fetchTeams().catch(error => {
              console.error('Failed to load teams on retry:', error);
            });
          }, 1000);
        }
      }, 500); // Wait 500ms for token to be stored

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, user]); // Removed fetchTeams from dependencies

  return <>{children}</>;
}

// Combined provider that manages authentication, teams, and projects
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Auth0ProviderWrapper>
      <TeamProvider>
        <ProjectProvider>
          <TeamsLoader>
            {children}
          </TeamsLoader>
        </ProjectProvider>
      </TeamProvider>
    </Auth0ProviderWrapper>
  );
}