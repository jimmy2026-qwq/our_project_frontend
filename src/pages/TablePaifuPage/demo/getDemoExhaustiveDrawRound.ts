import { RoundSettlementNote, type PaifuRound as PaifuRoundSummary } from '@/objects';
import { createDemoPaifuRound } from './createDemoPaifuRound';
import {
  eastDealerTenpaiHand,
  fullUraDoraRow,
} from './TablePaifuDemoHands';
import { roundTwoInitialHands } from './TablePaifuDemoHandSets';
import { getDemoExhaustiveDrawActions } from './getDemoExhaustiveDrawActions';

export function getDemoExhaustiveDrawRound(): PaifuRoundSummary {
  return createDemoPaifuRound({
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
      ...getDemoExhaustiveDrawActions(),
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
        notes: [RoundSettlementNote.ExhaustiveDraw],
      },
    },
  });
}
