import type { SeatWind } from '@/objects/tournament';
import type { TableDetail } from '@/pages/objects/TournamentViews';
import type { TablePaifuDetail } from './types';

const demoSeats = [
  {
    seat: 'East',
    playerId: 'player-east',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
  {
    seat: 'South',
    playerId: 'player-south',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
  {
    seat: 'West',
    playerId: 'player-west',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
  {
    seat: 'North',
    playerId: 'player-north',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
] as const;

const demoPlayerIdBySeat: Record<SeatWind, string> = {
  East: 'player-east',
  South: 'player-south',
  West: 'player-west',
  North: 'player-north',
};

const fullDoraRow = ['4z', '6z', '5m', '2p', '7s'];
const fullUraDoraRow = ['1m', '3p', '9s', '2z', '7z'];

const eastNineTerminals = [
  '1m',
  '9m',
  '1s',
  '9s',
  '1p',
  '0p',
  '9p',
  '1z',
  '2z',
  '3z',
  '4z',
  '5z',
  '6z',
  '7z',
];

const southNineGatesTenpai = [
  '1p',
  '1p',
  '1p',
  '2p',
  '3p',
  '4p',
  '5p',
  '6p',
  '7p',
  '8p',
  '9p',
  '9p',
  '9p',
];

const westSouzuHand = [
  '1s',
  '1s',
  '1s',
  '2s',
  '3s',
  '4s',
  '5s',
  '6s',
  '7s',
  '8s',
  '9s',
  '9s',
  '9s',
];

const northManzuHand = [
  '1m',
  '1m',
  '1m',
  '2m',
  '3m',
  '4m',
  '5m',
  '6m',
  '7m',
  '8m',
  '9m',
  '9m',
  '9m',
];

const eastDealerTenpaiHand = [
  '2m',
  '3m',
  '4m',
  '6m',
  '7m',
  '8m',
  '2p',
  '3p',
  '4p',
  '2s',
  '3s',
  '4s',
  '5z',
];

const eastDealerRiichiInitialHand = [...eastDealerTenpaiHand, '1z'];

const southNotenHand = [
  '1z',
  '1z',
  '1z',
  '1p',
  '2p',
  '4p',
  '6p',
  '8p',
  '9p',
  '1s',
  '3s',
  '5s',
  '7s',
];

const westNotenHand = [
  '1m',
  '3m',
  '5m',
  '7m',
  '9m',
  '2p',
  '5p',
  '8p',
  '1s',
  '4s',
  '6s',
  '3z',
  '7z',
];

const northNotenHand = [
  '2m',
  '4m',
  '6m',
  '8m',
  '1p',
  '3p',
  '6p',
  '9p',
  '2s',
  '5s',
  '8s',
  '1z',
  '4z',
];

const westRoundOneHand = [
  '2m',
  '3m',
  '4m',
  '2p',
  '3p',
  '4p',
  '2s',
  '3s',
  '4s',
  '5m',
  '5p',
  '5s',
  '1z',
];

const northRoundOneHand = [
  '6m',
  '7m',
  '8m',
  '6p',
  '7p',
  '8p',
  '6s',
  '7s',
  '8s',
  '2z',
  '3z',
  '4z',
  '5z',
];

const roundOneInitialHands = {
  'player-east': eastNineTerminals,
  'player-south': [
    '1p',
    '2p',
    '3p',
    '4p',
    '5p',
    '6p',
    '7p',
    '8p',
    '9p',
    '1m',
    '2m',
    '3m',
    '4m',
  ],
  'player-west': westRoundOneHand,
  'player-north': northRoundOneHand,
};

const roundTwoInitialHands = {
  'player-east': eastDealerRiichiInitialHand,
  'player-south': southNotenHand,
  'player-west': westNotenHand,
  'player-north': northNotenHand,
};

const roundThreeInitialHands = {
  'player-east': eastNineTerminals,
  'player-south': southNineGatesTenpai,
  'player-west': westSouzuHand,
  'player-north': northManzuHand,
};

const eastAfterDiscardingRedFive = eastNineTerminals.filter(
  (tile) => tile !== '0p',
);

const southWinningHand = [...southNineGatesTenpai, '0p'];

const southAfterOpenKan = [
  '1p',
  '2p',
  '4p',
  '6p',
  '8p',
  '9p',
  '1s',
  '3s',
  '5s',
  '7s',
];

function drawAndDiscard({
  actor,
  handTilesAfterAction,
  sequenceNo,
  tile,
}: {
  actor: string;
  handTilesAfterAction: string[];
  sequenceNo: number;
  tile: string;
}) {
  return [
    {
      sequenceNo,
      actor,
      actionType: 'Draw',
      tile,
      handTilesAfterAction: [...handTilesAfterAction, tile],
      revealedTiles: [],
    },
    {
      sequenceNo: sequenceNo + 1,
      actor,
      actionType: 'Discard',
      tile,
      handTilesAfterAction,
      revealedTiles: [tile],
    },
  ];
}

const exhaustiveDrawHands = {
  'player-east': eastDealerTenpaiHand,
  'player-south': southAfterOpenKan,
  'player-west': westNotenHand,
  'player-north': northNotenHand,
};

const exhaustiveDrawTiles = [
  { actor: 'player-west', tile: '4z' },
  { actor: 'player-north', tile: '5z' },
  { actor: 'player-east', tile: '7z' },
  { actor: 'player-south', tile: '8m' },
  { actor: 'player-west', tile: '6p' },
  { actor: 'player-north', tile: '7p' },
  { actor: 'player-east', tile: '9s' },
  { actor: 'player-south', tile: '5m' },
  { actor: 'player-west', tile: '2z' },
  { actor: 'player-north', tile: '6z' },
  { actor: 'player-east', tile: '8s' },
  { actor: 'player-south', tile: '4m' },
  { actor: 'player-west', tile: '5z' },
  { actor: 'player-north', tile: '3m' },
  { actor: 'player-east', tile: '1p' },
  { actor: 'player-south', tile: '7m' },
  { actor: 'player-west', tile: '9p' },
  { actor: 'player-north', tile: '2p' },
  { actor: 'player-east', tile: '6z' },
  { actor: 'player-south', tile: '4s' },
  { actor: 'player-west', tile: '7z' },
  { actor: 'player-north', tile: '1m' },
  { actor: 'player-east', tile: '5p' },
  { actor: 'player-south', tile: '3p' },
  { actor: 'player-west', tile: '8p' },
  { actor: 'player-north', tile: '9m' },
];

function createExhaustiveDrawActions(startSequenceNo: number) {
  return exhaustiveDrawTiles.flatMap((item, index) =>
    drawAndDiscard({
      actor: item.actor,
      handTilesAfterAction:
        exhaustiveDrawHands[item.actor as keyof typeof exhaustiveDrawHands],
      sequenceNo: startSequenceNo + index * 2,
      tile: item.tile,
    }),
  );
}

const exhaustiveDrawActions = [
  {
    sequenceNo: 3,
    actor: 'player-south',
    actionType: 'OpenKan',
    tile: '1z',
    fromPlayer: 'player-east',
    targetSequenceNo: 2,
    handTilesAfterAction: southAfterOpenKan,
    revealedTiles: ['1z', '1z', '1z', '1z'],
    note: 'South calls open kan on East double riichi discard.',
  },
  {
    sequenceNo: 4,
    actor: 'player-south',
    actionType: 'Draw',
    tile: '9p',
    handTilesAfterAction: [...southAfterOpenKan, '9p'],
    revealedTiles: [],
    note: 'South draws from the dead wall after open kan.',
  },
  {
    sequenceNo: 5,
    actor: 'player-south',
    actionType: 'Discard',
    tile: '9p',
    handTilesAfterAction: southAfterOpenKan,
    revealedTiles: ['9p'],
    note: 'South cuts after open kan.',
  },
  {
    sequenceNo: 6,
    actionType: 'DoraReveal',
    tile: '6z',
    revealedTiles: ['6z'],
    note: 'Kan dora indicator after the open kan discard.',
  },
  ...createExhaustiveDrawActions(7),
  {
    sequenceNo: 59,
    actionType: 'DrawGame',
    revealedTiles: [],
    note: 'The wall is exhausted and the hand ends in exhaustive draw.',
  },
];

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
    finalStandings: [
      {
        playerId: 'player-south',
        seat: 'South',
        finalPoints: 89600,
        placement: 1,
        uma: 20,
        oka: 0,
      },
      {
        playerId: 'player-west',
        seat: 'West',
        finalPoints: 24000,
        placement: 2,
        uma: 10,
        oka: 0,
      },
      {
        playerId: 'player-north',
        seat: 'North',
        finalPoints: 24000,
        placement: 3,
        uma: -10,
        oka: 0,
      },
      {
        playerId: 'player-east',
        seat: 'East',
        finalPoints: -37600,
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
        initialHands: roundOneInitialHands,
        actions: [
          {
            sequenceNo: 1,
            actionType: 'DoraReveal',
            tile: '4z',
            revealedTiles: ['4z'],
            note: 'Initial dora indicator.',
          },
          {
            sequenceNo: 2,
            actor: 'player-east',
            actionType: 'DrawGame',
            handTilesAfterAction: eastNineTerminals,
            revealedTiles: eastNineTerminals,
            note: 'East 1 honba 0: East declares nine terminals abortive draw.',
          },
        ],
        result: {
          outcome: 'AbortiveDraw',
          yaku: [],
          doraIndicators: fullDoraRow,
          uraDoraIndicators: fullUraDoraRow,
          uraDoraVisible: false,
          points: 0,
          scoreChanges: [
            { playerId: 'player-east', delta: 0 },
            { playerId: 'player-south', delta: 0 },
            { playerId: 'player-west', delta: 0 },
            { playerId: 'player-north', delta: 0 },
          ],
          settlement: {
            riichiSticksDelta: 0,
            honbaPayment: 0,
            notes: [
              'Nine terminals abortive draw. Dealer repeats into East 1 honba 1.',
            ],
          },
        },
      },
      {
        descriptor: {
          roundWind: 'East',
          handNumber: 1,
          honba: 1,
        },
        initialHands: roundTwoInitialHands,
        actions: [
          {
            sequenceNo: 1,
            actionType: 'DoraReveal',
            tile: '5z',
            revealedTiles: ['5z'],
            note: 'Initial dora indicator.',
          },
          {
            sequenceNo: 2,
            actor: 'player-east',
            actionType: 'Riichi',
            tile: '1z',
            handTilesAfterAction: eastDealerTenpaiHand,
            revealedTiles: ['1z'],
            note: 'East declares double riichi from opening tenpai.',
          },
          ...exhaustiveDrawActions,
        ],
        result: {
          outcome: 'ExhaustiveDraw',
          yaku: [],
          doraIndicators: ['5z', '6z', '5m', '2p', '7s'],
          uraDoraIndicators: fullUraDoraRow,
          uraDoraVisible: false,
          points: 0,
          scoreChanges: [
            { playerId: 'player-east', delta: 3000 },
            { playerId: 'player-south', delta: -1000 },
            { playerId: 'player-west', delta: -1000 },
            { playerId: 'player-north', delta: -1000 },
          ],
          tenpaiPlayerIds: ['player-east'],
          settlement: {
            riichiSticksDelta: 1000,
            honbaPayment: 0,
            notes: [
              'East is tenpai after double riichi. The three child seats are noten.',
              'One riichi stick remains on the table and the next hand is East 1 honba 2.',
            ],
          },
        },
      },
      {
        descriptor: {
          roundWind: 'East',
          handNumber: 1,
          honba: 2,
        },
        initialHands: roundThreeInitialHands,
        actions: [
          {
            sequenceNo: 1,
            actionType: 'DoraReveal',
            tile: '4z',
            revealedTiles: ['4z'],
            note: 'Initial dora indicator.',
          },
          {
            sequenceNo: 2,
            actor: 'player-east',
            actionType: 'Riichi',
            tile: '0p',
            handTilesAfterAction: eastAfterDiscardingRedFive,
            revealedTiles: ['0p'],
            note: 'East declares double riichi and discards red five pin.',
          },
          {
            sequenceNo: 3,
            actor: 'player-south',
            actionType: 'Win',
            tile: '0p',
            fromPlayer: 'player-east',
            targetSequenceNo: 2,
            shantenAfterAction: -1,
            handTilesAfterAction: southWinningHand,
            revealedTiles: ['0p'],
            note: 'South wins by ron from the player on the right with pure nine gates.',
          },
        ],
        result: {
          outcome: 'Ron',
          winner: 'player-south',
          target: 'player-east',
          han: 26,
          fu: 0,
          yaku: [{ name: '纯正九莲宝灯', han: 26 }],
          doraIndicators: fullDoraRow,
          uraDoraIndicators: fullUraDoraRow,
          uraDoraVisible: false,
          points: 64300,
          scoreChanges: [
            { playerId: 'player-east', delta: -64600 },
            { playerId: 'player-south', delta: 65600 },
            { playerId: 'player-west', delta: 0 },
            { playerId: 'player-north', delta: 0 },
          ],
          settlement: {
            riichiSticksDelta: 0,
            honbaPayment: 600,
            notes: [
              'East pays South 64600 points for the hand.',
              'The 1000 point riichi stick from the previous hand is awarded to South and the table supply is cleared.',
            ],
          },
        },
      },
    ],
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
