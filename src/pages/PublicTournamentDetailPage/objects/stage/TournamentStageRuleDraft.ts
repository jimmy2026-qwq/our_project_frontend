import type { MahjongRuleset, TournamentFormat } from '@/objects/tournament';

export type TournamentStageRuleDraft = {
  format: TournamentFormat;
  advanceCount: number;
  mahjongRuleset: MahjongRuleset;
};
