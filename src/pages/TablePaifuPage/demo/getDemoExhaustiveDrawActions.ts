import type { PaifuTileInput } from '@/objects';
import type { DemoPaifuAction } from './createDemoPaifuRound';
import { southAfterOpenKan } from './TablePaifuDemoHands';
import { exhaustiveDrawHands } from './TablePaifuDemoHandSets';

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
] as const;

function drawAndDiscard({
  actor,
  handTilesAfterAction,
  sequenceNo,
  tile,
}: {
  actor: string;
  handTilesAfterAction: PaifuTileInput[];
  sequenceNo: number;
  tile: PaifuTileInput;
}): DemoPaifuAction[] {
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

function createExhaustiveDrawActions(startSequenceNo: number) {
  return exhaustiveDrawTiles.flatMap((item, index) =>
    drawAndDiscard({
      actor: item.actor,
      handTilesAfterAction: exhaustiveDrawHands[item.actor],
      sequenceNo: startSequenceNo + index * 2,
      tile: item.tile,
    }),
  );
}

export function getDemoExhaustiveDrawActions(): DemoPaifuAction[] {
  return [
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
}
