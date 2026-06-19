import type { SeatWind } from '@/objects/tournament';
import type { TableDetail } from '@/pages/objects/TournamentViews';

import { getDemoTablePaifuRounds } from './functions/getDemoTablePaifuRounds';
import { demoFinalStandings } from './objects/TablePaifuDemoFinalStandings';
import {
  demoPlayerIdBySeat,
  demoSeats,
} from './objects/TablePaifuDemoSeats';
import type { TablePaifuDetail } from './types';

// Demo boundary: this file is temporary frontend-only data for testing the
// paifu page before the game engine can produce real paifu records.
// Removal path: delete this file and remove the fallback calls to
// `createDemoTablePaifu` from `index.tsx` once TournamentPaifuListAPI returns
// real records in local/dev environments.
export function createDemoTablePaifu(tableId: string): TablePaifuDetail {
  return {
    id: `demo-paifu-${tableId || 'table'}`,
    metadata: {
      tableId: tableId || 'demo-table-01',
      tournamentId: 'demo-tournament',
      stageId: 'demo-stage',
      recordedAt: new Date('2026-05-21T12:00:00+08:00').toISOString(),
      source: 'frontend-demo-paifu',
      seats: demoSeats.map((seat) => ({ ...seat })),
      matchRecordId: null,
    },
    finalStandings: demoFinalStandings.map((standing) => ({ ...standing })),
    rounds: getDemoTablePaifuRounds(),
  };
}

export function createDemoTablePaifuForTable(
  table: TableDetail,
): TablePaifuDetail {
  const demoPaifu = createDemoTablePaifu(table.id);
  const tableSeatByWind = Object.fromEntries(
    table.seats.map((seat) => [seat.seat, seat]),
  ) as Partial<Record<SeatWind, TableDetail['seats'][number]>>;
  const demoSeatByPlayer = Object.fromEntries(
    Object.entries(demoPlayerIdBySeat).map(([seat, playerId]) => [
      playerId,
      seat as SeatWind,
    ]),
  );
  const playerIdMap = Object.fromEntries(
    Object.entries(demoPlayerIdBySeat).map(([seat, demoPlayerId]) => [
      demoPlayerId,
      tableSeatByWind[seat as SeatWind]?.playerId ?? demoPlayerId,
    ]),
  );

  function toDemoPlayerId(playerId: string) {
    return playerIdMap[playerId] ?? playerId;
  }

  function toDemoInitialHands(initialHands: Record<string, string[]>) {
    return Object.fromEntries(
      Object.entries(initialHands).map(([playerId, tiles]) => [
        toDemoPlayerId(playerId),
        [...tiles],
      ]),
    );
  }

  return {
    ...demoPaifu,
    id: `demo-paifu-${table.id}`,
    metadata: {
      ...demoPaifu.metadata,
      tableId: table.id,
      tournamentId: table.tournamentId,
      stageId: table.stageId,
      recordedAt: new Date().toISOString(),
      seats: table.seats.map((seat) => ({
        seat: seat.seat,
        playerId: seat.playerId,
        initialPoints: seat.initialPoints,
        disconnected: seat.disconnected,
        ready: seat.ready,
        clubId: seat.clubId ?? null,
      })),
      matchRecordId: null,
    },
    finalStandings: demoPaifu.finalStandings.map((standing) => {
      const seat = demoSeatByPlayer[standing.playerId] ?? standing.seat;
      const tableSeat = tableSeatByWind[seat];

      return {
        ...standing,
        playerId: toDemoPlayerId(standing.playerId),
        seat,
        finalPoints:
          (tableSeat?.initialPoints ?? 25000) + (standing.finalPoints - 25000),
      };
    }),
    rounds: demoPaifu.rounds.map((round) => ({
      ...round,
      initialHands: toDemoInitialHands(round.initialHands),
      actions: round.actions.map((action) => ({
        ...action,
        actor: action.actor ? toDemoPlayerId(action.actor) : undefined,
        fromPlayer: action.fromPlayer
          ? toDemoPlayerId(action.fromPlayer)
          : undefined,
      })),
      result: {
        ...round.result,
        winner: round.result.winner
          ? toDemoPlayerId(round.result.winner)
          : undefined,
        target: round.result.target
          ? toDemoPlayerId(round.result.target)
          : undefined,
        scoreChanges: round.result.scoreChanges.map((change) => ({
          ...change,
          playerId: toDemoPlayerId(change.playerId),
        })),
        tenpaiPlayerIds: round.result.tenpaiPlayerIds?.map(toDemoPlayerId),
      },
    })),
  };
}
