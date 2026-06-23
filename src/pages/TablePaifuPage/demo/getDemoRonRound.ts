import { HandOutcome, PaifuActionType, RoundSettlementNote, SeatWind, type PaifuRound as PaifuRoundSummary } from '@/objects';
import { createDemoPaifuRound } from './createDemoPaifuRound';
import { fullDoraRow, fullUraDoraRow } from './TablePaifuDemoHands';
import { eastAfterDiscardingRedFive, roundThreeInitialHands, southWinningHand } from './TablePaifuDemoHandSets';

export function getDemoRonRound(): PaifuRoundSummary {
  return createDemoPaifuRound({
    descriptor: {
      roundWind: SeatWind.East,
      handNumber: 1,
      honba: 2,
    },
    initialHands: roundThreeInitialHands,
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
        actionType: PaifuActionType.Riichi,
        tile: '0p',
        handTilesAfterAction: eastAfterDiscardingRedFive,
        revealedTiles: ['0p'],
        note: 'East declares double riichi and discards red five pin.',
      },
      {
        sequenceNo: 3,
        actor: 'player-south',
        actionType: PaifuActionType.Win,
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
      outcome: HandOutcome.Ron,
      winner: 'player-south',
      target: 'player-east',
      han: 26,
      fu: 0,
      yaku: [{ kind: 'PureChuurenPoutou', han: 26 }],
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
        notes: [RoundSettlementNote.DoubleYakuman],
      },
    },
  });
}
