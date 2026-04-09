import { useEffect, useMemo, useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';

import { authApi } from '@/api/auth';
import { clubsApi } from '@/api/clubs';
import { operationsApi } from '@/api/operations';
import { publicApi } from '@/api/public';
import type { AuthSession } from '@/domain/auth';
import type { ClubSummary, TournamentPublicProfile } from '@/domain/public';

import type { DetailState } from '../types';
import type { TournamentDetailTableItem, TournamentDetailWorkbenchState } from './tournament-detail.types';

export function getTableStatusLabel(status: string) {
  switch (status) {
    case 'WaitingPreparation':
      return '等待开始';
    case 'InProgress':
      return '对局中';
    case 'Scoring':
      return '结算中';
    case 'AppealPending':
    case 'AppealInProgress':
      return '申诉处理中';
    case 'Archived':
      return '已结束';
    default:
      return status;
  }
}

function getTableSortWeight(status: string) {
  switch (status) {
    case 'InProgress':
    case 'Scoring':
    case 'AppealPending':
    case 'AppealInProgress':
      return 0;
    case 'Archived':
      return 1;
    case 'WaitingPreparation':
      return 2;
    default:
      return 3;
  }
}

export function getTableStatusTone(status: string) {
  switch (status) {
    case 'InProgress':
      return 'success' as const;
    case 'Scoring':
      return 'warning' as const;
    case 'AppealPending':
    case 'AppealInProgress':
      return 'danger' as const;
    case 'Archived':
      return 'neutral' as const;
    case 'WaitingPreparation':
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}

interface UseTournamentDetailWorkbenchParams {
  state: DetailState<TournamentPublicProfile>;
  session: AuthSession | null;
  navigate: NavigateFunction;
  onScheduleSuccess?: () => void;
}

export function useTournamentDetailWorkbench({
  state,
  session,
  navigate,
  onScheduleSuccess,
}: UseTournamentDetailWorkbenchParams) {
  const [availableClubs, setAvailableClubs] = useState<ClubSummary[]>([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [isSubmittingTournamentAction, setIsSubmittingTournamentAction] = useState(false);
  const [publishBlockedOpen, setPublishBlockedOpen] = useState(false);
  const [localProfile, setLocalProfile] = useState<TournamentPublicProfile | null>(state.item);
  const [tables, setTables] = useState<TournamentDetailTableItem[]>([]);
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  useEffect(() => {
    setLocalProfile(state.item);
  }, [state.item]);

  useEffect(() => {
    let cancelled = false;
    const canManageTournament =
      !!session?.user.roles.isRegisteredPlayer &&
      (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

    const loadClubs = canManageTournament
      ? clubsApi.getClubs({ limit: 100, offset: 0 })
      : publicApi.getPublicClubs();

    void loadClubs
      .then((envelope) => {
        if (!cancelled) {
          setAvailableClubs(envelope.items);
          if (canManageTournament) {
            setSelectedClubId((current) => current || envelope.items[0]?.id || '');
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
            const envelope = await operationsApi.getTournamentTables(currentProfile.id, stage.stageId, {
              limit: 100,
              offset: 0,
            });

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
        new Set(tables.flatMap((table) => table.playerIds).filter((playerId) => !(playerId in playerNames))),
      );

      if (missingIds.length === 0) {
        return;
      }

      const entries = await Promise.all(
        missingIds.map(async (playerId) => {
          try {
            const player = await authApi.getPlayer(playerId);
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

  const profile = localProfile ?? state.item;
  const operatorId = session?.user.operatorId ?? session?.user.userId;

  const workbench = useMemo<TournamentDetailWorkbenchState | null>(() => {
    if (!profile) {
      return null;
    }

    const canManageTournament =
      !!session?.user.roles.isRegisteredPlayer &&
      (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);
    const canPublishTournament = canManageTournament && profile.status === 'Draft';
    const canScheduleStage =
      canManageTournament &&
      !!profile.nextStageId &&
      (profile.status === 'RegistrationOpen' || profile.status === 'InProgress');
    const invitedClubIds = profile.clubIds ?? [];
    const invitedClubs = availableClubs.filter((club) => invitedClubIds.includes(club.id));
    const selectableClubs = availableClubs.filter((club) => !invitedClubIds.includes(club.id));
    const visibleTables = [...(
      canManageTournament
        ? tables
        : tables.filter((table) =>
            table.status === 'InProgress' ||
            table.status === 'Scoring' ||
            table.status === 'AppealPending' ||
            table.status === 'AppealInProgress' ||
            table.status === 'Archived',
          )
    )].sort((left, right) => {
      const weightDelta = getTableSortWeight(left.status) - getTableSortWeight(right.status);

      if (weightDelta !== 0) {
        return weightDelta;
      }

      return left.tableCode.localeCompare(right.tableCode, 'zh-CN');
    });

    return {
      profile,
      selectedClubId,
      isSubmittingTournamentAction,
      publishBlockedOpen,
      playerNames,
      showMoreInfo,
      canManageTournament,
      canPublishTournament,
      canScheduleStage,
      invitedClubs,
      selectableClubs,
      visibleTables,
    };
  }, [
    availableClubs,
    isSubmittingTournamentAction,
    playerNames,
    profile,
    publishBlockedOpen,
    selectedClubId,
    session,
    showMoreInfo,
    tables,
  ]);

  async function handleInviteClub() {
    if (!workbench?.profile.id || !workbench.selectedClubId || !operatorId) {
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      await operationsApi.registerTournamentClub(workbench.profile.id, workbench.selectedClubId, operatorId);
      setLocalProfile((current) =>
        current
          ? {
              ...current,
              clubIds: Array.from(new Set([...(current.clubIds ?? []), workbench.selectedClubId])),
              clubCount: (current.clubCount ?? 0) + 1,
              whitelistType: current.playerCount && current.playerCount > 0 ? 'Mixed' : 'Club',
            }
          : current,
      );
      setSelectedClubId(workbench.selectableClubs.find((club) => club.id !== workbench.selectedClubId)?.id ?? '');
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  async function handlePublishTournament() {
    if (!operatorId || !workbench?.profile.id) {
      return;
    }

    if ((workbench.profile.clubIds?.length ?? 0) === 0) {
      setPublishBlockedOpen(true);
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      await operationsApi.publishTournament(workbench.profile.id, operatorId);
      setLocalProfile((current) => (current ? { ...current, status: 'RegistrationOpen' } : current));
      navigate('/public');
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  async function handleScheduleStage() {
    if (!operatorId || !workbench?.profile.id || !workbench.profile.nextStageId) {
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      await operationsApi.scheduleTournamentStage(workbench.profile.id, workbench.profile.nextStageId, operatorId);
      onScheduleSuccess?.();
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  return {
    workbench,
    setSelectedClubId,
    setPublishBlockedOpen,
    setShowMoreInfo,
    handleInviteClub,
    handlePublishTournament,
    handleScheduleStage,
  };
}
