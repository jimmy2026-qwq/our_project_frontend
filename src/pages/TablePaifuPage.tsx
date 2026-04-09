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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import type { TablePaifuDetail } from '@/domain/operations';

function getOutcomeLabel(outcome: string) {
  switch (outcome) {
    case 'Tsumo':
      return 'Tsumo';
    case 'Ron':
      return 'Ron';
    case 'ExhaustiveDraw':
      return 'Exhaustive Draw';
    case 'AbortiveDraw':
      return 'Abortive Draw';
    default:
      return outcome;
  }
}

export function TablePaifuPage() {
  const { tableId = '' } = useParams();
  const [paifu, setPaifu] = useState<TablePaifuDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);

  useEffect(() => {
    let cancelled = false;

    async function loadPaifu() {
      try {
        setIsLoading(true);
        setError(null);
        const payload = await operationsApi.getTablePaifus(tableId);

        if (!cancelled) {
          setPaifu(payload.items[0] ?? null);
          if (!payload.items[0]) {
            setError('No paifu record is available for this table yet.');
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setPaifu(null);
          setError(
            loadError instanceof ApiError
              ? loadError.message
              : loadError instanceof Error
                ? loadError.message
                : 'Failed to load paifu details.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (tableId) {
      void loadPaifu();
    } else {
      setError('Missing table id.');
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [reloadKey, tableId]);

  const rounds = useMemo(() => paifu?.rounds ?? [], [paifu]);
  const standings = useMemo(() => paifu?.finalStandings ?? [], [paifu]);
  const backLink = paifu?.metadata.tournamentId ? `/public/tournaments/${paifu.metadata.tournamentId}` : '/public';

  if (isLoading) {
    return (
      <section className="grid gap-6">
        <LoadingProgress
          label="Loading paifu"
          message="Fetching the archived match record and round summaries."
        />
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Table Paifu</Badge>
            {paifu ? <Badge>Archived match</Badge> : null}
          </div>
          <div>
            <h1 className="text-[clamp(2rem,3vw,2.5rem)] font-semibold text-[color:var(--text)]">Table Paifu</h1>
            <p className="text-[color:var(--muted-strong)]">Table id {tableId}</p>
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

      {error ? (
        <Alert variant="warning">
          <AlertTitle>Paifu unavailable</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {paifu ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Final Standings</CardTitle>
              <CardDescription>Review the archived finishing order and final points for the table.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Place</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Seat</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Uma</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((item) => (
                    <TableRow key={item.playerId}>
                      <TableCell>{item.placement}</TableCell>
                      <TableCell>{item.playerId}</TableCell>
                      <TableCell>{item.seat}</TableCell>
                      <TableCell>{item.finalPoints}</TableCell>
                      <TableCell>{item.uma ?? 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Round Timeline</CardTitle>
              <CardDescription>Each block summarizes the round descriptor, outcome, and key scoring details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {rounds.map((round, index) => (
                <div
                  key={`${round.descriptor.roundWind}-${round.descriptor.handNumber}-${index}`}
                  className="rounded-[20px] border border-[color:var(--line)] bg-[rgba(7,18,28,0.72)] p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <strong>
                      {round.descriptor.roundWind} {round.descriptor.handNumber}
                    </strong>
                    <Badge>{getOutcomeLabel(round.result.outcome)}</Badge>
                    <span className="text-sm text-[color:var(--muted-strong)]">
                      Actions: {round.actions.length}
                    </span>
                  </div>
                  <div className="grid gap-1 text-sm text-[color:var(--muted-strong)]">
                    <span>Winner: {round.result.winner ?? 'N/A'}</span>
                    <span>Target: {round.result.target ?? 'N/A'}</span>
                    <span>
                      Han/Fu: {round.result.han ?? '-'} / {round.result.fu ?? '-'}
                    </span>
                    <span>Points: {round.result.points}</span>
                    <span>Honba: {round.descriptor.honba}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : null}
    </section>
  );
}
