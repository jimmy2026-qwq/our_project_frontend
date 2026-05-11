import { useEffect, useMemo, useState } from 'react';

import { authApi } from '@/api/auth';
import { clubsApi } from '@/api/clubs';
import type {
  TournamentDetailContract,
  TournamentDetailStageContract,
  TournamentStageDirectoryEntryContract,
} from '@/api/contracts/operations';
import { operationsApi } from '@/api/operations';
import { publicApi } from '@/api/public';
import type { PlayerProfile } from '@/domain/auth';
import type { TournamentPublicProfile } from '@/domain/public';
import { useNotice } from '@/hooks';

import type {
  ClubTournamentItem,
  ClubTournamentLineupWorkbench,
  EloSort,
  MemberListItem,
  MemberStatusFilter,
} from './ClubTournamentLineupDialog.types';

type PublicTournamentStage = NonNullable<TournamentPublicProfile['stages']>[number];

function getSelectedPlayerIds(detail: TournamentDetailContract | null, clubId: string, stageId: string) {
  const stage = detail?.stages?.find((item) => item.stageId === stageId);
  const submission = stage?.lineupSubmissions?.find((item) => item.clubId === clubId);
  return [...(submission?.activePlayerIds ?? []), ...(submission?.reservePlayerIds ?? [])];
}

async function loadTournamentStageDirectory(tournamentId: string) {
  try {
    return await operationsApi.getTournamentStages(tournamentId);
  } catch {
    return [];
  }
}

async function loadPublicStagesForLineup(tournamentId: string) {
  try {
    const publicDetail = await publicApi.getPublicTournamentProfile(tournamentId);
    return (publicDetail.stages ?? []).map(mapPublicStageToDetailStage);
  } catch {
    return [];
  }
}

function mapStageDirectoryEntryToDetailStage(
  stage: TournamentStageDirectoryEntryContract,
): TournamentDetailStageContract {
  return {
    stageId: stage.stageId,
    name: stage.name,
    status: stage.status,
    format: stage.format,
    order: stage.order,
    currentRound: stage.currentRound,
    roundCount: stage.roundCount,
    schedulingPoolSize: stage.schedulingPoolSize,
    pendingTablePlanCount: stage.pendingTablePlanCount,
    scheduledTableCount: stage.scheduledTableCount,
  };
}

function mapPublicStageToDetailStage(stage: PublicTournamentStage): TournamentDetailStageContract {
  return {
    stageId: stage.stageId,
    name: stage.name,
    status: stage.status,
    format: stage.format,
    order: stage.order,
    currentRound: stage.currentRound,
    roundCount: stage.roundCount,
    pendingTablePlanCount: stage.pendingTablePlanCount,
    scheduledTableCount: stage.tableCount,
  };
}

function mergeTournamentStages(
  stageDirectory: TournamentDetailStageContract[],
  detailStages: TournamentDetailStageContract[],
) {
  const detailById = new Map(detailStages.map((stage) => [stage.stageId, stage]));
  const mergedDirectory = stageDirectory.map((stage) => {
    const detailStage = detailById.get(stage.stageId);

    if (!detailStage) {
      return stage;
    }

    return {
      ...stage,
      ...detailStage,
      stageId: stage.stageId,
      name: detailStage.name || stage.name,
      status: detailStage.status || stage.status,
    };
  });

  const extraDetailStages = detailStages.filter(
    (stage) => !stageDirectory.some((directoryStage) => directoryStage.stageId === stage.stageId),
  );

  return [...mergedDirectory, ...extraDetailStages];
}

async function loadTournamentDetailForLineup(tournament: ClubTournamentItem): Promise<TournamentDetailContract> {
  const [detailResult, stageDirectory, publicStages] = await Promise.all([
    operationsApi.getTournament(tournament.id).catch(() => null),
    loadTournamentStageDirectory(tournament.id),
    loadPublicStagesForLineup(tournament.id),
  ]);

  const fallbackStages =
    stageDirectory.length > 0 ? stageDirectory.map(mapStageDirectoryEntryToDetailStage) : publicStages;

  if (detailResult) {
    const mergedStages = mergeTournamentStages(fallbackStages, detailResult.stages ?? []);

    return {
      ...detailResult,
      stages: mergedStages,
    };
  }

  if (fallbackStages.length > 0) {
    return {
      tournamentId: tournament.id,
      name: tournament.name,
      organizer: '',
      status: tournament.status ?? 'RegistrationOpen',
      startsAt: '',
      endsAt: '',
      stages: fallbackStages,
    };
  }

  throw new Error('No lineup stage is available for this tournament yet.');
}

interface UseClubTournamentLineupWorkbenchParams {
  clubId: string;
  operatorId: string;
  tournament: ClubTournamentItem | null;
  open: boolean;
}

export function useClubTournamentLineupWorkbench({
  clubId,
  operatorId,
  tournament,
  open,
}: UseClubTournamentLineupWorkbenchParams) {
  const { notifyWarning } = useNotice();
  const [members, setMembers] = useState<PlayerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>('all');
  const [eloSort, setEloSort] = useState<EloSort>('desc');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [tournamentDetail, setTournamentDetail] = useState<TournamentDetailContract | null>(null);
  const [initializedStageId, setInitializedStageId] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedStageId('');
    setInitializedStageId('');
    setSelectedPlayerIds([]);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void clubsApi
      .getClubMembers(clubId, { limit: 100, offset: 0 })
      .then(async (envelope) => {
        if (!cancelled) {
          const items = [...envelope.items];

          if (operatorId) {
            try {
              const currentPlayer = await authApi.getCurrentPlayer(operatorId);

              if (
                !items.some(
                  (member) =>
                    member.playerId === currentPlayer.playerId ||
                    (!!member.applicantUserId &&
                      member.applicantUserId === currentPlayer.applicantUserId),
                )
              ) {
                items.unshift(currentPlayer);
              }
            } catch {
              // Keep the club member list from the main endpoint when the current-player lookup fails.
            }
          }

          setMembers(items);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          notifyWarning(
            'éŽ´æ„¬æ†³é’æ¥„ã€ƒé”çŠºæµ‡æ¾¶è¾«è§¦',
            error instanceof Error ? error.message : 'éƒçŠ³ç¡¶ç’‡è¯²å½‡æ·‡å˜ç®°é–®ã„¦åžšé›æ¨ºåžªç›ã„£â‚¬?',
          );
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
  }, [clubId, notifyWarning, open, operatorId]);

  useEffect(() => {
    if (!open || !tournament?.id) {
      setTournamentDetail(null);
      setSelectedStageId('');
      setSelectedPlayerIds([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void loadTournamentDetailForLineup(tournament)
      .then((detail) => {
        if (cancelled) {
          return;
        }

        setTournamentDetail(detail);
        const defaultStageId = detail.stages?.[0]?.stageId ?? '';
        setSelectedStageId((current) => current || defaultStageId);
      })
      .catch((error) => {
        if (!cancelled) {
          notifyWarning(
            'ç’§æ¶—ç°¨ç’‡ï¸½å„é”çŠºæµ‡æ¾¶è¾«è§¦',
            error instanceof Error ? error.message : 'éƒçŠ³ç¡¶ç’‡è¯²å½‡ç’§æ¶—ç°¨ç’‡ï¸½å„éŠ†?',
          );
          setTournamentDetail(null);
          setSelectedStageId('');
          setSelectedPlayerIds([]);
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
  }, [notifyWarning, open, tournament]);

  useEffect(() => {
    if (!selectedStageId) {
      setSelectedPlayerIds([]);
      setInitializedStageId('');
      return;
    }

    if (initializedStageId === selectedStageId) {
      return;
    }

    setSelectedPlayerIds(getSelectedPlayerIds(tournamentDetail, clubId, selectedStageId));
    setInitializedStageId(selectedStageId);
  }, [clubId, initializedStageId, selectedStageId, tournamentDetail]);

  const stageOptions = tournamentDetail?.stages ?? [];

  const visibleMembers = useMemo(() => {
    const filtered = members.filter((member) => {
      const normalizedStatus = member.playerStatus?.toLowerCase() ?? 'active';

      if (statusFilter === 'active') {
        return normalizedStatus === 'active';
      }

      if (statusFilter === 'inactive') {
        return normalizedStatus !== 'active';
      }

      return true;
    });

    const withSelection: MemberListItem[] = filtered.map((member) => ({
      ...member,
      isSelected: selectedPlayerIds.includes(member.playerId),
      isCurrentUser:
        member.playerId === operatorId || (!!member.applicantUserId && member.applicantUserId === operatorId),
    }));

    return withSelection.sort((left, right) => {
      if (left.isCurrentUser !== right.isCurrentUser) {
        return left.isCurrentUser ? -1 : 1;
      }

      if (left.isSelected !== right.isSelected) {
        return left.isSelected ? -1 : 1;
      }

      const eloDelta = (right.elo ?? 0) - (left.elo ?? 0);

      if (eloDelta !== 0) {
        return eloSort === 'desc' ? eloDelta : -eloDelta;
      }

      return left.displayName.localeCompare(right.displayName, 'zh-CN');
    });
  }, [eloSort, members, operatorId, selectedPlayerIds, statusFilter]);

  const workbench: ClubTournamentLineupWorkbench = {
    members,
    isLoading,
    isSubmitting,
    selectedStageId,
    statusFilter,
    eloSort,
    selectedPlayerIds,
    tournamentDetail,
    stageOptions,
    visibleMembers,
  };

  function togglePlayer(playerId: string) {
    setSelectedPlayerIds((current) =>
      current.includes(playerId) ? current.filter((item) => item !== playerId) : [...current, playerId],
    );
  }

  return {
    workbench,
    setIsSubmitting,
    setSelectedStageId,
    setStatusFilter,
    setEloSort,
    setSelectedPlayerIds,
    togglePlayer,
    notifyWarning,
  };
}
