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
    },
    finalStandings: [
      {
        playerId: 'player-east',
        seat: 'East',
        finalPoints: 31000,
        placement: 1,
        uma: 20,
        oka: 0,
      },
      {
        playerId: 'player-south',
        seat: 'South',
        finalPoints: 28300,
        placement: 2,
        uma: 10,
        oka: 0,
      },
      {
        playerId: 'player-west',
        seat: 'West',
        finalPoints: 23100,
        placement: 3,
        uma: -10,
        oka: 0,
      },
      {
        playerId: 'player-north',
        seat: 'North',
        finalPoints: 17600,
        placement: 4,
        uma: -20,
        oka: 0,
      },
    ],
    rounds: [
      {
        descriptor: {
          roundWind: 'East',
          handNumber: 1,
          honba: 0,
        },
        actions: [
          { sequenceNo: 1, actor: 'player-east', actionType: 'Draw', tile: '5m' },
          { sequenceNo: 2, actor: 'player-east', actionType: 'Discard', tile: '9s' },
          { sequenceNo: 3, actor: 'player-south', actionType: 'Draw', tile: '3p' },
          { sequenceNo: 4, actor: 'player-south', actionType: 'Discard', tile: '1z' },
        ],
        result: {
          outcome: 'Tsumo',
          winner: 'player-east',
          han: 3,
          fu: 30,
          points: 6000,
        },
      },
      {
        descriptor: {
          roundWind: 'East',
          handNumber: 2,
          honba: 1,
        },
        actions: [
          { sequenceNo: 1, actor: 'player-south', actionType: 'Draw', tile: '7p' },
          { sequenceNo: 2, actor: 'player-south', actionType: 'Discard', tile: '2m' },
          { sequenceNo: 3, actor: 'player-west', actionType: 'Call', tile: '2m' },
          { sequenceNo: 4, actor: 'player-west', actionType: 'Discard', tile: '8s' },
        ],
        result: {
          outcome: 'Ron',
          winner: 'player-west',
          target: 'player-north',
          han: 2,
          fu: 40,
          points: 3900,
        },
      },
      {
        descriptor: {
          roundWind: 'East',
          handNumber: 3,
          honba: 0,
        },
        actions: [
          { sequenceNo: 1, actor: 'player-north', actionType: 'Draw', tile: '6s' },
          { sequenceNo: 2, actor: 'player-north', actionType: 'Discard', tile: '4p' },
          { sequenceNo: 3, actor: 'player-south', actionType: 'Riichi' },
          { sequenceNo: 4, actor: 'player-south', actionType: 'Discard', tile: '7m' },
        ],
        result: {
          outcome: 'Ron',
          winner: 'player-south',
          target: 'player-north',
          han: 1,
          fu: 30,
          points: 1300,
        },
      },
    ],
  };
}
