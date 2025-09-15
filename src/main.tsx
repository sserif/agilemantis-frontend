import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router';
import LoadingIndicator from './components/common/LoadingIndicator';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider, TeamProvider, ProjectProvider } from './context';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <TeamProvider>
          <ProjectProvider>
            <Suspense fallback={<LoadingIndicator size="lg" text="Loading application..." className="min-h-screen" />}>
              <AppRouter />
            </Suspense>
          </ProjectProvider>
        </TeamProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);