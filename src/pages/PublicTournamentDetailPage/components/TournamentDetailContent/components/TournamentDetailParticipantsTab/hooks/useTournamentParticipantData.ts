import { useEffect, useState } from 'react';

import { GetPlayerAPI } from '@/api/player';
import { TournamentWhitelistListAPI } from '@/api/tournament';
import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';
import { sendAPI } from '@/system/api';

import type { TournamentDetailState } from '@/pages/PublicTournamentDetailPage/objects/state/TournamentDetailState';
import type { TournamentPublicProfile } from '@/pages/shared_objects/tournament/TournamentPublicProfile';
import { toPlayerProfile } from '../../../../../functions/toTournamentDetailPlayerData';

export function useTournamentParticipantData({
  localProfile,
  state,
}: {
  localProfile: TournamentPublicProfile | null;
  state: TournamentDetailState;
}) {
  const [participantPlayers, setParticipantPlayers] = useState<PlayerProfile[]>(
    [],
  );

  useEffect(() => {
    const currentProfile = localProfile ?? state.item;

    if (!currentProfile?.id) {
      setParticipantPlayers([]);
      return;
    }

    let cancelled = false;
    const tournamentId = currentProfile.id;

    async function loadParticipantPlayers() {
      try {
        const envelope = await sendAPI(
          new TournamentWhitelistListAPI(tournamentId, {
            participantKind: 'Player',
            limit: 100,
            offset: 0,
          }),
        );
        const playerIds = envelope.items
          .map((entry) => entry.playerId)
          .filter((playerId): playerId is string => !!playerId);
        const players = await Promise.all(
          Array.from(new Set(playerIds)).map((playerId) =>
            sendAPI(new GetPlayerAPI(playerId)).then(toPlayerProfile),
          ),
        );

        if (!cancelled) {
          setParticipantPlayers(players);
        }
      } catch {
        if (!cancelled) {
          setParticipantPlayers([]);
        }
      }
    }

    void loadParticipantPlayers();

    return () => {
      cancelled = true;
    };
  }, [localProfile, state.item]);

  return { participantPlayers, setParticipantPlayers };
}
