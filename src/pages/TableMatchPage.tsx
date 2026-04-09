import { useEffect, useMemo, useReducer, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ApiError } from '@/api/http';
import { operationsApi } from '@/api/operations';
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
  LoadingProgress,
  StatusPill,
} from '@/components/ui';
import type { TableDetail } from '@/domain/operations';

function getTableStatusLabel(status: TableDetail['status']) {
  switch (status) {
    case 'WaitingPreparation':
      return 'Waiting';
    case 'InProgress':
      return 'In Progress';
    case 'Scoring':
      return 'Scoring';
    case 'AppealPending':
      return 'Appeal Pending';
    case 'Archived':
      return 'Archived';
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
    return 'Disconnected';
  }

  if (detail.ready) {
    return 'Ready';
  }

  return 'Waiting';
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
  const backLink = table?.tournamentId ? `/public/tournaments/${table.tournamentId}` : '/public';

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
  }, [reloadKey, table, tableId]);

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
        <LoadingProgress
          label="Loading match table"
          message="Fetching the current table state and seat readiness."
        />
      </section>
    );
  }

  if (error || !table) {
    return (
      <section className="grid gap-6">
        <Alert variant="danger">
          <AlertTitle>Unable to load table</AlertTitle>
          <AlertDescription>{error ?? 'Table data is unavailable.'}</AlertDescription>
        </Alert>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => forceReload()}>Retry</Button>
          <Link
            to={backLink}
            className="inline-flex min-h-[42px] items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-[color:var(--text)] no-underline transition-[transform,border-color] duration-200 hover:-translate-y-px"
          >
            Back to tournament
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
            <Badge>Table Match</Badge>
            <StatusPill tone={table.status === 'InProgress' ? 'success' : 'warning'}>
              {getTableStatusLabel(table.status)}
            </StatusPill>
            {isRefreshing ? <Badge>Refreshing</Badge> : null}
          </div>
          <div>
            <h1 className="text-[clamp(2rem,3vw,2.5rem)] font-semibold text-[color:var(--text)]">
              Table {String(table.tableNo).padStart(2, '0')}
            </h1>
            <p className="text-[color:var(--muted-strong)]">
              Table id {table.id} / Stage {table.stageId}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => forceReload()}>
            Refresh
          </Button>
          <Link
            to={backLink}
            className="inline-flex min-h-[42px] items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-[color:var(--text)] no-underline transition-[transform,border-color] duration-200 hover:-translate-y-px"
          >
            Back to tournament
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seat Overview</CardTitle>
          <CardDescription>
            Review the four seats, player assignments, and ready or disconnected state before starting or observing the
            match flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
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
              <p className="mb-2 text-sm uppercase tracking-[0.32em] text-[color:var(--muted)]">Riichi Table</p>
              <div className="grid gap-2 text-sm text-[color:var(--muted-strong)]">
                <span>Status: {getTableStatusLabel(table.status)}</span>
                <span>Seats populated: {table.seats.length} / 4</span>
                <span>Readiness: {allReady ? 'All seats ready' : 'Waiting on players'}</span>
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
        </CardContent>
      </Card>
    </section>
  );
}
