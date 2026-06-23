import type { TournamentPublicProfile } from '@/pages/shared_objects/tournament/TournamentPublicProfile';

export type TournamentStageWithRules = NonNullable<
  TournamentPublicProfile['stages']
>[number];
