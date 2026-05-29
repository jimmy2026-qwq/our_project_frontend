import { useEffect, useState } from 'react';

import { ListPlayersAPI } from '@/api/player';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';
import type { AuthSession } from '@/providers/auth/AuthSession';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import { toPlayerProfile } from '../../../../../objects/TournamentDetailPlayer.mappers';

export function useTournamentPlayerOptions(session: AuthSession | null) {
  const [availablePlayers, setAvailablePlayers] = useState<PlayerProfile[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  useEffect(() => {
    let cancelled = false;
    const canManageTournament =
      !!session?.user.roles.isRegisteredPlayer &&
      (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

    if (!canManageTournament) {
      setAvailablePlayers([]);
      setSelectedPlayerId('');
      return;
    }

    void sendAPI(
      new ListPlayersAPI({ status: 'Active', limit: 100, offset: 0 }),
    )
      .then((envelope) => mapEnvelope(envelope, toPlayerProfile))
      .then((envelope) => {
        if (!cancelled) {
          setAvailablePlayers(envelope.items);
          setSelectedPlayerId(
            (current) => current || envelope.items[0]?.playerId || '',
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailablePlayers([]);
          setSelectedPlayerId('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  return { availablePlayers, selectedPlayerId, setSelectedPlayerId };
}
