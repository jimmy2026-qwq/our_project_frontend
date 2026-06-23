import type { TournamentPublicProfile } from '@/pages/shared_objects/tournament/TournamentPublicProfile';

export type RefreshTournamentProfile = (
  tournamentId: string,
) => Promise<TournamentPublicProfile>;
