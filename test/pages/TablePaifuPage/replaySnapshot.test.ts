import { describe, expect, it } from 'vitest';

import { getReplaySnapshot } from '@/pages/TablePaifuPage/functions/getReplay';
import type {
  PaifuRoundSummary,
  TablePaifuDetail,
} from '@/pages/TablePaifuPage/types';

const paifu: TablePaifuDetail = {
  id: 'paifu-snapshot',
  metadata: {
    tableId: 'table-1',
    tournamentId: 'tournament-1',
    stageId: 'stage-1',
    recordedAt: '2026-06-05T00:00:00Z',
    seats: [
      {
        seat: 'East',
        playerId: 'east',
        initialPoints: 25000,
        disconnected: false,
        ready: true,
      },
      {
        seat: 'South',
        playerId: 'south',
        initialPoints: 25000,
        disconnected: false,
        ready: true,
      },
      {
        seat: 'West',
        playerId: 'west',
        initialPoints: 25000,
        disconnected: false,
        ready: true,
      },
      {
        seat: 'North',
        playerId: 'north',
        initialPoints: 25000,
        disconnected: false,
        ready: true,
      },
    ],
  },
  rounds: [],
  finalStandings: [],
};

const round: PaifuRoundSummary = {
  descriptor: { roundWind: 'East', handNumber: 1, honba: 0 },
  initialHands: {
    east: ['1m', '2m', '3m'],
    south: ['1m', '1m', '2p', '3p'],
    west: ['5m', '5m', '5m', '5m'],
    north: [],
  },
  actions: [
    {
      sequenceNo: 1,
      actor: 'east',
      actionType: 'Draw',
      tile: '4m',
      handTilesAfterAction: ['1m', '2m', '3m', '4m'],
      revealedTiles: [],
    },
    {
      sequenceNo: 2,
      actor: 'east',
      actionType: 'Riichi',
      tile: '1m',
      handTilesAfterAction: ['2m', '3m', '4m'],
      revealedTiles: ['1m'],
    },
    {
      sequenceNo: 3,
      actor: 'south',
      actionType: 'Pon',
      tile: '1m',
      fromPlayer: 'east',
      targetSequenceNo: 2,
      handTilesAfterAction: ['2p', '3p'],
      revealedTiles: ['1m', '1m', '1m'],
    },
    {
      sequenceNo: 4,
      actor: 'west',
      actionType: 'ClosedKan',
      tile: '5m',
      handTilesAfterAction: [],
      revealedTiles: ['5m', '0m', '5m', '5m'],
    },
  ],
  result: {
    outcome: 'AbortiveDraw',
    yaku: [],
    points: 0,
    scoreChanges: [
      { playerId: 'east', delta: 0 },
      { playerId: 'south', delta: 0 },
      { playerId: 'west', delta: 0 },
      { playerId: 'north', delta: 0 },
    ],
  },
};

describe('TablePaifuPage replay snapshot', () => {
  it('shows the drawn tile before the first replay action', () => {
    const snapshot = getReplaySnapshot(paifu, round, 0);

    expect(snapshot.hands.east).toEqual(['1m', '2m', '3m', '4m']);
    expect(snapshot.drawnTileIndexes.east).toBe(3);
    expect(snapshot.rivers.East).toEqual([]);
  });

  it('keeps a riichi discard sideways until it is claimed', () => {
    const snapshot = getReplaySnapshot(paifu, round, 1);

    expect(snapshot.hands.east).toEqual(['2m', '3m', '4m']);
    expect(snapshot.drawnTileIndexes.east).toBeUndefined();
    expect(snapshot.rivers.East).toEqual([
      {
        sequenceNo: 2,
        playerId: 'east',
        tile: '1m',
        sideways: true,
      },
    ]);
  });

  it('claims the target discard and creates a sideways open meld', () => {
    const snapshot = getReplaySnapshot(paifu, round, 2);

    expect(snapshot.rivers.East).toEqual([]);
    expect(snapshot.hands.south).toEqual(['2p', '3p']);
    expect(snapshot.melds.South).toEqual([
      {
        actionType: 'Pon',
        tiles: [
          { tile: '1m', sideways: true },
          { tile: '1m', sideways: false },
          { tile: '1m', sideways: false },
        ],
      },
    ]);
  });

  it('renders closed kan edge tiles as concealed and keeps red five visible', () => {
    const snapshot = getReplaySnapshot(paifu, round, 3);

    expect(snapshot.melds.West).toEqual([
      {
        actionType: 'ClosedKan',
        tiles: [
          { tile: '5m', concealed: true },
          { tile: '0m', concealed: false },
          { tile: '5m', concealed: false },
          { tile: '5m', concealed: true },
        ],
      },
    ]);
  });
});
