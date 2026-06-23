import { useEffect, useState } from 'react';

import { ListClubsAPI } from '@/api/club';
import { useAuthContext } from '@/app/auth/useAuthContext';
import { Role, type ClubListQuery, type ListEnvelope } from '@/objects';
import { mapEnvelope } from '@/system/api';
import type { AuthContextSession } from '@/app/auth/AuthContextSession';
import { sendAPI } from '@/system/api';
import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';

import { createMemberHubState } from '../functions/createMemberHubState';
import { getClubsById, getFallbackDirectory, getUniqueOperators } from '../functions/getMemberHubOperator';
import { DEFAULT_MEMBER_HUB_STATE } from '../objects/state/MemberHubState';
import type { MemberHubOperator } from '../objects/operator/MemberHubOperator';
import type { MemberHubOperatorDirectory } from '../objects/operator/MemberHubOperatorDirectory';
import type { MemberHubState } from '../objects/state/MemberHubState';
import { toClubSummary } from '../functions/toMemberHubData';

function getClubs(filters: ClubListQuery) {
  return sendAPI(new ListClubsAPI(filters)).then(
    (envelope): ListEnvelope<ClubSummary> =>
      mapEnvelope(envelope, toClubSummary),
  );
}

async function loadMemberHubOperatorDirectory(
  session: AuthContextSession | null,
): Promise<MemberHubOperatorDirectory> {
  const fallback = getFallbackDirectory(session);
  const currentOperatorId = session?.user.operatorId ?? session?.user.userId;
  const currentDisplayName = session?.user.displayName ?? '当前用户';

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
        label: `${currentDisplayName} / ${isAdmin ? '俱乐部管理员' : '注册选手'}`,
        role: isAdmin ? Role.ClubAdmin : Role.RegisteredPlayer,
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
    };
  } catch (error) {
    return {
      ...fallback,
      warning:
        error instanceof Error
          ? error.message
          : '操作身份加载失败。',
    };
  }
}

export function useMemberHubState() {
  const { session } = useAuthContext();
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
