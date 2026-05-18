import { useEffect, useMemo, useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';

import { clubsApi } from '@/api/club';
import { tournamentApi } from '@/api/tournament';
import { publicApi } from '@/api/publicquery';
import type { AuthSession } from '@/objects/auth';
import type { ClubSummary, TournamentPublicProfile } from '@/objects/publicquery';

import { mapTournamentDetailFromAdminView } from '../data.shared';
import type { DetailState } from '../types';
import type { TournamentDetailTableItem, TournamentDetailWorkbenchState } from './tournament-detail.types';
import { playerApi } from '@/api/player';

export function getTableStatusLabel(status: string) {
  switch (status) {
    case 'WaitingPreparation':
      return '等待准备';
    case 'InProgress':
      return '进行中';
    case 'Scoring':
      return '待结算';
    case 'AppealPending':
    case 'AppealInProgress':
      return '申诉处理中';
    case 'Archived':
      return '已归档';
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

function getNextStageMissingLineupClubNames(profile: TournamentPublicProfile, availableClubs: ClubSummary[]) {
  const invitedClubIds = profile.clubIds ?? [];
  const nextStage = profile.stages?.find((stage) => stage.stageId === profile.nextStageId);

  if (!nextStage || invitedClubIds.length === 0) {
    return [];
  }

  const submittedClubIds = new Set(
    (nextStage.lineupSubmissions ?? [])
      .filter((submission) => submission.activePlayerIds.length > 0)
      .map((submission) => submission.clubId),
  );

  return invitedClubIds
    .filter((clubId) => !submittedClubIds.has(clubId))
    .map((clubId) => availableClubs.find((club) => club.id === clubId)?.name ?? clubId);
}

function getNextStageLineupSubmissionCounts(profile: TournamentPublicProfile) {
  const nextStage = profile.stages?.find((stage) => stage.stageId === profile.nextStageId);

  if (!nextStage) {
    return {} as Record<string, number>;
  }

  return Object.fromEntries(
    (nextStage.lineupSubmissions ?? [])
      .filter((submission) => submission.activePlayerIds.length > 0)
      .map((submission) => [submission.clubId, submission.activePlayerIds.length]),
  );
}

interface UseTournamentDetailWorkbenchParams {
  state: DetailState<TournamentPublicProfile>;
  session: AuthSession | null;
  navigate: NavigateFunction;
  onScheduleSuccess?: () => void;
}

async function loadTournamentProfileForWorkbench(tournamentId: string) {
  try {
    return await publicApi.getPublicTournamentProfile(tournamentId);
  } catch {
    const adminView = await tournamentApi.getTournament(tournamentId);
    return mapTournamentDetailFromAdminView(adminView);
  }
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
  const [tournamentActionError, setTournamentActionError] = useState('');
  const [publishBlockedOpen, setPublishBlockedOpen] = useState(false);
  const [localProfile, setLocalProfile] = useState<TournamentPublicProfile | null>(state.item);
  const [tables, setTables] = useState<TournamentDetailTableItem[]>([]);
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});
  const [showMoreInfo, setShowMoreInfo] = useState(false);

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
            const envelope = await tournamentApi.getTournamentTables(currentProfile.id, stage.stageId, {
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
    const missingLineupClubNames = getNextStageMissingLineupClubNames(profile, availableClubs);
    const lineupSubmissionCounts = getNextStageLineupSubmissionCounts(profile);
    const submittedLineupClubIds = Object.keys(lineupSubmissionCounts);
    const isWaitingForLineups =
      canManageTournament &&
      !!profile.nextStageId &&
      (profile.status === 'RegistrationOpen' || profile.status === 'InProgress') &&
      missingLineupClubNames.length > 0;
    const canScheduleStage =
      canManageTournament &&
      !!profile.nextStageId &&
      (profile.status === 'RegistrationOpen' || profile.status === 'InProgress') &&
      missingLineupClubNames.length === 0;
    const invitedClubIds = profile.clubIds ?? [];
    const invitedClubs = availableClubs.filter((club) => invitedClubIds.includes(club.id));
    const selectableClubs = availableClubs.filter((club) => !invitedClubIds.includes(club.id));
    const visibleTables = [...(
      canManageTournament
        ? tables
        : tables.filter((table) =>
            (table.status === 'WaitingPreparation' && !!operatorId && table.playerIds.includes(operatorId)) ||
            table.status === 'InProgress' ||
            table.status === 'Scoring' ||
            table.status === 'AppealPending' ||
            table.status === 'AppealInProgress' ||
            table.status === 'Archived',
          )
    )].sort((left, right) => {
      const leftIsOwnWaitingTable =
        !canManageTournament &&
        !!operatorId &&
        left.status === 'WaitingPreparation' &&
        left.playerIds.includes(operatorId);
      const rightIsOwnWaitingTable =
        !canManageTournament &&
        !!operatorId &&
        right.status === 'WaitingPreparation' &&
        right.playerIds.includes(operatorId);

      if (leftIsOwnWaitingTable !== rightIsOwnWaitingTable) {
        return leftIsOwnWaitingTable ? -1 : 1;
      }

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
      tournamentActionError,
      publishBlockedOpen,
      playerNames,
      showMoreInfo,
      canManageTournament,
      canPublishTournament,
      canScheduleStage,
      isWaitingForLineups,
      missingLineupClubNames,
      submittedLineupClubIds,
      lineupSubmissionCounts,
      invitedClubs,
      selectableClubs,
      visibleTables,
    };
  }, [
    availableClubs,
    isSubmittingTournamentAction,
    operatorId,
    playerNames,
    profile,
    publishBlockedOpen,
    selectedClubId,
    session,
    showMoreInfo,
    tournamentActionError,
    tables,
  ]);

  async function refreshTournamentProfile(tournamentId: string) {
    const refreshed = await loadTournamentProfileForWorkbench(tournamentId);
    setLocalProfile(refreshed);
    return refreshed;
  }

  async function handleInviteClub() {
    if (!workbench?.profile.id || !workbench.selectedClubId || !operatorId) {
      return;
    }

    const invitedClubId = workbench.selectedClubId;

    try {
      setIsSubmittingTournamentAction(true);
      setTournamentActionError('');
      await tournamentApi.registerTournamentClub(workbench.profile.id, invitedClubId, operatorId);

      let remainingSelectable = availableClubs.filter((club) => club.id !== invitedClubId);

      try {
        const refreshed = await refreshTournamentProfile(workbench.profile.id);
        remainingSelectable = availableClubs.filter((club) => !(refreshed.clubIds ?? []).includes(club.id));
      } catch {
        setLocalProfile((current) =>
          current
            ? {
                ...current,
                clubIds: Array.from(new Set([...(current.clubIds ?? []), invitedClubId])),
                clubCount:
                  typeof current.clubCount === 'number'
                    ? Math.max(current.clubCount, (current.clubIds?.length ?? 0) + 1)
                    : current.clubCount,
              }
            : current,
        );
      }

      setSelectedClubId((current) => (current === invitedClubId ? remainingSelectable[0]?.id ?? '' : current));
    } catch (error) {
      setTournamentActionError(error instanceof Error ? error.message : '邀请俱乐部失败，请稍后重试。');
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
      setTournamentActionError('');
      await tournamentApi.publishTournament(workbench.profile.id, operatorId);

      try {
        await refreshTournamentProfile(workbench.profile.id);
      } catch {
        setLocalProfile((current) =>
          current
            ? {
                ...current,
                status: 'RegistrationOpen',
              }
            : current,
        );
      }

      navigate('/public');
    } catch (error) {
      setTournamentActionError(error instanceof Error ? error.message : '发布赛事失败，请稍后重试。');
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  async function handleScheduleStage() {
    if (!operatorId || !workbench?.profile.id || !workbench.profile.nextStageId) {
      return;
    }

    const missingLineupClubNames = getNextStageMissingLineupClubNames(workbench.profile, availableClubs);

    if (missingLineupClubNames.length > 0) {
      setTournamentActionError(`还有俱乐部未提交参赛名单，暂时不能排期：${missingLineupClubNames.join('、')}`);
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      setTournamentActionError('');
      await tournamentApi.scheduleTournamentStage(workbench.profile.id, workbench.profile.nextStageId, operatorId);
      onScheduleSuccess?.();
    } catch (error) {
      setTournamentActionError(error instanceof Error ? error.message : '编排牌桌失败，请稍后重试。');
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
