import type { TournamentPublicProfile } from '@/pages/shared_objects/tournament/TournamentPublicProfile';

export type CurrentRuleStage =
  | NonNullable<TournamentPublicProfile['stages']>[number]
  | null;
