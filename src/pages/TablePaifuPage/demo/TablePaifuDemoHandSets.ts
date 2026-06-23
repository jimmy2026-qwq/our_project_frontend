import { eastDealerRiichiInitialHand, eastDealerTenpaiHand, eastNineTerminals, northManzuHand, northNotenHand, northRoundOneHand, southAfterOpenKan, southNineGatesTenpai, southNotenHand, westNotenHand, westRoundOneHand, westSouzuHand } from './TablePaifuDemoHands';

export const roundOneInitialHands = {
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

export const roundTwoInitialHands = {
  'player-east': eastDealerRiichiInitialHand,
  'player-south': southNotenHand,
  'player-west': westNotenHand,
  'player-north': northNotenHand,
};

export const roundThreeInitialHands = {
  'player-east': eastNineTerminals,
  'player-south': southNineGatesTenpai,
  'player-west': westSouzuHand,
  'player-north': northManzuHand,
};

export const eastAfterDiscardingRedFive = eastNineTerminals.filter(
  (tile) => tile !== '0p',
);

export const southWinningHand = [...southNineGatesTenpai, '0p'];

export const exhaustiveDrawHands = {
  'player-east': eastDealerTenpaiHand,
  'player-south': southAfterOpenKan,
  'player-west': westNotenHand,
  'player-north': northNotenHand,
};
