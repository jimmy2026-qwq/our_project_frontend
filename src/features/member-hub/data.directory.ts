import { clubsApi } from '@/api/clubs';
import type { AuthSession } from '@/domain/auth';
import type { ClubSummary } from '@/domain/public';

import {
  buildFallbackDirectory,
  createClubsById,
  type MemberHubOperator,
  type MemberHubOperatorDirectory,
  uniqueById,
} from './data.shared';

export async function loadMemberHubOperatorDirectory(
  session: AuthSession | null,
): Promise<MemberHubOperatorDirectory> {
  const fallback = buildFallbackDirectory(session);
  const currentOperatorId = session?.user.operatorId ?? session?.user.userId;
  const currentDisplayName = session?.user.displayName ?? 'Current User';

  try {
    const currentOperatorClubs = currentOperatorId
      ? await clubsApi.getClubs({
          adminId: currentOperatorId,
          activeOnly: true,
          limit: 20,
          offset: 0,
        })
      : { items: [] as ClubSummary[] };
    const operators: MemberHubOperator[] = [];

    if (currentOperatorId && session?.user.roles.isRegisteredPlayer) {
      const isAdmin = currentOperatorClubs.items.length > 0;
      operators.push({
        id: currentOperatorId,
        label: `${currentDisplayName} / ${isAdmin ? 'Club Admin' : 'Registered Player'}`,
        role: isAdmin ? 'ClubAdmin' : 'RegisteredPlayer',
        playerId: currentOperatorId,
        managedClubIds: isAdmin ? currentOperatorClubs.items.map((club) => club.id) : [],
      });
    }

    if (operators.length === 0) {
      return fallback;
    }

    return {
      items: uniqueById(operators),
      clubsById: createClubsById(currentOperatorClubs.items),
      source: 'api',
    };
  } catch (error) {
    return {
      ...fallback,
      warning: error instanceof Error ? error.message : 'Unable to load operator directory.',
    };
  }
}
