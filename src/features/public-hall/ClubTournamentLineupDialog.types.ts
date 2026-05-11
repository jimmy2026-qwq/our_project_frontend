import type { PlayerProfile } from '@/domain/auth';
import type { ClubPublicProfile } from '@/domain/public';
import type { TournamentDetailContract } from '@/api/contracts/operations';

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
