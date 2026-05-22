import { useEffect, useState } from 'react';

import type { ClubSummary } from '@/pages/objects/club';
import type { PlayerProfile } from '@/pages/objects/player';
import {
  clubsApi,
  playerApi,
  publicApi,
  tournamentApi,
} from '@/pages/PublicHall/objects/data.transport';
import { mapTournamentDetailFromAdminView } from '@/pages/PublicHall/objects/data.shared';
import type { TournamentPublicProfile } from '@/pages/PublicHall/objects';
import type { DetailState } from '@/pages/PublicHall/objects/types';
import type { AuthSession } from '@/providers/auth/AuthSession';

import type { TournamentDetailTableItem } from '../objects/tournament-detail.types';
import {
  createFallbackClubSummary,
  mapClubPublicProfileToSummary,
} from '../objects/tournament-detail.workbench';

export async function loadTournamentProfileForWorkbench(
  tournamentId: string,
) {
  try {
    return await publicApi.getPublicTournamentProfile(tournamentId);
  } catch {
    const adminView = await tournamentApi.getTournament(tournamentId);
    return mapTournamentDetailFromAdminView(adminView);
  }
}

export function useTournamentDetailWorkbenchData({
  state,
  session,
}: {
  state: DetailState<TournamentPublicProfile>;
  session: AuthSession | null;
}) {
  const [availableClubs, setAvailableClubs] = useState<ClubSummary[]>([]);
  const [invitedClubs, setInvitedClubs] = useState<ClubSummary[]>([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [localProfile, setLocalProfile] =
    useState<TournamentPublicProfile | null>(state.item);
  const [tables, setTables] = useState<TournamentDetailTableItem[]>([]);
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});
  const [participantPlayers, setParticipantPlayers] = useState<PlayerProfile[]>(
    [],
  );
  const [availablePlayers, setAvailablePlayers] = useState<PlayerProfile[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

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

    void tournamentApi
      .getTournament(currentProfile.id)
      .then((detail) => {
        if (!cancelled) {
          setLocalProfile(mapTournamentDetailFromAdminView(detail));
        }
      })
      .catch(() => {
        // Keep the current profile when the admin detail endpoint is temporarily unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [session, state.item]);

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
        const envelope = await tournamentApi.getTournamentWhitelist(
          tournamentId,
          {
            participantKind: 'Player',
            limit: 100,
            offset: 0,
          },
        );
        const playerIds = envelope.items
          .map((entry) => entry.playerId)
          .filter((playerId): playerId is string => !!playerId);
        const players = await Promise.all(
          Array.from(new Set(playerIds)).map((playerId) =>
            playerApi.getPlayer(playerId),
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

  useEffect(() => {
    let cancelled = false;
    const canManageTournament =
      !!session?.user.roles.isRegisteredPlayer &&
      (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

    const loadClubs = canManageTournament
      ? clubsApi.getClubs({ limit: 100, offset: 0 })
      : publicApi.getPublicClubs({ limit: 100, offset: 0 });

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
    let cancelled = false;
    const canManageTournament =
      !!session?.user.roles.isRegisteredPlayer &&
      (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

    if (!canManageTournament) {
      setAvailablePlayers([]);
      setSelectedPlayerId('');
      return;
    }

    void playerApi
      .getPlayers({ status: 'Active', limit: 100, offset: 0 })
      .then((envelope) => {
        if (!cancelled) {
          setAvailablePlayers(envelope.items);
          setSelectedPlayerId((current) => current || envelope.items[0]?.playerId || '');
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
          const profile = await publicApi.getPublicClubProfile(clubId);
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

  useEffect(() => {
    let cancelled = false;

    async function loadTables() {
      const currentProfile = localProfile ?? state.item;
      const stageEntries = currentProfile?.stages ?? [];

      if (!currentProfile?.id || stageEntries.length === 0) {
        if (!cancelled) {
          setTables([]);
        }
        return;
      }

      try {
        const payloads = await Promise.all(
          stageEntries.map(async (stage) => {
            const envelope = await tournamentApi.getTournamentTables(
              currentProfile.id,
              stage.stageId,
              {
                limit: 100,
                offset: 0,
              },
            );

            return envelope.items.map((table) => ({
              id: table.id,
              stageId: table.stageId,
              stageName: stage.name,
              tableCode: table.tableCode,
              status: table.status,
              playerIds: table.playerIds,
            }));
          }),
        );

        if (!cancelled) {
          setTables(payloads.flat());
        }
      } catch {
        if (!cancelled) {
          setTables([]);
        }
      }
    }

    void loadTables();

    return () => {
      cancelled = true;
    };
  }, [localProfile, state.item]);

  useEffect(() => {
    let cancelled = false;

    async function loadPlayerNames() {
      const missingIds = Array.from(
        new Set(
          tables
            .flatMap((table) => table.playerIds)
            .filter((playerId) => !(playerId in playerNames)),
        ),
      );

      if (missingIds.length === 0) {
        return;
      }

      const entries = await Promise.all(
        missingIds.map(async (playerId) => {
          try {
            const player = await playerApi.getPlayer(playerId);
            return [playerId, player.displayName] as const;
          } catch {
            return [playerId, playerId] as const;
          }
        }),
      );

      if (!cancelled) {
        setPlayerNames((current) => ({
          ...current,
          ...Object.fromEntries(entries),
        }));
      }
    }

    void loadPlayerNames();

    return () => {
      cancelled = true;
    };
  }, [playerNames, tables]);

  return {
    availableClubs,
    invitedClubs,
    localProfile,
    availablePlayers,
    participantPlayers,
    playerNames,
    selectedClubId,
    selectedPlayerId,
    tables,
    setParticipantPlayers,
    setLocalProfile,
    setSelectedClubId,
    setSelectedPlayerId,
  };
}
