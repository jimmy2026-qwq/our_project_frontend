import { useEffect, useState } from 'react';

import { ListClubsAPI } from '@/api/club';
import {
  GetPublicClubAPI,
  ListPublicClubsAPI,
} from '@/api/publicquery';
import { mapClub, type ClubSummary } from '@/pages/objects/club';
import type { AuthSession } from '@/providers/auth/AuthSession';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import {
  mapPublicClub,
  mapPublicClubDetail,
} from '../../../objects/mappers';
import type { DetailState, TournamentPublicProfile } from '../../../objects/types';
import {
  createFallbackClubSummary,
  mapClubPublicProfileToSummary,
} from '../../../objects/tournament-detail.workbench';

export function useTournamentClubOptions({
  localProfile,
  session,
  state,
}: {
  localProfile: TournamentPublicProfile | null;
  session: AuthSession | null;
  state: DetailState<TournamentPublicProfile>;
}) {
  const [availableClubs, setAvailableClubs] = useState<ClubSummary[]>([]);
  const [invitedClubs, setInvitedClubs] = useState<ClubSummary[]>([]);
  const [selectedClubId, setSelectedClubId] = useState('');

  useEffect(() => {
    let cancelled = false;
    const canManageTournament =
      !!session?.user.roles.isRegisteredPlayer &&
      (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

    const loadClubs = canManageTournament
      ? sendAPI(new ListClubsAPI({ limit: 100, offset: 0 })).then((envelope) =>
          mapEnvelope(envelope, mapClub),
        )
      : sendAPI(new ListPublicClubsAPI({ limit: 100, offset: 0 })).then(
          (envelope) => mapEnvelope(envelope, mapPublicClub),
        );

    void loadClubs
      .then((envelope) => {
        if (!cancelled) {
          setAvailableClubs(envelope.items);
          if (canManageTournament) {
            setSelectedClubId(
              (current) => current || envelope.items[0]?.id || '',
            );
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableClubs([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    const currentProfile = localProfile ?? state.item;
    const clubIds = currentProfile?.clubIds ?? [];

    if (clubIds.length === 0) {
      setInvitedClubs([]);
      return;
    }

    let cancelled = false;

    void Promise.all(
      clubIds.map(async (clubId) => {
        try {
          const profile = await sendAPI(new GetPublicClubAPI(clubId)).then(
            mapPublicClubDetail,
          );
          return mapClubPublicProfileToSummary(profile);
        } catch {
          return createFallbackClubSummary(clubId);
        }
      }),
    ).then((clubs) => {
      if (!cancelled) {
        setInvitedClubs(clubs);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [localProfile, state.item]);

  return {
    availableClubs,
    invitedClubs,
    selectedClubId,
    setSelectedClubId,
  };
}
