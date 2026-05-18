import type { PlayerProfile } from '@/objects/auth';
import type { ClubPublicProfile } from '@/objects/publicquery';
import type { TournamentDetailContract } from '@/objects/tournament';

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
  tournamentDetail: TournamentDetailContract | null;
  stageOptions: NonNullable<TournamentDetailContract['stages']>;
  visibleMembers: MemberListItem[];
}
