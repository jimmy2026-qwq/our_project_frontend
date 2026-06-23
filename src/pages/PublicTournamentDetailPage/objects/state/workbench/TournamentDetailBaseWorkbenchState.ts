import type { TournamentPublicProfile } from '@/pages/shared_objects/tournament/TournamentPublicProfile';

export interface TournamentDetailBaseWorkbenchState {
  profile: TournamentPublicProfile;
  operatorId?: string;
}
