import type { TournamentDetailView } from '@/objects/tournament';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

import type { EloSort } from './EloSort';
import type { MemberListItem } from './MemberListItem';
import type { MemberStatusFilter } from './MemberStatusFilter';

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
