import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import LoadingIndicator from '../../components/common/LoadingIndicator';

const CallbackPage: React.FC = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingIndicator />
          <p className="mt-4 text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Auth0 Error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Authentication Error
            </h2>
            <p className="text-red-600 mb-4">{error.message}</p>
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-red-700">Debug Info</summary>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                URL: {window.location.href}
              </pre>
            </details>
            <button
              onClick={() => window.location.href = '/login'}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default CallbackPage;