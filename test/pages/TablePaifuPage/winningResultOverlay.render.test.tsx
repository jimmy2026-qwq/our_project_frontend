import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { WinningResultOverlay } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PaifuOverlays/WinningResultOverlay';
import { getReplaySnapshot } from '@/pages/TablePaifuPage/functions/getReplay';
import type {
  PaifuAction,
  PaifuRoundSummary,
  TablePaifuDetail,
} from '@/pages/TablePaifuPage/types';

const playerNames = {
  east: 'larry1',
  south: 'larry2',
  west: 'larry3',
  north: 'larry4',
};

const paifu: TablePaifuDetail = {
  finalStandings: [],
  id: 'paifu-ui-render',
  metadata: {
    playerNames,
    recordedAt: '2026-06-05T00:00:00Z',
    seats: [
      createSeat('East', 'east'),
      createSeat('South', 'south'),
      createSeat('West', 'west'),
      createSeat('North', 'north'),
    ],
    stageId: 'stage-1',
    tableId: 'table-1',
    tournamentId: 'tournament-1',
  },
  rounds: [],
};

const winAction: PaifuAction = {
  actionType: 'Win',
  actor: 'south',
  handTilesAfterAction: [
    '1m',
    '2m',
    '3m',
    '4p',
    '5p',
    '6p',
    '2s',
    '3s',
    '4s',
    '7s',
    '8s',
    '9s',
    '9m',
  ],
  revealedTiles: [],
  sequenceNo: 2,
  tile: '9m',
};

const doubleRonRound: PaifuRoundSummary = {
  actions: [
    {
      actionType: 'Discard',
      actor: 'east',
      handTilesAfterAction: ['1m', '2m', '3m'],
      revealedTiles: ['9m'],
      sequenceNo: 1,
      tile: '9m',
    },
    winAction,
  ],
  descriptor: { handNumber: 1, honba: 0, roundWind: 'East' },
  initialHands: {
    east: ['1m', '2m', '3m', '9m'],
    north: ['1s', '2s', '3s'],
    south: [
      '1m',
      '2m',
      '3m',
      '4p',
      '5p',
      '6p',
      '2s',
      '3s',
      '4s',
      '7s',
      '8s',
      '9s',
      '9m',
    ],
    west: [
      '1p',
      '1p',
      '2p',
      '3p',
      '4p',
      '5p',
      '6p',
      '7m',
      '8m',
      '9m',
      '3s',
      '4s',
      '5s',
    ],
  },
  result: {
    doraIndicators: ['3m'],
    fu: 40,
    han: 3,
    outcome: 'Ron',
    points: 11600,
    scoreChanges: [
      { delta: -11600, playerId: 'east' },
      { delta: 7700, playerId: 'south' },
      { delta: 3900, playerId: 'west' },
      { delta: 0, playerId: 'north' },
    ],
    target: 'east',
    uraDoraIndicators: ['7p'],
    uraDoraVisible: false,
    winner: 'south',
    wins: [
      {
        doraIndicators: ['3m'],
        fu: 40,
        han: 3,
        points: 7700,
        target: 'east',
        uraDoraIndicators: ['7p'],
        uraDoraVisible: false,
        winner: 'south',
        yaku: [{ han: 1, kind: 'Riichi' }],
      },
      {
        doraIndicators: ['3m'],
        fu: 30,
        han: 2,
        points: 3900,
        target: 'east',
        uraDoraIndicators: ['7p'],
        uraDoraVisible: false,
        winner: 'west',
        yaku: [{ han: 1, kind: 'Pinfu' }],
      },
    ],
    yaku: [{ han: 1, kind: 'Riichi' }],
  },
};

describe('WinningResultOverlay rendering', () => {
  it('starts a paifu double ron result with the first single-winner page', () => {
    const markup = renderToStaticMarkup(
      <WinningResultOverlay
        action={winAction}
        onConfirm={vi.fn()}
        playerNames={playerNames}
        replaySnapshot={getReplaySnapshot(paifu, doubleRonRound, 2)}
        replayStep={2}
        round={doubleRonRound}
      />,
    );

    expect(markup).toContain('荣和');
    expect(markup).toContain('larry2');
    expect(markup).toContain('放铳：larry1');
    expect(markup).toContain('1/2');
    expect(markup).toContain('表宝牌');
    expect(markup).toContain('里宝牌');
    expect(markup).toContain('7,700 / 3番40符');
    expect(markup).toContain('继续');
    expect(markup).not.toContain('larry3');
    expect(markup).not.toContain('本局总点数');
  });

  it('keeps the paifu result overlay in the light-on-dark style', () => {
    const markup = renderToStaticMarkup(
      <WinningResultOverlay
        action={winAction}
        onConfirm={vi.fn()}
        playerNames={playerNames}
        replaySnapshot={getReplaySnapshot(paifu, doubleRonRound, 2)}
        replayStep={2}
        round={doubleRonRound}
      />,
    );

    expect(markup).toContain('bg-[rgba(0,0,0,0.84)]');
    expect(markup).toContain('text-[#f2f7fb]');
    expect(markup).toContain('text-[#ffd98a]');
  });
});

function createSeat(seat: 'East' | 'South' | 'West' | 'North', playerId: string) {
  return {
    disconnected: false,
    initialPoints: 25000,
    playerId,
    ready: true,
    seat,
  };
}
