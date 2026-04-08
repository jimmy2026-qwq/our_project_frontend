import { useEffect, useMemo, useState } from 'react';

import { clubsApi } from '@/api/clubs';
import { operationsApi, type RawTournamentDetail } from '@/api/operations';
import { ActionButton } from '@/components/shared/layout';
import { FieldGroup, SelectField } from '@/components/shared/forms';
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  StatusPill,
} from '@/components/ui';
import type { ClubPublicProfile, PlayerProfile } from '@/domain/models';
import { useNotice } from '@/hooks';

type ClubTournamentItem = ClubPublicProfile['activeTournaments'][number];

type MemberStatusFilter = 'all' | 'active' | 'inactive';
type EloSort = 'desc' | 'asc';

interface MemberListItem extends PlayerProfile {
  isSelected: boolean;
}

function getSelectedPlayerIds(detail: RawTournamentDetail | null, clubId: string, stageId: string) {
  const stage = detail?.stages?.find((item) => item.id === stageId);
  const submission = stage?.lineupSubmissions?.find((item) => item.clubId === clubId);
  return submission?.seats.map((seat) => seat.playerId) ?? [];
}

export function ClubTournamentLineupDialog({
  clubId,
  operatorId,
  tournament,
  open,
  onOpenChange,
}: {
  clubId: string;
  operatorId: string;
  tournament: ClubTournamentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { notifySuccess, notifyWarning } = useNotice();
  const [members, setMembers] = useState<PlayerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>('all');
  const [eloSort, setEloSort] = useState<EloSort>('desc');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [tournamentDetail, setTournamentDetail] = useState<RawTournamentDetail | null>(null);
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
          notifyWarning('成员列表加载失败', error instanceof Error ? error.message : '无法读取俱乐部成员列表。');
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
          notifyWarning('赛事详情加载失败', error instanceof Error ? error.message : '无法读取赛事详情。');
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

    const withSelection = filtered.map((member) => ({
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

  function togglePlayer(playerId: string) {
    setSelectedPlayerIds((current) =>
      current.includes(playerId) ? current.filter((item) => item !== playerId) : [...current, playerId],
    );
  }

  async function handleSubmit() {
    if (!tournament?.id || !selectedStageId || selectedPlayerIds.length === 0) {
      notifyWarning('请先选择参赛成员', '至少需要选择一名俱乐部成员提交到当前赛事阶段。');
      return;
    }

    try {
      setIsSubmitting(true);
      await operationsApi.submitStageLineup(tournament.id, selectedStageId, {
        clubId,
        operatorId,
        playerIds: selectedPlayerIds,
      });
      notifySuccess('参赛名单已提交', '俱乐部参赛名单已经同步到当前赛事阶段。');
      onOpenChange(false);
    } catch (error) {
      notifyWarning('提交参赛名单失败', error instanceof Error ? error.message : '无法提交当前参赛名单。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface className="max-w-[min(920px,92vw)]">
          <DialogHeader className="border-b border-[color:var(--line)] px-6 py-5">
            <DialogTitle>拉人参赛</DialogTitle>
            <DialogDescription>
              正在为“{tournament?.name ?? '当前赛事'}”选择参赛成员。已参赛成员会排在列表最上面。
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="px-6 py-5">
            <div className="grid gap-5">
              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <SelectField
                  label="阶段"
                  value={selectedStageId}
                  onChange={(event) => setSelectedStageId(event.currentTarget.value)}
                  disabled={isLoading || stageOptions.length === 0}
                >
                  {stageOptions.length > 0 ? (
                    stageOptions.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))
                  ) : (
                    <option value="">暂无阶段</option>
                  )}
                </SelectField>
                <SelectField
                  label="活跃筛选"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.currentTarget.value as MemberStatusFilter)}
                >
                  <option value="all">全部成员</option>
                  <option value="active">仅活跃成员</option>
                  <option value="inactive">仅非活跃成员</option>
                </SelectField>
                <SelectField
                  label="ELO 排序"
                  value={eloSort}
                  onChange={(event) => setEloSort(event.currentTarget.value as EloSort)}
                >
                  <option value="desc">从高到低</option>
                  <option value="asc">从低到高</option>
                </SelectField>
              </FieldGroup>

              <div className="grid gap-3 rounded-[22px] border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong>俱乐部成员</strong>
                  <StatusPill tone="info">已选择 {selectedPlayerIds.length} 人</StatusPill>
                </div>
                {visibleMembers.length > 0 ? (
                  <div className="grid max-h-[340px] gap-3 overflow-y-auto pr-1">
                    {visibleMembers.map((member: MemberListItem) => (
                      <div
                        key={member.playerId}
                        className="grid gap-3 rounded-[18px] border border-[color:var(--line)] px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="grid gap-1">
                            <strong>{member.displayName}</strong>
                            <span className="text-sm text-[color:var(--muted)]">
                              ELO {member.elo ?? 0} / {member.playerStatus ?? 'Active'}
                            </span>
                          </span>
                          {member.isSelected ? <StatusPill tone="success">已参赛</StatusPill> : null}
                        </div>
                        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[color:var(--text)]">
                          <input
                            type="checkbox"
                            checked={member.isSelected}
                            onChange={() => togglePlayer(member.playerId)}
                          />
                          选择该成员
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="m-0 text-[color:var(--muted)]">
                    {isLoading ? '正在加载成员列表...' : '当前筛选条件下没有可选成员。'}
                  </p>
                )}
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="border-t border-[color:var(--line)] px-6 py-5">
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <ActionButton onClick={() => void handleSubmit()} disabled={isSubmitting || selectedPlayerIds.length === 0}>
                {isSubmitting ? '提交中...' : '提交参赛名单'}
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                关闭
              </ActionButton>
            </div>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
