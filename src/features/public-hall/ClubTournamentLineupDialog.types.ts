import type { PlayerProfile } from '@/domain/auth';
import type { ClubPublicProfile } from '@/domain/public';
import type { PublicHallTournamentAdminDetail } from './types';

export type ClubTournamentItem = ClubPublicProfile['activeTournaments'][number];
export type MemberStatusFilter = 'all' | 'active' | 'inactive';
export type EloSort = 'desc' | 'asc';

export interface MemberListItem extends PlayerProfile {
  isSelected: boolean;
}

export interface ClubTournamentLineupWorkbench {
  members: PlayerProfile[];
  isLoading: boolean;
  isSubmitting: boolean;
  selectedStageId: string;
  statusFilter: MemberStatusFilter;
  eloSort: EloSort;
  selectedPlayerIds: string[];
  tournamentDetail: PublicHallTournamentAdminDetail | null;
  stageOptions: NonNullable<PublicHallTournamentAdminDetail['stages']>;
  visibleMembers: MemberListItem[];
}
