import { useEffect, useState } from 'react';

import { ListClubContributionAuditsAPI } from '@/api/club';
import type {
  ClubContributionAuditEntry,
  ListEnvelope,
} from '@/objects';
import type { AuthSession } from '@/providers/auth/AuthSession';
import { sendAPI } from '@/system/api';

import type { ClubPublicProfile } from '../../../objects/types';

interface UseClubContributionChangesParams {
  profile: ClubPublicProfile | null;
  session: AuthSession | null;
  canViewContributionChanges: boolean;
}

export function useClubContributionChanges({
  profile,
  session,
  canViewContributionChanges,
}: UseClubContributionChangesParams) {
  const [contributionChanges, setContributionChanges] = useState<
    ClubContributionAuditEntry[]
  >([]);
  const [isContributionChangesLoading, setIsContributionChangesLoading] =
    useState(false);
  const [contributionChangesRefreshKey, setContributionChangesRefreshKey] =
    useState(0);

  useEffect(() => {
    if (!profile || !canViewContributionChanges) {
      setContributionChanges([]);
      setIsContributionChangesLoading(false);
      return;
    }

    const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';

    if (!operatorId) {
      setContributionChanges([]);
      setIsContributionChangesLoading(false);
      return;
    }

    let cancelled = false;
    setIsContributionChangesLoading(true);

    void sendAPI<ListEnvelope<ClubContributionAuditEntry>>(
      new ListClubContributionAuditsAPI(profile.id, {
        operatorId,
        limit: 100,
        offset: 0,
      }),
    )
      .then((envelope) => {
        if (!cancelled) {
          setContributionChanges(envelope.items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContributionChanges([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsContributionChangesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [canViewContributionChanges, contributionChangesRefreshKey, profile, session]);

  return {
    contributionChanges,
    isContributionChangesLoading,
    setContributionChangesRefreshKey,
  };
}
