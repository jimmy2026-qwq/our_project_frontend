import type { MahjongRuleset } from '../MahjongRuleset';

export interface StartMahjongTableRequest {
  operatorId?: string | null;
  ruleset?: MahjongRuleset | null;
  seed?: string | null;
}
