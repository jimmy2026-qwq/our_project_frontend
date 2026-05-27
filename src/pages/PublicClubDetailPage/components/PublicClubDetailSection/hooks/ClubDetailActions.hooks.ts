import { useClubApplicationActions } from './ClubApplicationActions.hooks';
import { useClubContributionTitleActions } from './ClubContributionTitleActions.hooks';
import type { ClubDetailActionContext } from './ClubDetailActions.types';
import { useClubMemberAdminActions } from './ClubMemberAdminActions.hooks';
import { useClubTournamentInvitationActions } from './ClubTournamentInvitationActions.hooks';

export function useClubDetailActions({
  confirmDanger,
  data,
  notifyMutationResult,
  onRefreshDetail,
  profile,
  workbench,
}: ClubDetailActionContext) {
  const actionContext = {
    confirmDanger,
    data,
    notifyMutationResult,
    onRefreshDetail,
    profile,
    workbench,
  };
  const applicationActions = useClubApplicationActions(actionContext);
  const tournamentInvitationActions =
    useClubTournamentInvitationActions(actionContext);
  const memberAdminActions = useClubMemberAdminActions(actionContext);
  const contributionTitleActions =
    useClubContributionTitleActions(actionContext);

  return {
    ...applicationActions,
    ...tournamentInvitationActions,
    ...memberAdminActions,
    ...contributionTitleActions,
  };
}
