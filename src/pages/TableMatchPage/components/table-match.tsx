import { Link } from 'react-router-dom';

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
import type { TableDetail } from '@/pages/objects/tournament';

type TableSeat = TableDetail['seats'][number];
type TableSeatMap = Record<'East' | 'South' | 'West' | 'North', TableSeat | null>;

function getTableStatusLabel(status: TableDetail['status']) {
  switch (status) {
    case 'WaitingPreparation':
      return '等待准备';
    case 'InProgress':
      return '进行中';
    case 'Scoring':
      return '结算中';
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
  if (status === 'AppealInProgress') {
    return '申诉处理中';
  }

  return '发起赛事申诉';
}

function matchBackLinkClassName() {
  return 'inline-flex min-h-[42px] items-center justify-center rounded-2xl border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-[#f2f7fb] no-underline transition-[transform,border-color] duration-200 hover:-translate-y-px';
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
        'rounded-[22px] border border-[rgba(176,223,229,0.14)] bg-[rgba(6,17,26,0.78)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.18)]',
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
      <div className="grid gap-2 text-sm text-[#c7d6e2]">
        <span className="font-medium text-[#f2f7fb]">{playerId}</span>
        <span>准备状态：{ready ? '已准备' : '未准备'}</span>
        <span>连接状态：{disconnected ? '已断开' : '正常'}</span>
      </div>
    </div>
  );
}

export function TableMatchLoading() {
  return (
    <section className="grid gap-6">
      <LoadingProgress
        label="正在加载牌桌"
        message="正在获取当前牌桌状态与座位准备情况。"
      />
    </section>
  );
}

export function TableMatchError({
  error,
  backLink,
  onRetry,
}: {
  error: string | null;
  backLink: string;
  onRetry: () => void;
}) {
  return (
    <section className="grid gap-6">
      <Alert variant="danger">
        <AlertTitle>无法加载牌桌</AlertTitle>
        <AlertDescription>{error ?? '当前牌桌数据不可用。'}</AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onRetry}>重试</Button>
        <Link to={backLink} className={matchBackLinkClassName()}>
          返回赛事
        </Link>
      </div>
    </section>
  );
}

export function TableMatchHeader({
  table,
  backLink,
  isRefreshing,
  canUpdateOwnReady,
  isUpdatingOwnReady,
  ownSeat,
  onRefresh,
  onToggleOwnReady,
}: {
  table: TableDetail;
  backLink: string;
  isRefreshing: boolean;
  canUpdateOwnReady: boolean;
  isUpdatingOwnReady: boolean;
  ownSeat: TableSeat | null;
  onRefresh: () => void;
  onToggleOwnReady: () => void;
}) {
  return (
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
          <h1 className="text-[clamp(2rem,3vw,2.5rem)] font-semibold text-[#f2f7fb]">
            牌桌 {String(table.tableNo).padStart(2, '0')}
          </h1>
          <p className="text-[#c7d6e2]">
            牌桌 ID {table.id} / 赛段 {table.stageId}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {canUpdateOwnReady && ownSeat ? (
          <Button onClick={onToggleOwnReady} disabled={isUpdatingOwnReady}>
            {isUpdatingOwnReady
              ? '正在更新...'
              : ownSeat.ready
                ? '取消准备'
                : '标记为已准备'}
          </Button>
        ) : null}
        <Button variant="outline" onClick={onRefresh}>
          刷新
        </Button>
        <Link to={backLink} className={matchBackLinkClassName()}>
          返回赛事
        </Link>
      </div>
    </div>
  );
}

export function SeatsOverviewCard({
  table,
  seatMap,
  ownSeat,
  canFileAppeal,
  isRegisteredPlayer,
  operatorId,
  onOpenAppeal,
}: {
  table: TableDetail;
  seatMap: TableSeatMap;
  ownSeat: TableSeat | null;
  canFileAppeal: boolean;
  isRegisteredPlayer: boolean;
  operatorId: string;
  onOpenAppeal: () => void;
}) {
  const allReady = table.seats.every((seat) => seat.ready);

  return (
    <Card>
      <CardHeader>
        <CardTitle>座位概览</CardTitle>
        <CardDescription>
          查看四个座位的玩家分配、准备状态和连接状态，便于开局前确认当前牌桌情况。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isRegisteredPlayer && ownSeat ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[rgba(236,197,122,0.22)] bg-[rgba(236,197,122,0.08)] px-4 py-3 text-sm text-[#c7d6e2]">
            <div className="grid gap-1">
              <strong className="text-[#f2f7fb]">我的座位：{ownSeat.seat}</strong>
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
          <div className="rounded-[28px] border border-[rgba(236,197,122,0.22)] bg-[radial-gradient(circle_at_top,rgba(236,197,122,0.16),transparent_55%),linear-gradient(180deg,rgba(17,38,52,0.92),rgba(8,20,30,0.96))] p-6 text-center shadow-[0_18px_48px_rgba(0,0,0,0.22)] md:col-start-2 md:row-start-2">
            <p className="mb-2 text-sm uppercase tracking-[0.32em] text-[#9ab0c1]">
              Riichi Table
            </p>
            <div className="grid gap-2 text-sm text-[#c7d6e2]">
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
              onClick={onOpenAppeal}
              disabled={!canFileAppeal}
            >
              {getAppealButtonText(table.status)}
            </Button>
            <p className="m-0 text-sm text-[#9ab0c1]">
              {!isRegisteredPlayer || !operatorId
                ? '请先登录玩家账号后再提交赛事申诉。'
                : !ownSeat
                  ? '只有本桌参赛玩家可以发起赛事申诉。'
                  : table.status === 'Archived'
                    ? '牌桌已归档，不能再创建新的申诉工单。'
                    : table.status === 'AppealInProgress'
                      ? '当前牌桌已有进行中的申诉工单。'
                      : '如对本桌赛事过程有异议，可在这里提交申诉说明。'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AppealDialog({
  open,
  appealDescription,
  appealError,
  operatorId,
  canFileAppeal,
  isSubmittingAppeal,
  onOpenChange,
  onDescriptionChange,
  onSubmit,
}: {
  open: boolean;
  appealDescription: string;
  appealError: string | null;
  operatorId: string;
  canFileAppeal: boolean;
  isSubmittingAppeal: boolean;
  onOpenChange: (open: boolean) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
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
            <label className="grid gap-3 text-sm text-[#c7d6e2]">
              <span className="font-medium text-[#f2f7fb]">申诉说明</span>
              <Textarea
                value={appealDescription}
                onChange={(event) => onDescriptionChange(event.target.value)}
                placeholder="例如：第 3 局结算时分数记录有误，请管理员核对牌谱和结算结果。"
                maxLength={1000}
              />
              <span className="text-right text-xs text-[#9ab0c1]">
                {appealDescription.trim().length} / 1000
              </span>
            </label>
          </DialogBody>
          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
            <p className="m-0 text-sm text-[#9ab0c1]">
              提交人：{operatorId || '未登录'}
            </p>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmittingAppeal}
            >
              取消
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!canFileAppeal || isSubmittingAppeal}
            >
              {isSubmittingAppeal ? '提交中...' : '提交申诉'}
            </Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
