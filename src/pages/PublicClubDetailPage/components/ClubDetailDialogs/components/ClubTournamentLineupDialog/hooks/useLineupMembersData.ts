import { useEffect, useState } from 'react';

import { ListClubMembersAPI } from '@/api/club';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import { toPlayerProfile } from '../../../../../objects/ClubDetailPlayer.mappers';

interface UseLineupMembersDataParams {
  clubId: string;
  open: boolean;
  notifyWarning: (title: string, description?: string) => void;
}

export function useLineupMembersData({
  clubId,
  open,
  notifyWarning,
}: UseLineupMembersDataParams) {
  const [members, setMembers] = useState<PlayerProfile[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;
    setIsLoadingMembers(true);

    void loadClubLineupMembers(clubId)
      .then((items) => {
        if (!cancelled) {
          setMembers(items);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          notifyWarning(
            'Unable to load club members.',
            error instanceof Error ? error.message : 'Please try again.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingMembers(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clubId, notifyWarning, open]);

  return { members, isLoadingMembers };
}

async function loadClubLineupMembers(clubId: string) {
  const envelope = await sendAPI(
    new ListClubMembersAPI(clubId, { limit: 100, offset: 0 }),
  ).then((result) => mapEnvelope(result, toPlayerProfile));

  return envelope.items;
}
