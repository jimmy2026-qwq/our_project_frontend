import { useEffect, useState } from 'react';

import { ListPlayersAPI } from '@/api/player';
import { PlayerStatus } from '@/objects';
import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';
import type { AuthContextSession } from '@/app/auth/AuthContextSession';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import { toPlayerProfile } from '../../../../../functions/toTournamentDetailPlayerData';

export function useTournamentPlayerOptions(session: AuthContextSession | null) {
  const [availablePlayers, setAvailablePlayers] = useState<PlayerProfile[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const canManageTournament =
      !!session?.user.roles.isRegisteredPlayer &&
      (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

    if (!canManageTournament) {
      setAvailablePlayers([]);
      setSelectedPlayerId(null);
      return;
    }

    void sendAPI(
      new ListPlayersAPI({
        status: PlayerStatus.Active,
        limit: 100,
        offset: 0,
      }),
    )
      .then((envelope) => mapEnvelope(envelope, toPlayerProfile))
      .then((envelope) => {
        if (!cancelled) {
          setAvailablePlayers(envelope.items);
          setSelectedPlayerId(
            (current) => current ?? envelope.items[0]?.playerId ?? null,
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailablePlayers([]);
          setSelectedPlayerId(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  return { availablePlayers, selectedPlayerId, setSelectedPlayerId };
}
