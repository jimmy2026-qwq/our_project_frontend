import { useEffect, useMemo, useReducer, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ApiError } from '@/api/shared/http';
import { tournamentApi } from '@/api/tournament';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  LoadingProgress,
  StatusPill,
  Textarea,
} from '@/components/ui';
import type { TableDetail } from '@/objects/tournament';
import { useAuth, useMutationNotice, useNotice } from '@/hooks';

function getTableStatusLabel(status: TableDetail['status']) {
  switch (status) {
    case 'WaitingPreparation':
      return '等待准备';
    case 'InProgress':
      return '进行中';
    case 'Scoring':
      return '结算中';
    case 'AppealPending':
    case 'AppealInProgress':
      return '申诉处理中';
    case 'Archived':
      return '已归档';
    default:
      return status;
  }
}

function getSeatStatusTone(detail: { ready: boolean; disconnected: boolean }) {
  if (detail.disconnected) {
    return 'danger' as const;
  }

  if (detail.ready) {
    return 'success' as const;
  }

  return 'warning' as const;
}

function getSeatStatusLabel(detail: { ready: boolean; disconnected: boolean }) {
  if (detail.disconnected) {
    return '已断线';
  }

  if (detail.ready) {
    return '已准备';
  }

  return '待准备';
}

function getAppealButtonText(status: TableDetail['status']) {
  if (status === 'AppealPending' || status === 'AppealInProgress') {
    return '申诉处理中';
  }

  return '发起赛事申诉';
}

function SeatCard({
  wind,
  playerId,
  ready,
  disconnected,
  className = '',
}: {
  wind: string;
  playerId: string;
  ready: boolean;
  disconnected: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        'rounded-[22px] border border-[color:var(--line)] bg-[rgba(6,17,26,0.78)] p-4 shadow-[var(--shadow-sm)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <strong className="text-base">{wind}</strong>
        <StatusPill tone={getSeatStatusTone({ ready, disconnected })}>
          {getSeatStatusLabel({ ready, disconnected })}
        </StatusPill>
      </div>
      <div className="grid gap-2 text-sm text-[color:var(--muted-strong)]">
        <span className="font-medium text-[color:var(--text)]">{playerId}</span>
        <span>准备状态：{ready ? '已准备' : '未准备'}</span>
        <span>连接状态：{disconnected ? '已断开' : '正常'}</span>
      </div>
    </div>
  );
}

export function TableMatchPage() {
  const { tableId = '' } = useParams();
  const { session } = useAuth();
  const { notifyMutationResult } = useMutationNotice();
  const { notifyWarning, notifyInfo, notifySuccess } = useNotice();
  const [table, setTable] = useState<TableDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdatingOwnReady, setIsUpdatingOwnReady] = useState(false);
  const [isAppealDialogOpen, setIsAppealDialogOpen] = useState(false);
  const [appealDescription, setAppealDescription] = useState('');
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const [appealError, setAppealError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const backLink = table?.tournamentId
    ? `/public/tournaments/${table.tournamentId}`
    : '/public';
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';

  useEffect(() => {
    let cancelled = false;

    async function loadTable() {
      const isInitialLoad = table === null;

      try {
        if (isInitialLoad) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }

        setError(null);
        const payload = await tournamentApi.getTable(tableId);

        if (!cancelled) {
          setTable(payload);
        }
      } catch (loadError) {
        if (!cancelled) {
          const message =
            loadError instanceof ApiError
              ? loadError.message
              : loadError instanceof Error
                ? loadError.message
                : 'Failed to load table details.';
          setError(message);
          setTable(null);
        }
      } finally {
        if (!cancelled) {
          if (isInitialLoad) {
            setIsLoading(false);
          }
          setIsRefreshing(false);
        }
      }
    }

    if (tableId) {
      void loadTable();
    } else {
      setError('Missing table id.');
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [reloadKey, tableId]);

  useEffect(() => {
    if (table?.status !== 'InProgress') {
      return;
    }

    const timer = window.setInterval(() => {
      forceReload();
    }, 8000);

    return () => {
      window.clearInterval(timer);
    };
  }, [table?.status]);

  const seatMap = useMemo(() => {
    const entries = table?.seats ?? [];
    return {
      East: entries.find((seat) => seat.seat === 'East') ?? null,
      South: entries.find((seat) => seat.seat === 'South') ?? null,
      West: entries.find((seat) => seat.seat === 'West') ?? null,
      North: entries.find((seat) => seat.seat === 'North') ?? null,
    };
  }, [table]);

  const ownSeat = useMemo(
    () => table?.seats.find((seat) => seat.playerId === operatorId) ?? null,
    [operatorId, table],
  );

  const canUpdateOwnReady =
    !!session?.user.roles.isRegisteredPlayer &&
    !!operatorId &&
    !!ownSeat &&
    table?.status === 'WaitingPreparation' &&
    !ownSeat.disconnected;
  const canFileAppeal =
    !!session?.user.roles.isRegisteredPlayer &&
    !!operatorId &&
    !!ownSeat &&
    table?.status !== 'Archived' &&
    table?.status !== 'AppealPending' &&
    table?.status !== 'AppealInProgress';

  async function handleSubmitAppeal() {
    if (!table || !operatorId || !ownSeat) {
      notifyInfo(
        '暂时无法提交申诉',
        '请使用本桌参赛玩家账号进入牌桌后再提交申诉。',
      );
      return;
    }

    const trimmedDescription = appealDescription.trim();
    if (!trimmedDescription) {
      setAppealError('请先填写申诉说明。');
      return;
    }

    try {
      setIsSubmittingAppeal(true);
      setAppealError(null);
      await tournamentApi.fileAppeal(table.id, {
        playerId: operatorId,
        description: trimmedDescription,
      });
      setAppealDescription('');
      setIsAppealDialogOpen(false);
      notifySuccess(
        '申诉已提交',
        `牌桌 ${String(table.tableNo).padStart(2, '0')} 的申诉工单已经创建。`,
      );
      forceReload();
    } catch (submitError) {
      const message =
        submitError instanceof ApiError
          ? submitError.message
          : submitError instanceof Error
            ? submitError.message
            : '提交申诉失败，请稍后重试。';
      setAppealError(message);

      if (!(submitError instanceof ApiError)) {
        notifyWarning('提交申诉失败', message);
      }
    } finally {
      setIsSubmittingAppeal(false);
    }
  }

  async function handleToggleOwnReady() {
    if (!table || !ownSeat || !operatorId) {
      notifyInfo(
        'Ready state unavailable',
        'Sign in as a seated player to update your own ready status.',
      );
      return;
    }

    try {
      setIsUpdatingOwnReady(true);
      setError(null);
      const nextTable = await tournamentApi.updateOwnReadyState(table.id, {
        operatorId,
        ready: !ownSeat.ready,
      });
      setTable(nextTable);
      notifyMutationResult(
        { source: 'api' },
        {
          successTitle: ownSeat.ready ? 'Ready removed' : 'Ready confirmed',
          successMessage: ownSeat.ready
            ? `You are no longer marked ready at Table ${String(table.tableNo).padStart(2, '0')}.`
            : `You are marked ready at Table ${String(table.tableNo).padStart(2, '0')}.`,
          fallbackTitle: 'Ready state update unavailable',
          fallbackMessage: 'Your ready state could not be updated right now.',
        },
      );
    } catch (updateError) {
      const message =
        updateError instanceof ApiError
          ? updateError.message
          : updateError instanceof Error
            ? updateError.message
            : 'Failed to update your ready state.';
      setError(message);

      if (!(updateError instanceof ApiError)) {
        notifyWarning('Failed to update ready state', message);
      }
    } finally {
      setIsUpdatingOwnReady(false);
    }
  }

  if (isLoading) {
    return (
      <section className="grid gap-6">
        <LoadingProgress
          label="正在加载牌桌"
          message="正在获取当前牌桌状态与座位准备情况。"
        />
      </section>
    );
  }

  if (error || !table) {
    return (
      <section className="grid gap-6">
        <Alert variant="danger">
          <AlertTitle>无法加载牌桌</AlertTitle>
          <AlertDescription>{error ?? '当前牌桌数据不可用。'}</AlertDescription>
        </Alert>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => forceReload()}>重试</Button>
          <Link
            to={backLink}
            className="inline-flex min-h-[42px] items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-[color:var(--text)] no-underline transition-[transform,border-color] duration-200 hover:-translate-y-px"
          >
            返回赛事
          </Link>
        </div>
      </section>
    );
  }

  const allReady = table.seats.every((seat) => seat.ready);

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>牌桌对局</Badge>
            <StatusPill
              tone={table.status === 'InProgress' ? 'success' : 'warning'}
            >
              {getTableStatusLabel(table.status)}
            </StatusPill>
            {isRefreshing ? <Badge>刷新中</Badge> : null}
          </div>
          <div>
            <h1 className="text-[clamp(2rem,3vw,2.5rem)] font-semibold text-[color:var(--text)]">
              牌桌 {String(table.tableNo).padStart(2, '0')}
            </h1>
            <p className="text-[color:var(--muted-strong)]">
              牌桌 ID {table.id} / 赛段 {table.stageId}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {canUpdateOwnReady ? (
            <Button
              onClick={() => void handleToggleOwnReady()}
              disabled={isUpdatingOwnReady}
            >
              {isUpdatingOwnReady
                ? '正在更新...'
                : ownSeat.ready
                  ? '取消准备'
                  : '标记为已准备'}
            </Button>
          ) : null}
          <Button variant="outline" onClick={() => forceReload()}>
            刷新
          </Button>
          <Link
            to={backLink}
            className="inline-flex min-h-[42px] items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-[color:var(--text)] no-underline transition-[transform,border-color] duration-200 hover:-translate-y-px"
          >
            返回赛事
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>座位概览</CardTitle>
          <CardDescription>
            查看四个座位的玩家分配、准备状态和连接状态，便于开局前确认当前牌桌情况。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {session?.user.roles.isRegisteredPlayer && ownSeat ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[rgba(236,197,122,0.22)] bg-[rgba(236,197,122,0.08)] px-4 py-3 text-sm text-[color:var(--muted-strong)]">
              <div className="grid gap-1">
                <strong className="text-[color:var(--text)]">
                  我的座位：{ownSeat.seat}
                </strong>
                <span>
                  {ownSeat.disconnected
                    ? '当前座位已标记为断线，暂时不能在这里修改准备状态。'
                    : ownSeat.ready
                      ? '你当前已在这桌标记为已准备。'
                      : '比赛开始前，你可以在这里确认自己的准备状态。'}
                </span>
              </div>
              <StatusPill tone={getSeatStatusTone(ownSeat)}>
                {getSeatStatusLabel(ownSeat)}
              </StatusPill>
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)] md:grid-rows-[auto_auto_auto]">
            <SeatCard
              wind="North"
              playerId={seatMap.North?.playerId ?? 'Unassigned'}
              ready={seatMap.North?.ready ?? false}
              disconnected={seatMap.North?.disconnected ?? false}
              className="md:col-start-2 md:row-start-1"
            />
            <SeatCard
              wind="West"
              playerId={seatMap.West?.playerId ?? 'Unassigned'}
              ready={seatMap.West?.ready ?? false}
              disconnected={seatMap.West?.disconnected ?? false}
              className="md:col-start-1 md:row-start-2"
            />
            <div className="rounded-[28px] border border-[rgba(236,197,122,0.22)] bg-[radial-gradient(circle_at_top,rgba(236,197,122,0.16),transparent_55%),linear-gradient(180deg,rgba(17,38,52,0.92),rgba(8,20,30,0.96))] p-6 text-center shadow-[var(--shadow-md)] md:col-start-2 md:row-start-2">
              <p className="mb-2 text-sm uppercase tracking-[0.32em] text-[color:var(--muted)]">
                Riichi Table
              </p>
              <div className="grid gap-2 text-sm text-[color:var(--muted-strong)]">
                <span>状态：{getTableStatusLabel(table.status)}</span>
                <span>已就位人数：{table.seats.length} / 4</span>
                <span>
                  准备情况：{allReady ? '全部就绪' : '仍在等待玩家准备'}
                </span>
              </div>
            </div>
            <SeatCard
              wind="East"
              playerId={seatMap.East?.playerId ?? 'Unassigned'}
              ready={seatMap.East?.ready ?? false}
              disconnected={seatMap.East?.disconnected ?? false}
              className="md:col-start-3 md:row-start-2"
            />
            <SeatCard
              wind="South"
              playerId={seatMap.South?.playerId ?? 'Unassigned'}
              ready={seatMap.South?.ready ?? false}
              disconnected={seatMap.South?.disconnected ?? false}
              className="md:col-start-2 md:row-start-3"
            />
          </div>
          <div className="flex justify-end">
            <div className="grid max-w-[360px] justify-items-end gap-2 text-right">
              <Button
                variant={canFileAppeal ? 'secondary' : 'outline'}
                onClick={() => {
                  setAppealError(null);
                  setIsAppealDialogOpen(true);
                }}
                disabled={!canFileAppeal}
              >
                {getAppealButtonText(table.status)}
              </Button>
              <p className="m-0 text-sm text-[color:var(--muted)]">
                {!session?.user.roles.isRegisteredPlayer || !operatorId
                  ? '请先登录玩家账号后再提交赛事申诉。'
                  : !ownSeat
                    ? '只有本桌参赛玩家可以发起赛事申诉。'
                    : table.status === 'Archived'
                      ? '牌桌已归档，不能再创建新的申诉工单。'
                      : table.status === 'AppealPending' ||
                          table.status === 'AppealInProgress'
                        ? '当前牌桌已有进行中的申诉工单。'
                        : '如对本桌赛事过程有异议，可在这里提交申诉说明。'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isAppealDialogOpen}
        onOpenChange={(open) => {
          setIsAppealDialogOpen(open);
          if (!open) {
            setAppealError(null);
          }
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogSurface>
            <DialogHeader className="border-b border-[color:var(--line)] px-6 py-5">
              <DialogTitle>发起赛事申诉</DialogTitle>
              <DialogDescription>
                请描述本桌需要申诉的情况，提交后会生成一张赛事申诉工单。
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="px-6 py-5">
              {appealError ? (
                <Alert variant="danger">
                  <AlertDescription>{appealError}</AlertDescription>
                </Alert>
              ) : null}
              <label className="grid gap-3 text-sm text-[color:var(--muted-strong)]">
                <span className="font-medium text-[color:var(--text)]">
                  申诉说明
                </span>
                <Textarea
                  value={appealDescription}
                  onChange={(event) => setAppealDescription(event.target.value)}
                  placeholder="例如：第 3 局结算时分数记录有误，请管理员核对牌谱和结算结果。"
                  maxLength={1000}
                />
                <span className="text-right text-xs text-[color:var(--muted)]">
                  {appealDescription.trim().length} / 1000
                </span>
              </label>
            </DialogBody>
            <DialogFooter className="border-t border-[color:var(--line)] px-6 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <p className="m-0 text-sm text-[color:var(--muted)]">
                提交人：{operatorId || '未登录'}
              </p>
              <Button
                variant="outline"
                onClick={() => setIsAppealDialogOpen(false)}
                disabled={isSubmittingAppeal}
              >
                取消
              </Button>
              <Button
                onClick={() => void handleSubmitAppeal()}
                disabled={!canFileAppeal || isSubmittingAppeal}
              >
                {isSubmittingAppeal ? '提交中...' : '提交申诉'}
              </Button>
            </DialogFooter>
          </DialogSurface>
        </DialogPortal>
      </Dialog>
    </section>
  );
}
