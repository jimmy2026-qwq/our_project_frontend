import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { authApi } from '@/api/auth';
import { clubsApi } from '@/api/clubs';
import { operationsApi } from '@/api/operations';
import { publicApi } from '@/api/public';
import {
  DetailCard,
  DetailHero,
  DetailList,
  DetailListItem,
  DetailPageShell,
  DetailRow,
  DetailRows,
} from '@/components/shared/data-display';
import { EmptyState } from '@/components/shared/feedback';
import { SelectField } from '@/components/shared/forms';
import {
  Button,
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
import type { ClubSummary, TournamentPublicProfile } from '@/domain/models';
import { useAuth } from '@/hooks/useAuth';

import type { DetailState } from '../types';
import { formatDateTime, getStageStatusLabel, getTournamentStatusLabel } from '../utils';
import { PublicDetailNotFound, getStatusTone } from './shared';

interface TournamentDetailTableItem {
  id: string;
  stageId: string;
  stageName: string;
  tableCode: string;
  status: string;
  playerIds: string[];
}

function getTableStatusLabel(status: string) {
  switch (status) {
    case 'WaitingPreparation':
      return '未开桌';
    case 'InProgress':
      return '对局中';
    case 'Scoring':
      return '结算中';
    case 'AppealPending':
      return '申诉中';
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
      return 0;
    case 'Archived':
      return 1;
    case 'WaitingPreparation':
      return 2;
    default:
      return 3;
  }
}

function getTableStatusTone(status: string) {
  switch (status) {
    case 'InProgress':
      return 'success' as const;
    case 'Scoring':
      return 'warning' as const;
    case 'AppealPending':
      return 'danger' as const;
    case 'Archived':
      return 'neutral' as const;
    case 'WaitingPreparation':
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}

export const PublicTournamentDetailSection = ({
  state,
  stages,
  onScheduleSuccess,
}: {
  state: DetailState<TournamentPublicProfile>;
  stages: NonNullable<TournamentPublicProfile['stages']>;
  onScheduleSuccess?: () => void;
}) => {
  const navigate = useNavigate();
  const { session } = useAuth();
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

  if (!state.item) {
    return <PublicDetailNotFound title="Tournament not found" />;
  }

  const profile = localProfile ?? state.item;
  const operatorId = session?.user.operatorId ?? session?.user.userId;
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
  const visibleTables = useMemo(() => {
    const filtered = canManageTournament
      ? tables
      : tables.filter((table) =>
          table.status === 'InProgress' ||
          table.status === 'Scoring' ||
          table.status === 'AppealPending' ||
          table.status === 'Archived',
        );

    return [...filtered].sort((left, right) => {
      const weightDelta = getTableSortWeight(left.status) - getTableSortWeight(right.status);
      if (weightDelta !== 0) {
        return weightDelta;
      }

      return left.tableCode.localeCompare(right.tableCode, 'zh-CN');
    });
  }, [canManageTournament, tables]);

  const handleInviteClub = async () => {
    if (!profile.id || !selectedClubId || !operatorId) {
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      await operationsApi.registerTournamentClub(profile.id, selectedClubId, operatorId);
      setLocalProfile((current) =>
        current
          ? {
              ...current,
              clubIds: Array.from(new Set([...(current.clubIds ?? []), selectedClubId])),
              clubCount: (current.clubCount ?? 0) + 1,
              whitelistType: current.playerCount && current.playerCount > 0 ? 'Mixed' : 'Club',
            }
          : current,
      );
      setSelectedClubId(selectableClubs.find((club) => club.id !== selectedClubId)?.id ?? '');
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  };

  const handlePublishTournament = async () => {
    if (!operatorId || !profile.id) {
      return;
    }

    if ((profile.clubIds?.length ?? 0) === 0) {
      setPublishBlockedOpen(true);
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      await operationsApi.publishTournament(profile.id, operatorId);
      setLocalProfile((current) => (current ? { ...current, status: 'RegistrationOpen' } : current));
      navigate('/public');
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  };

  const handleScheduleStage = async () => {
    if (!operatorId || !profile.id || !profile.nextStageId) {
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      await operationsApi.scheduleTournamentStage(profile.id, profile.nextStageId, operatorId);
      onScheduleSuccess?.();
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  };

  return (
    <>
      <DetailPageShell
        backLink={
          <Link className="detail-back" to="/public">
            返回公共大厅
          </Link>
        }
        hero={
          <DetailHero
            eyebrow="赛事"
            title={profile.name}
            tagline={profile.tagline}
            summary={profile.description}
            actions={
              <div className="flex flex-wrap gap-3">
                {canScheduleStage ? (
                  <Button onClick={() => void handleScheduleStage()} disabled={isSubmittingTournamentAction}>
                    生成对局名单
                  </Button>
                ) : null}
                {canPublishTournament ? (
                  <Button variant="secondary" onClick={() => void handlePublishTournament()} disabled={isSubmittingTournamentAction}>
                    发布比赛
                  </Button>
                ) : null}
              </div>
            }
            source={state.source}
            warning={state.warning}
          />
        }
      >
        <section className="detail-grid grid gap-[22px] md:grid-cols-2">
          <div className="grid gap-[22px]">
            <DetailCard title={<span className="text-[1.25rem] font-semibold">赛事信息</span>}>
              <div className="grid gap-4">
                <DetailList>
                  <DetailListItem
                    label="状态"
                    value={<StatusPill tone={getStatusTone(profile.status)}>{getTournamentStatusLabel(profile.status)}</StatusPill>}
                  />
                  <DetailListItem label="主办方" value={profile.venue} />
                  {showMoreInfo ? (
                    <>
                      <DetailListItem label="阶段数量" value={profile.stageCount} />
                      <DetailListItem label="白名单类型" value={profile.whitelistType} />
                      <DetailListItem label="俱乐部数量" value={profile.clubCount ?? profile.clubIds?.length ?? 0} />
                      <DetailListItem label="玩家数量" value={profile.playerCount ?? 0} />
                      <DetailListItem label="白名单数量" value={profile.whitelistCount ?? 0} />
                      <DetailListItem label="下一阶段" value={profile.nextStageName} />
                      <DetailListItem label="开始时间" value={formatDateTime(profile.nextScheduledAt)} />
                    </>
                  ) : null}
                </DetailList>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => setShowMoreInfo((current) => !current)}>
                    {showMoreInfo ? '收起详情' : '展开详情'}
                  </Button>
                </div>
              </div>
            </DetailCard>

            <DetailCard title={<span className="text-[1.25rem] font-semibold">对局信息</span>}>
              <div className="grid gap-4">
                {visibleTables.length > 0 ? (
                  <DetailRows>
                    {visibleTables.map((table) => {
                      const playerLabel = table.playerIds.map((playerId) => playerNames[playerId] ?? playerId).join(' / ');
                      const isFinished = table.status === 'Archived';

                      return (
                        <DetailRow
                          key={table.id}
                          title={`${table.tableCode} · ${table.stageName}`}
                          detail={
                            <div className="flex flex-wrap items-center gap-3">
                              <StatusPill tone={getTableStatusTone(table.status)}>{getTableStatusLabel(table.status)}</StatusPill>
                              <span>{playerLabel}</span>
                              <Link className="detail-link inline-flex" to={isFinished ? `/tables/${table.id}/paifu` : `/tables/${table.id}`}>
                                {isFinished ? '查看牌谱' : '进入牌桌'}
                              </Link>
                            </div>
                          }
                        />
                      );
                    })}
                  </DetailRows>
                ) : (
                  <EmptyState asListItem={false}>
                    {canManageTournament ? '当前还没有安排好的对局。' : '当前还没有可对外展示的进行中或已结束对局。'}
                  </EmptyState>
                )}
              </div>
            </DetailCard>
          </div>

          <div className="grid gap-[22px]">
            <DetailCard
              title={
                <span className="text-[1.25rem] font-semibold">
                  {invitedClubs.length > 0 ? '参赛俱乐部名单' : '邀请俱乐部'}
                </span>
              }
            >
              <div className="grid gap-4">
                {canManageTournament ? (
                  <>
                    <p className="m-0 text-[color:var(--muted)]">
                      后端已支持将俱乐部注册到赛事中。请先邀请俱乐部，再发布比赛。
                    </p>
                    <SelectField
                      label="俱乐部"
                      value={selectedClubId}
                      onChange={(event) => setSelectedClubId(event.currentTarget.value)}
                      disabled={isSubmittingTournamentAction || selectableClubs.length === 0}
                    >
                      {selectableClubs.length > 0 ? (
                        selectableClubs.map((club) => (
                          <option key={club.id} value={club.id}>
                            {club.name}
                          </option>
                        ))
                      ) : (
                        <option value="">没有更多可邀请的俱乐部</option>
                      )}
                    </SelectField>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => void handleInviteClub()}
                        disabled={!selectedClubId || isSubmittingTournamentAction || selectableClubs.length === 0}
                      >
                        邀请俱乐部
                      </Button>
                    </div>
                  </>
                ) : null}
                {invitedClubs.length > 0 ? (
                  <DetailRows>
                    {invitedClubs.map((club) => (
                      <DetailRow
                        key={club.id}
                        title={
                          <Link className="detail-link inline-flex" to={`/public/clubs/${club.id}`}>
                            {club.name}
                          </Link>
                        }
                        detail={`${club.memberCount} 名成员 / 战力 ${club.powerRating}`}
                      />
                    ))}
                  </DetailRows>
                ) : (
                  <EmptyState asListItem={false}>
                    {canManageTournament ? '当前还没有邀请任何俱乐部。' : '当前还没有公布参赛俱乐部名单。'}
                  </EmptyState>
                )}
              </div>
            </DetailCard>

            <DetailCard title="阶段概览">
              <DetailRows>
                {stages.map((stage) => (
                  <DetailRow
                    key={stage.stageId}
                    title={stage.name}
                    detail={
                      <>
                        <StatusPill tone={getStatusTone(stage.status)}>{getStageStatusLabel(stage.status)}</StatusPill>
                        {' / '}
                        {stage.tableCount} tables / {stage.roundCount} rounds
                      </>
                    }
                  />
                ))}
              </DetailRows>
            </DetailCard>
          </div>
        </section>
      </DetailPageShell>

      <Dialog open={publishBlockedOpen} onOpenChange={setPublishBlockedOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogSurface>
            <DialogHeader className="border-b border-[color:var(--line)] px-6 py-5">
              <DialogTitle>暂时无法发布</DialogTitle>
              <DialogDescription>请先选择邀请的俱乐部，再发布这场比赛。</DialogDescription>
            </DialogHeader>
            <DialogBody className="px-6 py-5">
              <p className="m-0 text-[color:var(--muted)]">
                请先在右侧邀请俱乐部区域至少添加一个俱乐部，然后再尝试发布。
              </p>
            </DialogBody>
            <DialogFooter className="border-t border-[color:var(--line)] px-6 py-5">
              <Button variant="secondary" onClick={() => setPublishBlockedOpen(false)}>
                关闭
              </Button>
            </DialogFooter>
          </DialogSurface>
        </DialogPortal>
      </Dialog>
    </>
  );
};
