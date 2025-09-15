import React, { lazy } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

// Layout components (not lazy loaded for immediate rendering)
import AppLayout from '../components/layout/AppLayout';

// Lazy loaded page components
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const TeamPage = lazy(() => import('../pages/team/TeamPage'));
const TeamMembersPage = lazy(() => import('../pages/team/TeamMembersPage'));
const TeamSettingsPage = lazy(() => import('../pages/team/TeamSettingsPage'));
const ProjectPage = lazy(() => import('../pages/project/ProjectPage'));
const ProjectChatPage = lazy(() => import('../pages/project/ProjectChatPage'));
const ProjectFilesPage = lazy(() => import('../pages/project/ProjectFilesPage'));
const ProjectMembersPage = lazy(() => import('../pages/project/ProjectMembersPage'));
const ProjectSettingsPage = lazy(() => import('../pages/project/ProjectSettingsPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/notfound/NotFoundPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'teams/:teamId',
        children: [
          {
            index: true,
            element: <TeamPage />,
          },
          {
            path: 'members',
            element: <TeamMembersPage />,
          },
          {
            path: 'settings',
            element: <TeamSettingsPage />,
          },
          {
            path: 'projects/:projectId',
            children: [
              {
                index: true,
                element: <ProjectPage />,
              },
              {
                path: 'chat',
                element: <ProjectChatPage />,
              },
              {
                path: 'files',
                element: <ProjectFilesPage />,
              },
              {
                path: 'members',
                element: <ProjectMembersPage />,
              },
              {
                path: 'settings',
                element: <ProjectSettingsPage />,
              },
            ],
          },
        ],
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;