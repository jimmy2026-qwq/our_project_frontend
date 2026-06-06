import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { AgariResult, MahjongSeatView } from '@/objects';
import { MatchResultOverlay } from '@/pages/TableMatchPage/components/MatchBoard/MatchResultOverlay';

const playerNames = {
  east: 'larry1',
  south: 'larry2',
  west: 'larry3',
  north: 'larry4',
};

const seats: MahjongSeatView[] = [
  createSeat({
    isDealer: true,
    playerId: 'east',
    river: [
      {
        calledBy: null,
        playerId: 'east',
        riichiDeclared: false,
        sequenceNo: 16,
        tile: '9m',
        tsumogiri: false,
      },
    ],
    seat: 'East',
  }),
  createSeat({
    handTiles: [
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
    playerId: 'south',
    seat: 'South',
  }),
  createSeat({
    handTiles: [
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
    playerId: 'west',
    seat: 'West',
  }),
  createSeat({ playerId: 'north', seat: 'North' }),
];

describe('MatchResultOverlay rendering', () => {
  it('renders only the first winner before the total score page in a double ron', () => {
    const markup = renderToStaticMarkup(
      <MatchResultOverlay
        playerNames={playerNames}
        result={doubleRonResult}
        seats={seats}
      />,
    );

    expect(markup).toContain('双响');
    expect(markup).toContain('larry2');
    expect(markup).toContain('1/2');
    expect(markup).toContain('放铳：larry1');
    expect(markup).toContain('立直');
    expect(markup).toContain('7,700 / 3番40符');
    expect(markup).not.toContain('larry3');
    expect(markup).not.toContain('本局总点数');
  });

  it('keeps win result text readable on the dark overlay', () => {
    const markup = renderToStaticMarkup(
      <MatchResultOverlay
        playerNames={playerNames}
        result={singleTsumoResult}
        seats={seats}
      />,
    );

    expect(markup).toContain('bg-[rgba(0,0,0,0.84)]');
    expect(markup).toContain('text-[#f2f7fb]');
    expect(markup).toContain('自摸');
    expect(markup).toContain('larry1');
    expect(markup).toContain('12,000 / 4番30符');
  });

  it('renders exhaustive draw tenpai names without a winner sequence', () => {
    const markup = renderToStaticMarkup(
      <MatchResultOverlay
        playerNames={playerNames}
        result={exhaustiveDrawResult}
        seats={seats}
      />,
    );

    expect(markup).toContain('流局结算');
    expect(markup).toContain('荒牌流局');
    expect(markup).toContain('听牌：larry2');
    expect(markup).toContain('听牌：larry4');
    expect(markup).toContain('<button');
    expect(markup).toContain('继续');
  });
});

function createSeat({
  handTiles = [],
  isDealer = false,
  playerId,
  river = [],
  seat,
}: Pick<MahjongSeatView, 'playerId' | 'seat'> &
  Partial<Pick<MahjongSeatView, 'handTiles' | 'isDealer' | 'river'>>): MahjongSeatView {
  return {
    furiten: false,
    handTileCount: handTiles.length,
    handTiles,
    ippatsu: false,
    isDealer,
    melds: [],
    playerId,
    points: 25000,
    riichi: false,
    river,
    seat,
    tenpai: null,
  };
}

const doubleRonResult: AgariResult = {
  doraIndicators: null,
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
  settlement: null,
  target: 'east',
  tenpaiPlayerIds: null,
  uraDoraIndicators: null,
  uraDoraVisible: null,
  winner: 'south',
  wins: [
    {
      doraIndicators: null,
      fu: 40,
      han: 3,
      points: 7700,
      target: 'east',
      uraDoraIndicators: null,
      uraDoraVisible: null,
      winner: 'south',
      yaku: [{ han: 1, kind: 'Riichi' }],
    },
    {
      doraIndicators: null,
      fu: 30,
      han: 2,
      points: 3900,
      target: 'east',
      uraDoraIndicators: null,
      uraDoraVisible: null,
      winner: 'west',
      yaku: [{ han: 1, kind: 'Pinfu' }],
    },
  ],
  yaku: [{ han: 1, kind: 'Riichi' }],
};

const singleTsumoResult: AgariResult = {
  doraIndicators: null,
  fu: 30,
  han: 4,
  outcome: 'Tsumo',
  points: 12000,
  scoreChanges: [
    { delta: 12000, playerId: 'east' },
    { delta: -4000, playerId: 'south' },
    { delta: -4000, playerId: 'west' },
    { delta: -4000, playerId: 'north' },
  ],
  settlement: null,
  target: null,
  tenpaiPlayerIds: null,
  uraDoraIndicators: null,
  uraDoraVisible: null,
  winner: 'east',
  yaku: [{ han: 1, kind: 'MenzenTsumo' }],
};

const exhaustiveDrawResult: AgariResult = {
  doraIndicators: null,
  fu: null,
  han: null,
  outcome: 'ExhaustiveDraw',
  points: 0,
  scoreChanges: [
    { delta: -1500, playerId: 'east' },
    { delta: 1500, playerId: 'south' },
    { delta: -1500, playerId: 'west' },
    { delta: 1500, playerId: 'north' },
  ],
  settlement: null,
  target: null,
  tenpaiPlayerIds: ['south', 'north'],
  uraDoraIndicators: null,
  uraDoraVisible: null,
  winner: null,
  yaku: [],
};
