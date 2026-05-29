import { useEffect, useState } from 'react';

import { GetPublicClubAPI, ListPublicClubsAPI, ListClubsAPI } from '@/api/club';
import type { ClubSummary } from '@/pages/objects/ClubSummary';
import type { AuthSession } from '@/providers/auth/AuthSession';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import {
  toClubSummary,
  toPublicClubDetail,
  toPublicClubSummary,
} from '../../../../../objects/TournamentDetailClub.mappers';
import type {
  DetailState,
  TournamentPublicProfile,
} from '../../../../../objects/PublicTournamentDetailPage.types';
import {
  createFallbackClubSummary,
  toClubPublicProfileSummary,
} from '../../../../../functions/getTournamentClubSummary';

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
          mapEnvelope(envelope, toClubSummary),
        )
      : sendAPI(new ListPublicClubsAPI({ limit: 100, offset: 0 })).then(
          (envelope) => mapEnvelope(envelope, toPublicClubSummary),
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
            toPublicClubDetail,
          );
          return toClubPublicProfileSummary(profile);
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
