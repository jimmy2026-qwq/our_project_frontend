import { useEffect, useState } from 'react';

import { GetClubAPI } from '@/api/club';
import type { ClubRankNodeView } from '@/objects';
import { sendAPI } from '@/system/api';

import type { ClubPublicProfile } from '../../../objects/PublicClubDetailPage.types';

export function useClubRankTree(profile: ClubPublicProfile | null) {
  const [clubRankTree, setClubRankTree] = useState<ClubRankNodeView[]>([]);
  const [contributionTitleRefreshKey, setContributionTitleRefreshKey] =
    useState(0);

  useEffect(() => {
    if (!profile) {
      setClubRankTree([]);
      return;
    }

    let cancelled = false;

    void sendAPI(new GetClubAPI(profile.id))
      .then((club) => {
        if (!cancelled) {
          setClubRankTree(club.rankTree ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setClubRankTree([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [contributionTitleRefreshKey, profile]);

  return { clubRankTree, setContributionTitleRefreshKey };
}
