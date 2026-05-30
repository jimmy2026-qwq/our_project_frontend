import type { SwissPairingMethod } from '../SwissPairingMethod';

export interface SwissRuleConfigView {
  pairingMethod: SwissPairingMethod;
  carryOverPoints: boolean;
  maxRounds: number | null;
}
