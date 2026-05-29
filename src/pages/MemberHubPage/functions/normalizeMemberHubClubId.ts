import type {
  MemberHubOperatorDirectory,
  MemberHubState,
} from '../objects/MemberHub.types';
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
