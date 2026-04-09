import { authApi } from '@/api/auth';
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

    const summary =
      operators.some((operator) => operator.role === 'ClubAdmin')
        ? null
        : await authApi.getDemoSummary({
            bootstrapIfMissing: false,
            refreshDerived: false,
          });
    const recommendedOperatorId = summary?.recommendedOperatorId?.trim();
    const recommendedClubs =
      recommendedOperatorId && recommendedOperatorId !== currentOperatorId
        ? await clubsApi.getClubs({
            adminId: recommendedOperatorId,
            activeOnly: true,
            limit: 20,
            offset: 0,
          })
        : { items: [] as ClubSummary[] };

    if (recommendedOperatorId && recommendedOperatorId !== currentOperatorId && recommendedClubs.items.length > 0) {
      operators.push({
        id: recommendedOperatorId,
        label: 'Demo Admin / Club Admin',
        role: 'ClubAdmin',
        playerId: recommendedOperatorId,
        managedClubIds: recommendedClubs.items.map((club) => club.id),
      });
    }

    if (operators.length === 0) {
      return fallback;
    }

    return {
      items: uniqueById(operators),
      clubsById: createClubsById([...currentOperatorClubs.items, ...recommendedClubs.items]),
      source: 'api',
    };
  } catch (error) {
    return {
      ...fallback,
      warning: error instanceof Error ? error.message : 'Operator directory fallback to mock.',
    };
  }
}
