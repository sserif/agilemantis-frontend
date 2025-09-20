import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { useTeam } from '../../context/TeamContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { ProjectHeader } from '../../components/project';

const ProjectPage: React.FC = () => {
  const { teamId, projectId } = useParams<{ teamId: string; projectId: string }>();
  const { projects, fetchProjects, isLoading: projectsLoading } = useProject();
  const { teams } = useTeam();

  // Find the current project and team
  const project = projects.find(p => p.id === projectId && p.teamId === teamId);
  const team = teams.find(t => t.id === teamId);

  // Load projects for this team if not already loaded
  useEffect(() => {
    if (teamId && (!projects.some(p => p.teamId === teamId))) {
      fetchProjects(teamId);
    }
  }, [teamId, projects]); // Removed fetchProjects from dependencies

  const isLoading = projectsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingIndicator size="lg" text="Loading project..." />
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

  // Placeholder recent activity data
  const recentActivity = [
    {
      id: '1',
      type: 'file_upload',
      user: 'Jane Smith',
      message: 'uploaded design-specs.pdf',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'chat_message',
      user: 'Mike Johnson',
      message: 'shared some insights about the API design',
      timestamp: '4 hours ago',
    },
    {
      id: '3',
      type: 'member_join',
      user: 'Sarah Wilson',
      message: 'joined the project',
      timestamp: '1 day ago',
    },
  ];

  // Placeholder files data
  const recentFiles = [
    {
      id: '1',
      name: 'design-specs.pdf',
      size: '2.4 MB',
      uploadedBy: 'Jane Smith',
      uploadedAt: '2 hours ago',
      type: 'pdf',
    },
    {
      id: '2',
      name: 'api-documentation.md',
      size: '156 KB',
      uploadedBy: 'Mike Johnson',
      uploadedAt: '1 day ago',
      type: 'markdown',
    },
    {
      id: '3',
      name: 'wireframes.sketch',
      size: '8.7 MB',
      uploadedBy: 'Sarah Wilson',
      uploadedAt: '2 days ago',
      type: 'sketch',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingIndicator size="lg" text="Loading project..." />
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'file_upload':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
          </svg>
        );
      case 'chat_message':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
          </svg>
        );
      case 'member_join':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
          </svg>
        );
    }
  };

  return (
    <>
      {/* Project Header */}
      <ProjectHeader 
        project={project} 
        team={team} 
        currentTab="overview" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Recent Activity
            </h3>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="font-medium">{activity.user}</span> {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                to={`/teams/${teamId}/projects/${projectId}/chat`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium"
              >
                View all activity →
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to={`/teams/${teamId}/projects/${projectId}/chat`}
                className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200"
              >
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Start Chat</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ask AI about your project</p>
                </div>
              </Link>

              <Link
                to={`/teams/${teamId}/projects/${projectId}/files`}
                className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Upload Files</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add documents to project</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Project Stats
            </h3>

            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Total Documents</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{project.documents?.length || 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Members</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{project.members?.length || 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Last Activity</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{new Date(project.updatedAt).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Owner</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">{project.ownerId}</dd>
              </div>
            </dl>
          </div>

          {/* Recent Files */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Recent Files
              </h3>
              <Link
                to={`/teams/${teamId}/projects/${projectId}/files`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentFiles.map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {file.size} • {file.uploadedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectPage;
