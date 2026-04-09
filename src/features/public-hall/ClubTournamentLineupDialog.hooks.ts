import { useEffect, useMemo, useState } from 'react';

import { clubsApi } from '@/api/clubs';
import { operationsApi } from '@/api/operations';
import type { PlayerProfile } from '@/domain/auth';
import { useNotice } from '@/hooks';
import type { PublicHallTournamentAdminDetail } from './types';

import type {
  ClubTournamentItem,
  ClubTournamentLineupWorkbench,
  EloSort,
  MemberListItem,
  MemberStatusFilter,
} from './ClubTournamentLineupDialog.types';

function getSelectedPlayerIds(detail: PublicHallTournamentAdminDetail | null, clubId: string, stageId: string) {
  const stage = detail?.stages?.find((item) => item.id === stageId);
  const submission = stage?.lineupSubmissions?.find((item) => item.clubId === clubId);
  return submission?.seats.map((seat) => seat.playerId) ?? [];
}

interface UseClubTournamentLineupWorkbenchParams {
  clubId: string;
  tournament: ClubTournamentItem | null;
  open: boolean;
}

export function useClubTournamentLineupWorkbench({
  clubId,
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
  const [tournamentDetail, setTournamentDetail] = useState<PublicHallTournamentAdminDetail | null>(null);
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
      .then((envelope) => {
        if (!cancelled) {
          setMembers(envelope.items);
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
  }, [clubId, notifyWarning, open]);

  useEffect(() => {
    if (!open || !tournament?.id) {
      setTournamentDetail(null);
      setSelectedStageId('');
      setSelectedPlayerIds([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void operationsApi
      .getTournament(tournament.id)
      .then((detail) => {
        if (cancelled) {
          return;
        }

        setTournamentDetail(detail);
        const defaultStageId = detail.stages?.[0]?.id ?? '';
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
    }));

    return withSelection.sort((left, right) => {
      if (left.isSelected !== right.isSelected) {
        return left.isSelected ? -1 : 1;
      }

      const eloDelta = (right.elo ?? 0) - (left.elo ?? 0);

      if (eloDelta !== 0) {
        return eloSort === 'desc' ? eloDelta : -eloDelta;
      }

      return left.displayName.localeCompare(right.displayName, 'zh-CN');
    });
  }, [eloSort, members, selectedPlayerIds, statusFilter]);

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
