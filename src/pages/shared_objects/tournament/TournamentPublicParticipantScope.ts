export interface TournamentPublicParticipantScope {
  whitelistType: 'Club' | 'Player' | 'Mixed';
  clubIds?: string[];
  playerIds?: string[];
  clubCount?: number;
  playerCount?: number;
  whitelistCount?: number;
}
