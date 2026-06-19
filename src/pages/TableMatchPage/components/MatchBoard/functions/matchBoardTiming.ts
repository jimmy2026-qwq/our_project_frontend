export const settlementAnimationStartDelayMs = 0;
export const winningCallAnimationMs = 500;
export const winningCallVisibleMs = 1500;
export const winningCallSettlementWaitMs = 1500;
export const resultRevealDelayMs =
  winningCallAnimationMs + winningCallSettlementWaitMs;
export const yakumanTileBurstVisibleMs = 4200;
export const yakumanTileBurstSettleDelayMs = 500;

const callMaskDelayMinMs = 650;
const callMaskDelayRangeMs = 1350;

export function getCallMaskDelayMs() {
  return callMaskDelayMinMs + Math.floor(Math.random() * callMaskDelayRangeMs);
}
