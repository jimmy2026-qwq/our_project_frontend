import { useEffect, useState } from 'react';

import { GetPublicTournamentAPI } from '@/api/publicquery';
import { TournamentGetAPI } from '@/api/tournament';
import type { AuthSession } from '@/providers/auth/AuthSession';
import { sendAPI } from '@/system/api';

import { mapTournamentDetailFromAdminView } from '../../../objects/data.detail.admin';
import { mapPublicTournamentDetail } from '../../../objects/mappers';
import type { DetailState, TournamentPublicProfile } from '../../../objects/types';

export async function loadTournamentProfileForWorkbench(tournamentId: string) {
  try {
    return await sendAPI(new GetPublicTournamentAPI(tournamentId)).then(
      mapPublicTournamentDetail,
    );
  } catch {
    const adminView = await sendAPI(new TournamentGetAPI(tournamentId));
    return mapTournamentDetailFromAdminView(adminView);
  }
}

function mergeTournamentProfiles(
  incoming: TournamentPublicProfile,
  previous?: TournamentPublicProfile | null,
): TournamentPublicProfile {
  if (!previous) {
    return incoming;
  }

  const previousStagesById = new Map(
    (previous.stages ?? []).map((stage) => [stage.stageId, stage]),
  );

  return {
    ...previous,
    ...incoming,
    stages: (incoming.stages ?? []).map((stage) => {
      const previousStage = previousStagesById.get(stage.stageId);

      return previousStage
        ? {
            ...previousStage,
            ...stage,
            archivedTableCount:
              stage.archivedTableCount ?? previousStage.archivedTableCount,
            standings: stage.standings ?? previousStage.standings,
            bracket: stage.bracket ?? previousStage.bracket,
          }
        : stage;
    }),
  };
}

export function useTournamentProfileData({
  state,
  session,
}: {
  state: DetailState<TournamentPublicProfile>;
  session: AuthSession | null;
}) {
  const [localProfile, setLocalProfile] =
    useState<TournamentPublicProfile | null>(state.item);

  useEffect(() => {
    setLocalProfile(state.item);
  }, [state.item]);

  useEffect(() => {
    const currentProfile = state.item;
    const canManageTournament =
      !!session?.user.roles.isRegisteredPlayer &&
      (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

    if (!canManageTournament || !currentProfile?.id) {
      return;
    }

    let cancelled = false;

    void sendAPI(new TournamentGetAPI(currentProfile.id))
      .then((detail) => {
        if (!cancelled) {
          const adminProfile = mapTournamentDetailFromAdminView(detail);
          setLocalProfile((current) =>
            mergeTournamentProfiles(adminProfile, current ?? currentProfile),
          );
        }
      })
      .catch(() => {
        // Keep the current profile when the admin detail endpoint is temporarily unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [session, state.item]);

  return { localProfile, setLocalProfile };
}
