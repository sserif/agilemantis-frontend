import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useTeam } from '../../context/TeamContext';
import { useProject } from '../../context/ProjectContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';

const TeamPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { teams } = useTeam();
  const { projects, fetchProjects, isLoading: projectsLoading } = useProject();

  // Find the current team from teams context
  const team = teams.find(t => t.id === teamId);
  
  // Load projects for this team
  useEffect(() => {
    if (teamId) {
      fetchProjects(teamId);
    }
  }, [teamId]); // Removed fetchProjects from dependencies

  const isLoading = projectsLoading;

  // Get projects for this team
  const teamProjects = projects.filter(p => p.teamId === teamId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingIndicator size="lg" text="Loading team..." />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Team not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The team you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              {team.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {team.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {team.description}
              </p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{team.members?.length || 0} members</span>
                <span>•</span>
                <span>{teamProjects.length} projects</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Link
              to={`/teams/${teamId}/settings`}
              className="btn bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
              </svg>
              Settings
            </Link>
            <button className="btn btn-primary">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="flex space-x-4">
        <Link
          to={`/teams/${teamId}`}
          className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900 rounded-lg"
        >
          Overview
        </Link>
        <Link
          to={`/teams/${teamId}/members`}
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Members
        </Link>
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Projects
          </h2>
          <button className="btn btn-primary">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
            </svg>
            New Project
          </button>
        </div>

        {teamProjects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No projects</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new project for this team.</p>
            <div className="mt-6">
              <button className="btn btn-primary">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                Create Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teamProjects.map((project) => (
              <Link
                key={project.id}
                to={`/teams/${teamId}/projects/${project.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-600 rounded text-white text-sm flex items-center justify-center mr-3">
                      {project.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {project.name}
                      </h3>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        active
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {project.description || 'No description available'}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{project.members?.length || 0} members</span>
                  <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
