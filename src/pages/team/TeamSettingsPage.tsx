import { Link, useParams } from 'react-router-dom';
import LoadingIndicator from '../../components/common/LoadingIndicator';

const TeamSettingsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const isLoading = false;

  // Placeholder team data
  const team = {
    id: teamId,
    name: 'Development Team',
    description: 'Main development team for web applications and mobile apps',
    createdAt: '2024-01-15',
    isPublic: false,
    allowGuestAccess: false,
    owner: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    },
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Save team settings - API integration pending');
  };

  const handleDeleteTeam = () => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      console.log('Delete team - API integration pending');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingIndicator size="lg" text="Loading team settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Team Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your team configuration and preferences
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="flex space-x-4">
        <Link
          to={`/teams/${teamId}`}
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Overview
        </Link>
        <Link
          to={`/teams/${teamId}/members`}
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Members
        </Link>
        <Link
          to={`/teams/${teamId}/settings`}
          className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900 rounded-lg"
        >
          Settings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              General Settings
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label htmlFor="team-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  id="team-name"
                  name="team-name"
                  defaultValue={team.name}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label htmlFor="team-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="team-description"
                  name="team-description"
                  rows={3}
                  defaultValue={team.description}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Describe your team's purpose and goals"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="public-team"
                    name="public-team"
                    type="checkbox"
                    defaultChecked={team.isPublic}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                  <label htmlFor="public-team" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                    Make team publicly visible
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="guest-access"
                    name="guest-access"
                    type="checkbox"
                    defaultChecked={team.allowGuestAccess}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                  <label htmlFor="guest-access" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                    Allow guest access to projects
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Member Permissions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Member Permissions
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Members can create projects
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow team members to create new projects
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Members can invite others
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow team members to send invitations
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={false}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Members can delete projects
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow team members to delete projects they own
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={false}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Team Information
            </h3>

            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Owner</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">{team.owner.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">
                  {new Date(team.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Team ID</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100 font-mono">{team.id}</dd>
              </div>
            </dl>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700 p-6">
            <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-4">
              Danger Zone
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Transfer Team Ownership
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Transfer this team to another team member.
                </p>
                <button className="btn text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                  Transfer Ownership
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Delete Team
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Permanently delete this team and all its projects. This cannot be undone.
                </p>
                <button
                  onClick={handleDeleteTeam}
                  className="btn text-sm bg-red-600 text-white hover:bg-red-700"
                >
                  Delete Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSettingsPage;
