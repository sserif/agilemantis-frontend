import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types/project';
import { Team } from '../../types/team';

interface ProjectHeaderProps {
  project: Project;
  team: Team;
  currentTab: 'overview' | 'chat' | 'files' | 'members';
  actionButton?: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  team,
  currentTab,
  actionButton,
  pageTitle,
  pageDescription
}) => {
  const teamId = team.id;
  const projectId = project.id;

  const getTabClasses = (tab: string) => {
    const isActive = currentTab === tab;
    return `px-4 py-2 text-sm font-medium rounded-lg ${
      isActive
        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;
  };

  // Use page-specific title/description if provided, otherwise use project defaults
  const displayTitle = pageTitle || project.name;
  const displayDescription = pageDescription || project.description;

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              {project.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {displayTitle}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {displayDescription}
              </p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  active
                </span>
                <span>•</span>
                <span>{project.members?.length || 0} members</span>
                <span>•</span>
                <span>{project.documents?.length || 0} documents</span>
                <span>•</span>
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {actionButton && (
              <div>{actionButton}</div>
            )}
            <Link
              to={`/teams/${teamId}/projects/${projectId}/settings`}
              className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
              </svg>
              Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="flex space-x-4">
        <Link
          to={`/teams/${teamId}/projects/${projectId}`}
          className={getTabClasses('overview')}
        >
          Overview
        </Link>
        <Link
          to={`/teams/${teamId}/projects/${projectId}/chat`}
          className={getTabClasses('chat')}
        >
          Chat
        </Link>
        <Link
          to={`/teams/${teamId}/projects/${projectId}/files`}
          className={getTabClasses('files')}
        >
          Files
        </Link>
        <Link
          to={`/teams/${teamId}/projects/${projectId}/members`}
          className={getTabClasses('members')}
        >
          Members
        </Link>
      </div>
    </div>
  );
};