import type { MemberHubOperatorDirectory } from '../objects/operator/MemberHubOperatorDirectory';
import type { MemberHubState } from '../objects/state/MemberHubState';
import { getActiveOperator } from './getMemberHubOperator';

export function normalizeMemberHubClubId(
  directory: MemberHubOperatorDirectory,
  state: MemberHubState,
) {
  const activeOperator = getActiveOperator(directory, state.operatorId);

  if (activeOperator.managedClubIds.includes(state.clubId)) {
    return state.clubId;
  }

  return (
    activeOperator.managedClubIds[0] ??
    Object.keys(directory.clubsById)[0] ??
    ''
  );
}
