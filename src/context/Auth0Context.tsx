import React, { createContext, useContext, ReactNode } from 'react';
import { Auth0Provider, useAuth0 as useAuth0Hook, Auth0ProviderOptions } from '@auth0/auth0-react';
import { setAuth0Instance } from '../api/auth-utils';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI || `${window.location.origin}/callback`;

// Debug logging
console.log('Auth0 Config:', { 
  domain, 
  clientId: clientId ? `${clientId.substring(0, 4)}...` : 'missing',
  audience: audience || 'not set',
  redirectUri 
});

const auth0Config: Auth0ProviderOptions = {
  domain,
  clientId,
  authorizationParams: {
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    ...(audience && { audience: audience }),
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true,
};

interface Auth0ContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  loginWithRedirect: () => void;
  logout: () => void;
  getAccessTokenSilently: () => Promise<string>;
}

// Export the type for use in other files
export type { Auth0ContextType };

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

export const useAuth0 = (): Auth0ContextType => {
  const context = useContext(Auth0Context);
  if (!context) {
    throw new Error('useAuth0 must be used within an Auth0Provider');
  }
  return context;
};

interface Auth0ProviderWrapperProps {
  children: ReactNode;
}

export const Auth0ProviderWrapper: React.FC<Auth0ProviderWrapperProps> = ({ children }) => {
  return (
    <Auth0Provider {...auth0Config}>
      <Auth0ContextProvider>{children}</Auth0ContextProvider>
    </Auth0Provider>
  );
};

const Auth0ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    isLoading,
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0Hook();

  // Store ID token in localStorage when user is authenticated
  React.useEffect(() => {
    const getAndStoreToken = async () => {
      console.log('Auth0 token check:', { isAuthenticated, isLoading });
      if (isAuthenticated && !isLoading) {
        try {
          console.log('Getting ID token claims...');
          const idTokenClaims = await getIdTokenClaims();
          console.log('ID token claims:', idTokenClaims);
          
          if (idTokenClaims?.__raw) {
            localStorage.setItem('auth0_id_token', idTokenClaims.__raw);
            console.log('Auth0 ID token stored successfully:', idTokenClaims.__raw.substring(0, 50) + '...');
          } else {
            console.warn('No __raw token found in claims, trying access token...');
            // Fallback to access token if ID token not available
            try {
              const accessToken = await getAccessTokenSilently();
              localStorage.setItem('auth0_id_token', accessToken);
              console.log('Auth0 access token stored as fallback:', accessToken.substring(0, 50) + '...');
            } catch (accessError) {
              console.error('Failed to get access token as fallback:', accessError);
            }
          }
        } catch (error) {
          console.error('Failed to get Auth0 ID token:', error);
          localStorage.removeItem('auth0_id_token');
        }
      } else {
        localStorage.removeItem('auth0_id_token');
      }
    };

    getAndStoreToken();
  }, [isAuthenticated, isLoading, getIdTokenClaims]);

  const value: Auth0ContextType = {
    isLoading,
    isAuthenticated,
    user,
    loginWithRedirect,
    logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
    getAccessTokenSilently,
  };

  // Register this Auth0 instance for use in API interceptors
  React.useEffect(() => {
    if (!isLoading) {
      setAuth0Instance(value);
    }
  }, [isLoading, value]);

  return <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>;
};