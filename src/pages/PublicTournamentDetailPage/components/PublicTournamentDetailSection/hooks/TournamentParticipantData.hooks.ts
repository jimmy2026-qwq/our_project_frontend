import { useEffect, useState } from 'react';

import { GetPlayerAPI } from '@/api/player';
import { TournamentWhitelistListAPI } from '@/api/tournament';
import { mapPlayerProfile, type PlayerProfile } from '@/pages/objects/player';
import { sendAPI } from '@/system/api';

import type { DetailState, TournamentPublicProfile } from '../../../objects/types';

export function useTournamentParticipantData({
  localProfile,
  state,
}: {
  localProfile: TournamentPublicProfile | null;
  state: DetailState<TournamentPublicProfile>;
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
            sendAPI(new GetPlayerAPI(playerId)).then(mapPlayerProfile),
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
