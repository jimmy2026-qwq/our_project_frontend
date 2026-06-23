import { useEffect, useState } from 'react';

import { ListClubTournamentsAPI, GetPublicClubAPI } from '@/api/club';

import { GetPlayerAPI } from '@/api/player/GetPlayerAPI';
import { ClubTournamentParticipationStatuses, ClubTournamentScope } from '@/objects/club';
import { ClubTournamentSources } from '@/pages/shared_objects/club/ClubTournamentSource';
import type { ClubDetailState } from '@/pages/PublicClubDetailPage/objects/state/ClubDetailState';
import type { ClubPublicProfile } from '@/pages/shared_objects/club/ClubPublicProfile';
import type { PublicHallViewerContext } from '@/pages/PublicClubDetailPage/objects/context/PublicHallViewerContext';
import type { TournamentPublicProfile } from '@/pages/shared_objects/tournament/TournamentPublicProfile';
import { sendAPI } from '@/system/api';

import { toPublicClubDetail } from '../functions/toClubDetailClubData';

async function resolveClubViewerId(
  fallbackViewerId?: string,
  isRegisteredPlayer = false,
) {
  if (!fallbackViewerId || !isRegisteredPlayer) {
    return fallbackViewerId;
  }

  try {
    const player = await sendAPI(new GetPlayerAPI(fallbackViewerId));
    return player.playerId || fallbackViewerId;
  } catch {
    return fallbackViewerId;
  }
}

async function loadClubTournaments(
  clubId: string,
  viewerId?: string,
): Promise<ClubPublicProfile['activeTournaments']> {
  try {
    const envelope = await sendAPI(
      new ListClubTournamentsAPI(clubId, {
        scope: ClubTournamentScope.All,
        viewer: viewerId,
        limit: 100,
        offset: 0,
      }),
    );

    return envelope.items
      .filter((item) => item.canViewDetail)
      .map((item) => ({
        id: item.tournamentId,
        name: item.name,
        status: item.status as TournamentPublicProfile['status'],
        source:
          item.clubParticipationStatus ===
          ClubTournamentParticipationStatuses.Participating
            ? ClubTournamentSources.Recent
            : ClubTournamentSources.Invited,
        participationStatus: item.clubParticipationStatus,
        canSubmitLineup: item.canSubmitLineup,
        canDecline: item.canDecline,
      }));
  } catch {
    return [];
  }
}

async function loadClubDetail(
  clubId: string,
  viewerId?: string,
): Promise<ClubDetailState> {
  try {
    const [item, activeTournaments] = await Promise.all([
      sendAPI(new GetPublicClubAPI(clubId)).then(toPublicClubDetail),
      loadClubTournaments(clubId, viewerId),
    ]);
    return {
      item: {
        ...item,
        activeTournaments,
      },
    };
  } catch (error) {
    return {
      item: null,
      warning:
        error instanceof Error ? error.message : 'Unable to load club detail.',
    };
  }
}

export function useClubDetail(
  clubId: string | undefined,
  context?: PublicHallViewerContext,
) {
  const [state, setState] = useState<ClubDetailState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const operatorId =
    context?.session?.user.operatorId ?? context?.session?.user.userId;
  const isRegisteredPlayer =
    context?.session?.user.roles.isRegisteredPlayer ?? false;

  useEffect(() => {
    if (!clubId) {
      setState({ item: null, warning: 'Club id is missing.' });
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void resolveClubViewerId(operatorId, isRegisteredPlayer)
      .then((viewerId) => loadClubDetail(clubId, viewerId))
      .then((result) => {
        if (!cancelled) {
          setState(result);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clubId, isRegisteredPlayer, operatorId, reloadKey]);

  return {
    state,
    isLoading,
    refresh: () => setReloadKey((current) => current + 1),
  };
}
