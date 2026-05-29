import type { AuthSession } from '@/providers/auth/AuthSession';
import type { ClubSummary } from '@/pages/objects/ClubSummary';

import {
  EMPTY_MEMBER_HUB_OPERATOR,
  type MemberHubOperator,
  type MemberHubOperatorDirectory,
} from '../objects/MemberHub.types';

export function getActiveOperator(
  directory: MemberHubOperatorDirectory,
  operatorId: string,
) {
  return (
    directory.items.find((operator) => operator.id === operatorId) ??
    directory.items[0] ??
    EMPTY_MEMBER_HUB_OPERATOR
  );
}

export function getUniqueOperators(items: MemberHubOperator[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

export function getClubsById(items: ClubSummary[]) {
  return Object.fromEntries(items.map((club) => [club.id, club] as const));
}

export function getFallbackDirectory(
  session: AuthSession | null,
): MemberHubOperatorDirectory {
  const sessionOperatorId =
    session?.user.operatorId ?? session?.user.userId ?? '';
  const sessionDisplayName = session?.user.displayName ?? 'Current User';
  const currentOperator =
    sessionOperatorId && session?.user.roles.isRegisteredPlayer
      ? {
          id: sessionOperatorId,
          label: `${sessionDisplayName} / Registered Player`,
          role: 'RegisteredPlayer' as const,
          playerId: sessionOperatorId,
          managedClubIds: [],
        }
      : null;

  return {
    items: currentOperator ? [currentOperator] : [],
    clubsById: {},
    source: 'api',
  };
}
