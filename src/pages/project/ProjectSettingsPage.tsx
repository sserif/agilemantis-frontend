import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useTeam } from '../../context/TeamContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';

const ProjectSettingsPage: React.FC = () => {
  const { teamId, projectId } = useParams<{ teamId: string; projectId: string }>();
  const { projects, fetchProjects, isLoading: projectsLoading } = useProject();
  const { teams } = useTeam();

  // Find the current project
  const project = projects.find(p => p.id === projectId && p.teamId === teamId);
  const team = teams.find(t => t.id === teamId);

  // Load projects for this team if not already loaded
  useEffect(() => {
    if (teamId && (!projects.some(p => p.teamId === teamId))) {
      fetchProjects(teamId);
    }
  }, [teamId, projects]); // Removed fetchProjects from dependencies

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingIndicator size="lg" text="Loading project settings..." />
      </div>
    );
  }

  if (!project || !team) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Project not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Project Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage project configuration and settings
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            General Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                defaultValue={project.name}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                defaultValue={project.description}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Visibility
              </label>
              <select
                defaultValue="private"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="private">Private</option>
                <option value="team">Team Only</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Project Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Project Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Last Updated:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Project ID:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono">
                {projectId || 'project-123'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Team ID:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono">
                {teamId || 'team-456'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Storage Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  File Storage
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage project file storage and limits
                </p>
              </div>
              <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Configure
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Storage Used
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  2.4 GB / 10 GB
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-200 dark:border-red-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
            Danger Zone
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Archive Project
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Archive this project to make it read-only
                </p>
              </div>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Archive
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Delete Project
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Permanently delete this project and all its data
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsPage;
