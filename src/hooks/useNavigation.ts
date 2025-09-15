import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

export const useNavigation = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const goToDashboard = () => navigate(ROUTES.dashboard);

  const goToTeam = (teamId: string) => navigate(ROUTES.team(teamId));

  const goToTeamMembers = (teamId: string) => navigate(ROUTES.teamMembers(teamId));

  const goToTeamSettings = (teamId: string) => navigate(ROUTES.teamSettings(teamId));

  const goToProject = (teamId: string, projectId: string) =>
    navigate(ROUTES.project(teamId, projectId));

  const goToProjectChat = (teamId: string, projectId: string) =>
    navigate(ROUTES.projectChat(teamId, projectId));

  const goToProjectFiles = (teamId: string, projectId: string) =>
    navigate(ROUTES.projectFiles(teamId, projectId));

  const goToProjectMembers = (teamId: string, projectId: string) =>
    navigate(ROUTES.projectMembers(teamId, projectId));

  const goToProjectSettings = (teamId: string, projectId: string) =>
    navigate(ROUTES.projectSettings(teamId, projectId));

  const goToSettings = () => navigate(ROUTES.settings);

  const goBack = () => navigate(-1);

  return {
    navigate,
    params,
    location,
    goToDashboard,
    goToTeam,
    goToTeamMembers,
    goToTeamSettings,
    goToProject,
    goToProjectChat,
    goToProjectFiles,
    goToProjectMembers,
    goToProjectSettings,
    goToSettings,
    goBack,
  };
};

export default useNavigation;