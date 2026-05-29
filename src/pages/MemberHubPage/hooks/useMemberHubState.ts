import { useEffect, useState } from 'react';

import { ListClubsAPI } from '@/api/club/ListClubsAPI';
import { useAuth } from '@/app/auth/useAuth';
import type { ClubListQuery, ListEnvelope } from '@/objects';
import type { AuthSession } from '@/providers/auth/AuthSession';
import type { ClubSummary } from '@/pages/objects/ClubSummary';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import { createMemberHubState } from '../functions/createMemberHubState';
import {
  getClubsById,
  getFallbackDirectory,
  getUniqueOperators,
} from '../functions/getMemberHubOperator';
import {
  DEFAULT_MEMBER_HUB_STATE,
  type MemberHubOperator,
  type MemberHubOperatorDirectory,
  type MemberHubState,
} from '../objects/MemberHub.types';
import { toClubSummary } from '../objects/MemberHub.mappers';

function getClubs(filters: ClubListQuery) {
  return sendAPI(new ListClubsAPI(filters)).then(
    (envelope): ListEnvelope<ClubSummary> =>
      mapEnvelope(envelope, toClubSummary),
  );
}

async function loadMemberHubOperatorDirectory(
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

export function useMemberHubState() {
  const { session } = useAuth();
  const [directory, setDirectory] = useState<MemberHubOperatorDirectory | null>(
    null,
  );
  const [state, setState] = useState<MemberHubState>(DEFAULT_MEMBER_HUB_STATE);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const nextDirectory = await loadMemberHubOperatorDirectory(session);

      if (!cancelled) {
        setDirectory(nextDirectory);
        setState((current) =>
          createMemberHubState(
            nextDirectory,
            current.operatorId ||
              session?.user.operatorId ||
              session?.user.userId,
          ),
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  return { state, setState, directory };
}
