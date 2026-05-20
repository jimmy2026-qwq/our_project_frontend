import type { ClubApplication, ClubApplicationView } from '@/pages/objects/ClubApplicationViews';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';
import type { ClubPublicProfile } from '@/features/public-hall/objects';

export interface ClubAdminMemberEntry extends PlayerProfile {
  isAdmin: boolean;
  isCurrentUser: boolean;
}

export interface ClubDetailWorkbenchState {
  profile: ClubPublicProfile;
  operatorId: string;
  isApplicationDialogOpen: boolean;
  isLineupDialogOpen: boolean;
  selectedLineupTournament:
    | ClubPublicProfile['activeTournaments'][number]
    | null;
  isCurrentMember: boolean;
  isCurrentClubAdmin: boolean;
  clubMemberNames: string[];
  currentApplicationStatus: ClubApplication['status'] | null;
  applicationInbox: ClubApplicationView[];
  isInboxLoading: boolean;
  clubMembers: ClubAdminMemberEntry[];
  isClubMembersLoading: boolean;
  isFeaturedMember: boolean;
  isClubMember: boolean;
  featuredPlayerNames: string[];
  canApply: boolean;
  actionableTournaments: ClubPublicProfile['activeTournaments'];
  canManageLineup: boolean;
}
