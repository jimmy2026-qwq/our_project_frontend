export const SwissPairingMethods = {
  BalancedElo: 'balanced-elo',
  Snake: 'snake',
} as const;

export type SwissPairingMethod = (typeof SwissPairingMethods)[keyof typeof SwissPairingMethods];
