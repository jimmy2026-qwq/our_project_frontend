import { describe, expect, it } from 'vitest';

import {
  getAddedTileIndex,
  removeFirstMatchingTile,
} from '@/pages/TablePaifuPage/functions/getReplaySnapshotHands';
import {
  claimDiscard,
  getClosedKanTiles,
  getOpenMeldTiles,
  isCallAction,
  isKanAction,
} from '@/pages/TablePaifuPage/functions/getReplaySnapshotMelds';
import { getOpenMeldSidewaysIndex } from '@/pages/TablePaifuPage/functions/getReplaySnapshotRelations';
import {
  collectPaifuPlayerIds,
  getStageDisplayName,
} from '@/pages/TablePaifuPage/functions/getTablePaifuMetadata';
import type {
  PaifuAction,
  TablePaifuDetail,
} from '@/pages/TablePaifuPage/types';
import type { RiverDiscard } from '@/pages/TablePaifuPage/objects/ReplaySnapshot.types';
import type { SeatWind } from '@/objects';

describe('replay snapshot helper functions', () => {
  it('detects drawn tile indexes while respecting duplicates and preferred tiles', () => {
    expect(
      getAddedTileIndex({
        beforeTiles: ['1m', '2m', '2m'],
        afterTiles: ['1m', '2m', '2m', '3m'],
      }),
    ).toBe(3);
    expect(
      getAddedTileIndex({
        beforeTiles: ['1m'],
        afterTiles: ['5p', '1m', '6p'],
        preferredTile: '6p',
      }),
    ).toBe(2);
    expect(
      getAddedTileIndex({
        beforeTiles: ['1m'],
        afterTiles: ['1m'],
        preferredTile: '9s',
      }),
    ).toBe(0);

    expect(removeFirstMatchingTile(['1m', '2m', '1m'], '1m')).toEqual([
      '2m',
      '1m',
    ]);
    expect(removeFirstMatchingTile(['1m', '2m'], '9s')).toEqual(['1m', '2m']);
    expect(removeFirstMatchingTile(['1m', '2m'])).toEqual(['1m', '2m']);
  });

  it('claims discards by sequence, explicit player and legacy tile search', () => {
    const rivers = buildRivers({
      East: [
        { sequenceNo: 1, playerId: 'east', tile: '1m' },
        { sequenceNo: 2, playerId: 'east', tile: '2m' },
      ],
      West: [{ sequenceNo: 3, playerId: 'west', tile: '3m' }],
      North: [{ sequenceNo: 4, playerId: 'north', tile: '4m' }],
    });

    expect(
      claimDiscard({
        action: action({ targetSequenceNo: 2, tile: '2m' }),
        callerSeat: 'South',
        paifu,
        rivers,
      }),
    ).toEqual({
      seat: 'East',
      discard: { sequenceNo: 2, playerId: 'east', tile: '2m' },
    });
    expect(rivers.East).toEqual([{ sequenceNo: 1, playerId: 'east', tile: '1m' }]);

    expect(
      claimDiscard({
        action: action({ fromPlayer: 'west', tile: '3m' }),
        callerSeat: 'South',
        paifu,
        rivers,
      }),
    ).toEqual({
      seat: 'West',
      discard: { sequenceNo: 3, playerId: 'west', tile: '3m' },
    });

    expect(
      claimDiscard({
        action: action({ tile: '4m' }),
        callerSeat: 'South',
        paifu,
        rivers,
      }),
    ).toEqual({
      seat: 'North',
      discard: { sequenceNo: 4, playerId: 'north', tile: '4m' },
    });

    expect(
      claimDiscard({
        action: action({ tile: '9s' }),
        callerSeat: 'South',
        paifu,
        rivers,
      }),
    ).toBeUndefined();
  });

  it('formats open and closed meld tiles with relation-aware sideways markers', () => {
    expect(
      getOpenMeldSidewaysIndex({
        action: action({ actionType: 'Chi' }),
        callerSeat: 'South',
        claimedSeat: 'East',
        tileCount: 3,
      }),
    ).toBe(0);
    expect(
      getOpenMeldSidewaysIndex({
        action: action({ actionType: 'Pon' }),
        callerSeat: 'East',
        claimedSeat: 'South',
        tileCount: 3,
      }),
    ).toBe(2);
    expect(
      getOpenMeldSidewaysIndex({
        action: action({ actionType: 'OpenKan' }),
        callerSeat: 'East',
        claimedSeat: 'South',
        tileCount: 4,
      }),
    ).toBe(3);
    expect(
      getOpenMeldSidewaysIndex({
        action: action({ actionType: 'Pon' }),
        callerSeat: 'East',
        tileCount: 3,
      }),
    ).toBeUndefined();

    expect(
      getOpenMeldTiles({
        action: action({
          actionType: 'Chi',
          tile: '3m',
          revealedTiles: ['1m', '2m', '3m'],
        }),
        callerSeat: 'South',
        claimedSeat: 'East',
      }),
    ).toEqual([
      { tile: '3m', sideways: true },
      { tile: '1m', sideways: false },
      { tile: '2m', sideways: false },
    ]);
    expect(
      getOpenMeldTiles({
        action: action({ actionType: 'OpenKan', tile: '7p', revealedTiles: [] }),
        callerSeat: 'East',
        claimedSeat: 'West',
      }),
    ).toEqual([
      { tile: '7p', sideways: false },
      { tile: '7p', sideways: true },
      { tile: '7p', sideways: false },
      { tile: '7p', sideways: false },
    ]);
    expect(
      getClosedKanTiles(
        action({ actionType: 'ClosedKan', tile: '5p', revealedTiles: [] }),
      ),
    ).toEqual([
      { tile: '5p', concealed: true },
      { tile: '0p', concealed: false },
      { tile: '5p', concealed: false },
      { tile: '5p', concealed: true },
    ]);
  });

  it('classifies call and kan actions', () => {
    expect(isCallAction(action({ actionType: 'Chi' }))).toBe(true);
    expect(isCallAction(action({ actionType: 'Pon' }))).toBe(true);
    expect(isCallAction(action({ actionType: 'OpenKan' }))).toBe(true);
    expect(isCallAction(action({ actionType: 'Discard' }))).toBe(false);

    expect(isKanAction(action({ actionType: 'Kan' }))).toBe(true);
    expect(isKanAction(action({ actionType: 'OpenKan' }))).toBe(true);
    expect(isKanAction(action({ actionType: 'ClosedKan' }))).toBe(true);
    expect(isKanAction(action({ actionType: 'AddedKan' }))).toBe(true);
    expect(isKanAction(action({ actionType: 'Pon' }))).toBe(false);
  });

  it('collects paifu participant ids and derives display stage names', () => {
    expect(collectPaifuPlayerIds(paifuWithMetadata)).toEqual([
      'east',
      'south',
      'winner',
      'standings-only',
      'hand-only',
      'actor-only',
      'target',
      'second-winner',
      'tenpai-only',
    ]);
    expect(
      getStageDisplayName(
        { name: 'Summer Cup' } as never,
        { format: 'Swiss', name: 'Round 1' } as never,
      ),
    ).toBe('Summer Cup 瑞士轮');
    expect(
      getStageDisplayName(
        { name: 'Summer Cup' } as never,
        { format: 'Knockout', name: 'Finals' } as never,
      ),
    ).toBe('Summer Cup 淘汰赛');
    expect(
      getStageDisplayName(
        { name: 'Summer Cup' } as never,
        { format: 'Custom', name: 'Invitational' } as never,
      ),
    ).toBe('Invitational');
    expect(getStageDisplayName({ name: 'Summer Cup' } as never)).toBeUndefined();
  });
});

const paifu: TablePaifuDetail = {
  id: 'paifu-a',
  metadata: {
    tableId: 'table-a',
    tournamentId: 'tournament-a',
    stageId: 'stage-a',
    recordedAt: '2026-06-06T00:00:00Z',
    seats: [
      seat('East', 'east'),
      seat('South', 'south'),
      seat('West', 'west'),
      seat('North', 'north'),
    ],
  },
  rounds: [],
  finalStandings: [],
};

const paifuWithMetadata: TablePaifuDetail = {
  ...paifu,
  metadata: {
    ...paifu.metadata,
    seats: [seat('East', 'east'), seat('South', 'south')],
  },
  finalStandings: [
    { playerId: 'winner', seat: 'East', finalPoints: 36000, placement: 1 },
    {
      playerId: 'standings-only',
      seat: 'South',
      finalPoints: 24000,
      placement: 2,
    },
  ],
  rounds: [
    {
      descriptor: { roundWind: 'East', handNumber: 1, honba: 0 },
      initialHands: { 'hand-only': ['1m'] },
      actions: [action({ actor: 'actor-only', tile: '2m' })],
      result: {
        outcome: 'Ron',
        winner: 'winner',
        target: 'target',
        yaku: [],
        points: 1000,
        scoreChanges: [
          { playerId: 'winner', delta: 1000 },
          { playerId: 'target', delta: -1000 },
        ],
        tenpaiPlayerIds: ['tenpai-only'],
        wins: [
          {
            winner: 'winner',
            target: 'target',
            han: 1,
            fu: 30,
            yaku: [],
            points: 1000,
          },
          {
            winner: 'second-winner',
            target: 'target',
            han: 1,
            fu: 30,
            yaku: [],
            points: 1000,
          },
        ],
      },
    },
  ],
};

function buildRivers(
  patch: Partial<Record<SeatWind, RiverDiscard[]>>,
): Record<SeatWind, RiverDiscard[]> {
  return {
    East: [],
    South: [],
    West: [],
    North: [],
    ...patch,
  };
}

function action(patch: Partial<PaifuAction> = {}): PaifuAction {
  return {
    sequenceNo: 1,
    actor: 'south',
    actionType: 'Pon',
    tile: '1m',
    handTilesAfterAction: [],
    revealedTiles: [],
    ...patch,
  };
}

function seat(seatWind: SeatWind, playerId: string) {
  return {
    seat: seatWind,
    playerId,
    initialPoints: 25000,
    disconnected: false,
    ready: true,
  };
}
