import { ReactNode } from 'react';
import { useAuth0 } from '../../context/Auth0Context';
import LoadingIndicator from '../common/LoadingIndicator';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Redirect to Auth0 login if not authenticated
  if (!isAuthenticated) {
    loginWithRedirect();
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator size="lg" text="Redirecting to login..." />
      </div>
    );
  }

  // Render the protected component if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;