import type { MahjongRuleset, TournamentFormat } from '@/objects/tournament';

import type { TournamentPublicProfile } from './PublicTournamentDetailPage.types';

export type TournamentStageRuleDraft = {
  format: TournamentFormat;
  advanceCount: number;
  mahjongRuleset: MahjongRuleset;
};

export type TournamentStageWithRules = NonNullable<
  TournamentPublicProfile['stages']
>[number];
