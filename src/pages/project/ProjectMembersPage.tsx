import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useTeam } from '../../context/TeamContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { ProjectHeader } from '../../components/project';

const ProjectMembersPage: React.FC = () => {
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
        <LoadingIndicator size="lg" text="Loading project members..." />
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

  const members = project.members || [];

  return (
    <>
      {/* Project Header */}
      <ProjectHeader 
        project={project} 
        team={team} 
        currentTab="members" 
        pageTitle={`${project.name} Members`}
        pageDescription="Manage project members and permissions"
        actionButton={
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Invite Member
          </button>
        }
      />

      {/* Members List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Members ({members.length})
          </h2>

          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {member.user.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.role === 'owner'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : member.role === 'admin'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : member.role === 'member'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                      {member.role}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Members Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Invite New Members
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
                <option value="viewer">Viewer</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Send Invitation
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectMembersPage;
