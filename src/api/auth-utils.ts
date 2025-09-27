// Auth0 token refresh utilities
import { Auth0ContextType } from '../context/Auth0Context';
import { setTokenRefreshStatus } from '../components/common/TokenRefreshIndicator';

// Store reference to Auth0 context for use in interceptors
let auth0Instance: Auth0ContextType | null = null;

export const setAuth0Instance = (instance: Auth0ContextType) => {
  auth0Instance = instance;
};

export const getAuth0Instance = () => auth0Instance;

// Token refresh function for use in interceptors
export const refreshAuthToken = async (): Promise<string | null> => {
  if (!auth0Instance) {
    console.warn('Auth0 instance not available for token refresh');
    return null;
  }

  try {
    console.log('🔄 Attempting to refresh Auth0 token...');
    setTokenRefreshStatus(true); // Show refresh indicator
    
    const newToken = await auth0Instance.getAccessTokenSilently();
    
    // Update localStorage with new token
    localStorage.setItem('auth0_id_token', newToken);
    console.log('✅ Auth0 token refreshed successfully');
    
    setTokenRefreshStatus(false); // Hide refresh indicator
    return newToken;
  } catch (error) {
    console.error('❌ Failed to refresh Auth0 token:', error);
    setTokenRefreshStatus(false); // Hide refresh indicator
    
    // If refresh fails, redirect to login
    try {
      localStorage.removeItem('auth0_id_token');
      auth0Instance.loginWithRedirect();
    } catch (loginError) {
      console.error('❌ Failed to redirect to login:', loginError);
      // Fallback: redirect manually
      window.location.href = '/login';
    }
    
    return null;
  }
};