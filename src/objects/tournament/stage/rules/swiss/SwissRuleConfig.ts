import type { SwissPairingMethod } from './SwissPairingMethod';

export interface SwissRuleConfig {
  pairingMethod: SwissPairingMethod;
  carryOverPoints: boolean;
  maxRounds: number | null;
}
