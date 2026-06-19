import {
  toPaifuTile,
  type PaifuAction,
  type PaifuRound as PaifuRoundSummary,
  type PaifuTile,
  type PaifuTileInput,
} from '@/objects';

import { demoSeats } from './TablePaifuDemoSeats';

export type DemoPaifuAction = Omit<
  PaifuAction,
  | 'actor'
  | 'tile'
  | 'fromPlayer'
  | 'targetSequenceNo'
  | 'shantenAfterAction'
  | 'handTilesAfterAction'
  | 'revealedTiles'
  | 'note'
> &
  Partial<
    Pick<
      PaifuAction,
      | 'actor'
      | 'fromPlayer'
      | 'targetSequenceNo'
      | 'shantenAfterAction'
      | 'note'
    >
  > & {
    tile?: PaifuTileInput | null;
    handTilesAfterAction?: PaifuTileInput[] | null;
    revealedTiles: PaifuTileInput[];
  };

type DemoPaifuRoundResult = Omit<
  PaifuRoundSummary['result'],
  | 'winner'
  | 'target'
  | 'han'
  | 'fu'
  | 'doraIndicators'
  | 'uraDoraIndicators'
  | 'uraDoraVisible'
  | 'settlement'
  | 'tenpaiPlayerIds'
> &
  Partial<
    Pick<
      PaifuRoundSummary['result'],
      | 'winner'
      | 'target'
      | 'han'
      | 'fu'
      | 'uraDoraVisible'
      | 'settlement'
      | 'tenpaiPlayerIds'
    >
  > & {
    doraIndicators?: PaifuTileInput[] | null;
    uraDoraIndicators?: PaifuTileInput[] | null;
  };

interface DemoPaifuRoundInput {
  descriptor: PaifuRoundSummary['descriptor'];
  initialHands: Record<string, PaifuTileInput[]>;
  actions: DemoPaifuAction[];
  result: DemoPaifuRoundResult;
}

export function createDemoPaifuRound({
  descriptor,
  initialHands,
  actions,
  result,
}: DemoPaifuRoundInput): PaifuRoundSummary {
  const events = actions.map(toPaifuAction);

  return {
    descriptor,
    players: demoSeats.map((seat) => ({
      playerId: seat.playerId,
      seat: seat.seat,
      initialHand: {
        tiles: toPaifuTiles(initialHands[seat.playerId] ?? []),
      },
      track: {
        events: events.filter((event) => event.actor === seat.playerId),
      },
    })),
    timeline: { events },
    result: toPaifuRoundResult(result),
  };
}

function toPaifuAction(action: DemoPaifuAction): PaifuAction {
  return {
    sequenceNo: action.sequenceNo,
    actor: action.actor ?? null,
    actionType: action.actionType,
    tile: action.tile ? toPaifuTile(action.tile) : null,
    fromPlayer: action.fromPlayer ?? null,
    targetSequenceNo: action.targetSequenceNo ?? null,
    shantenAfterAction: action.shantenAfterAction ?? null,
    handTilesAfterAction: action.handTilesAfterAction
      ? toPaifuTiles(action.handTilesAfterAction)
      : null,
    revealedTiles: toPaifuTiles(action.revealedTiles),
    note: action.note ?? null,
  };
}

function toPaifuRoundResult(
  result: DemoPaifuRoundResult,
): PaifuRoundSummary['result'] {
  return {
    ...result,
    winner: result.winner ?? null,
    target: result.target ?? null,
    han: result.han ?? null,
    fu: result.fu ?? null,
    doraIndicators: result.doraIndicators
      ? toPaifuTiles(result.doraIndicators)
      : null,
    uraDoraIndicators: result.uraDoraIndicators
      ? toPaifuTiles(result.uraDoraIndicators)
      : null,
    uraDoraVisible: result.uraDoraVisible ?? null,
    settlement: result.settlement ?? null,
    tenpaiPlayerIds: result.tenpaiPlayerIds ?? null,
  };
}

function toPaifuTiles(tiles: PaifuTileInput[]): PaifuTile[] {
  return tiles.map(toPaifuTile);
}
