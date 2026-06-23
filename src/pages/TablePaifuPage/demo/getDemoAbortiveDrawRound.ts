import { HandOutcome, PaifuActionType, RoundSettlementNote, SeatWind, type PaifuRound as PaifuRoundSummary } from '@/objects';
import { createDemoPaifuRound } from './createDemoPaifuRound';
import { eastNineTerminals, fullDoraRow, fullUraDoraRow } from './TablePaifuDemoHands';
import { roundOneInitialHands } from './TablePaifuDemoHandSets';

export function getDemoAbortiveDrawRound(): PaifuRoundSummary {
  return createDemoPaifuRound({
    descriptor: {
      roundWind: SeatWind.East,
      handNumber: 1,
      honba: 0,
    },
    initialHands: roundOneInitialHands,
    actions: [
      {
        sequenceNo: 1,
        actionType: PaifuActionType.DoraReveal,
        tile: '4z',
        revealedTiles: ['4z'],
        note: 'Initial dora indicator.',
      },
      {
        sequenceNo: 2,
        actor: 'player-east',
        actionType: PaifuActionType.DrawGame,
        handTilesAfterAction: eastNineTerminals,
        revealedTiles: eastNineTerminals,
        note: 'East 1 honba 0: East declares nine terminals abortive draw.',
      },
    ],
    result: {
      outcome: HandOutcome.AbortiveDraw,
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
        notes: [RoundSettlementNote.AbortiveDrawRequested],
      },
    },
  });
}
