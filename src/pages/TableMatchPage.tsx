import { useEffect, useMemo, useReducer, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ApiError } from '@/api/http';
import { operationsApi, type TableDetail } from '@/api/operations';
import { Alert, AlertDescription, AlertTitle, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, LoadingProgress, StatusPill } from '@/components/ui';

function getTableStatusLabel(status: TableDetail['status']) {
  switch (status) {
    case 'WaitingPreparation':
      return '准备中';
    case 'InProgress':
      return '对局中';
    case 'Scoring':
      return '结算中';
    case 'AppealPending':
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
    return '断线';
  }

  if (detail.ready) {
    return '已就绪';
  }

  return '等待准备';
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
        <StatusPill tone={getSeatStatusTone({ ready, disconnected })}>{getSeatStatusLabel({ ready, disconnected })}</StatusPill>
      </div>
      <div className="grid gap-2 text-sm text-[color:var(--muted-strong)]">
        <span className="font-medium text-[color:var(--text)]">{playerId}</span>
        <span>Ready: {ready ? 'Yes' : 'No'}</span>
        <span>Connected: {disconnected ? 'No' : 'Yes'}</span>
      </div>
    </div>
  );
}

export function TableMatchPage() {
  const { tableId = '' } = useParams();
  const [table, setTable] = useState<TableDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);

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
        const payload = await operationsApi.getTable(tableId);

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
                : '牌桌信息暂时无法加载。';
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
      setError('缺少牌桌编号。');
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

  if (isLoading) {
    return (
      <section className="grid gap-6">
        <LoadingProgress label="正在进入牌桌" message="正在加载当前牌桌状态与四家座位信息。" />
      </section>
    );
  }

  if (error || !table) {
    return (
      <section className="grid gap-6">
        <Alert variant="danger">
          <AlertTitle>牌桌加载失败</AlertTitle>
          <AlertDescription>{error ?? '牌桌不存在或暂时不可访问。'}</AlertDescription>
        </Alert>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => forceReload()}>重新加载</Button>
          <Link
            to="/tournament-ops"
            className="inline-flex min-h-[42px] items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-[color:var(--text)] no-underline transition-[transform,border-color] duration-200 hover:-translate-y-px"
          >
            返回赛事运营台
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>牌桌页面</Badge>
            <StatusPill tone={table.status === 'InProgress' ? 'success' : 'warning'}>
              {getTableStatusLabel(table.status)}
            </StatusPill>
            {isRefreshing ? <Badge>同步中</Badge> : null}
          </div>
          <div>
            <h1 className="text-[clamp(2rem,3vw,2.5rem)] font-semibold text-[color:var(--text)]">
              Table {String(table.tableNo).padStart(2, '0')}
            </h1>
            <p className="text-[color:var(--muted-strong)]">
              牌桌编号 {table.id} / 阶段 {table.stageId}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => forceReload()}>
            刷新牌桌
          </Button>
          <Link
            to="/tournament-ops"
            className="inline-flex min-h-[42px] items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-[color:var(--text)] no-underline transition-[transform,border-color] duration-200 hover:-translate-y-px"
          >
            返回赛事运营台
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>对局桌面</CardTitle>
          <CardDescription>
            这是当前已接通的真实牌桌页。现在会展示四家座位、准备状态和桌况；后续可以继续往里补牌谱、结算与申诉联动。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)] md:grid-rows-[auto_auto_auto]">
            <SeatCard
              wind="北家"
              playerId={seatMap.North?.playerId ?? '未分配'}
              ready={seatMap.North?.ready ?? false}
              disconnected={seatMap.North?.disconnected ?? false}
              className="md:col-start-2 md:row-start-1"
            />
            <SeatCard
              wind="西家"
              playerId={seatMap.West?.playerId ?? '未分配'}
              ready={seatMap.West?.ready ?? false}
              disconnected={seatMap.West?.disconnected ?? false}
              className="md:col-start-1 md:row-start-2"
            />
            <div className="rounded-[28px] border border-[rgba(236,197,122,0.22)] bg-[radial-gradient(circle_at_top,rgba(236,197,122,0.16),transparent_55%),linear-gradient(180deg,rgba(17,38,52,0.92),rgba(8,20,30,0.96))] p-6 text-center shadow-[var(--shadow-md)] md:col-start-2 md:row-start-2">
              <p className="mb-2 text-sm uppercase tracking-[0.32em] text-[color:var(--muted)]">Riichi Table</p>
              <div className="grid gap-2 text-sm text-[color:var(--muted-strong)]">
                <span>当前状态：{getTableStatusLabel(table.status)}</span>
                <span>已入座人数：{table.seats.length} / 4</span>
                <span>全部就绪：{table.seats.every((seat) => seat.ready) ? '是' : '否'}</span>
              </div>
            </div>
            <SeatCard
              wind="东家"
              playerId={seatMap.East?.playerId ?? '未分配'}
              ready={seatMap.East?.ready ?? false}
              disconnected={seatMap.East?.disconnected ?? false}
              className="md:col-start-3 md:row-start-2"
            />
            <SeatCard
              wind="南家"
              playerId={seatMap.South?.playerId ?? '未分配'}
              ready={seatMap.South?.ready ?? false}
              disconnected={seatMap.South?.disconnected ?? false}
              className="md:col-start-2 md:row-start-3"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
