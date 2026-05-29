import type { ClubDetailActionContext } from './useClubDetailActions.types';
import { useClubContributionMemberActions } from './useClubContributionMemberActions';
import { useClubTitleActions } from './useClubTitleActions';

export function useClubContributionTitleActions(
  actionContext: ClubDetailActionContext,
) {
  const { handleAdjustContribution } =
    useClubContributionMemberActions(actionContext);
  const { handleUpdateContributionTitles, handleUpdateTitle } =
    useClubTitleActions(actionContext);

  return {
    handleAdjustContribution,
    handleUpdateTitle,
    handleUpdateContributionTitles,
  };
}
