import { ListClubsAPI } from '@/api/club/ListClubsAPI';
import type { ClubListQuery, ListEnvelope } from '@/objects';
import type { AuthSession } from '@/providers/auth/AuthSession';
import { mapClub, type ClubSummary } from '@/pages/objects/club';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import type {
  MemberHubOperator,
  MemberHubOperatorDirectory,
} from '../objects/MemberHub.types';
import {
  getClubsById,
  getFallbackDirectory,
  getUniqueOperators,
} from './getMemberHubOperator';

function getClubs(filters: ClubListQuery) {
  return sendAPI(new ListClubsAPI(filters)).then(
    (envelope): ListEnvelope<ClubSummary> => mapEnvelope(envelope, mapClub),
  );
}

export async function loadMemberHubOperatorDirectory(
  session: AuthSession | null,
): Promise<MemberHubOperatorDirectory> {
  const fallback = getFallbackDirectory(session);
  const currentOperatorId = session?.user.operatorId ?? session?.user.userId;
  const currentDisplayName = session?.user.displayName ?? 'Current User';

  try {
    const currentOperatorClubs = currentOperatorId
      ? await getClubs({
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
        managedClubIds: isAdmin
          ? currentOperatorClubs.items.map((club) => club.id)
          : [],
      });
    }

    if (operators.length === 0) {
      return fallback;
    }

    return {
      items: getUniqueOperators(operators),
      clubsById: getClubsById(currentOperatorClubs.items),
      source: 'api',
    };
  } catch (error) {
    return {
      ...fallback,
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load operator directory.',
    };
  }
}

