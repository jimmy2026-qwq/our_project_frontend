import type { TournamentPublicProfile } from '@/pages/shared_objects/tournament/TournamentPublicProfile';

export interface TournamentDetailState {
  item: TournamentPublicProfile | null;
  warning?: string;
}
