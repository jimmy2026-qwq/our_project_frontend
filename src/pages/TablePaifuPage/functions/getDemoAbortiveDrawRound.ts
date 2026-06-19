import type { PaifuRoundSummary } from '../types';
import {
  eastNineTerminals,
  fullDoraRow,
  fullUraDoraRow,
} from '../objects/TablePaifuDemoHands';
import { roundOneInitialHands } from '../objects/TablePaifuDemoHandSets';

export function getDemoAbortiveDrawRound(): PaifuRoundSummary {
  return {
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
  };
}
