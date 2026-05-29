import { useEffect, useState } from 'react';

import { ListClubMembersAPI } from '@/api/club';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import { toPlayerProfile } from '../../../objects/ClubDetailPlayer.mappers';
import type { ClubPublicProfile } from '../../../objects/PublicClubDetailPage.types';

export function useClubMemberNames(profile: ClubPublicProfile | null) {
  const [clubMemberNames, setClubMemberNames] = useState<string[]>([]);

  useEffect(() => {
    if (!profile) {
      setClubMemberNames([]);
      return;
    }

    let cancelled = false;

    void sendAPI(new ListClubMembersAPI(profile.id, { limit: 100, offset: 0 }))
      .then((envelope) => mapEnvelope(envelope, toPlayerProfile))
      .then((envelope) => {
        if (!cancelled) {
          setClubMemberNames(
            envelope.items
              .map((item) => item.displayName)
              .filter((name) => name.trim().length > 0),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setClubMemberNames([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [profile]);

  return { clubMemberNames };
}
