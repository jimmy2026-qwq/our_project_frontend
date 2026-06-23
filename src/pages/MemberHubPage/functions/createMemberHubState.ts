import { EMPTY_MEMBER_HUB_OPERATOR } from '../objects/operator/MemberHubOperator';
import type { MemberHubOperatorDirectory } from '../objects/operator/MemberHubOperatorDirectory';
import type { MemberHubState } from '../objects/state/MemberHubState';

export function createMemberHubState(
  directory: MemberHubOperatorDirectory,
  preferredOperatorId?: string,
): MemberHubState {
  const activeOperator =
    directory.items.find((operator) => operator.id === preferredOperatorId) ??
    directory.items[0] ??
    EMPTY_MEMBER_HUB_OPERATOR;
  const firstClubId =
    activeOperator.managedClubIds[0] ??
    Object.keys(directory.clubsById)[0] ??
    '';

  return {
    operatorId: activeOperator.id,
    playerId: activeOperator.playerId,
    clubId: firstClubId,
  };
}
