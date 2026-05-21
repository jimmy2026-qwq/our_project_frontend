import type { PlayerProfile } from '@/pages/objects/player';
import type { ClubPublicProfile } from '@/pages/PublicHall/objects';
import type { TournamentDetailView } from '@/objects/tournament';

export type ClubTournamentItem = ClubPublicProfile['activeTournaments'][number];
export type MemberStatusFilter = 'all' | 'active' | 'inactive';
export type EloSort = 'desc' | 'asc';

export interface MemberListItem extends PlayerProfile {
  isSelected: boolean;
  isCurrentUser: boolean;
}

export interface ClubTournamentLineupWorkbench {
  members: PlayerProfile[];
  isLoading: boolean;
  isSubmitting: boolean;
  selectedStageId: string;
  statusFilter: MemberStatusFilter;
  eloSort: EloSort;
  selectedPlayerIds: string[];
  tournamentDetail: TournamentDetailView | null;
  stageOptions: NonNullable<TournamentDetailView['stages']>;
  visibleMembers: MemberListItem[];
}
