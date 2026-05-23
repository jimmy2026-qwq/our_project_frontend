import type { ClubApplication, ClubApplicationView } from '@/pages/objects/club';
import type { AuditEventEntry } from '@/objects';
import type { PlayerProfile } from '@/pages/objects/player';
import type { ClubPublicProfile } from '@/pages/PublicShared/objects';

export interface ClubAdminMemberEntry extends PlayerProfile {
  isAdmin: boolean;
  isCurrentUser: boolean;
  contribution?: number;
  rankCode?: string;
  rankLabel?: string;
  privileges?: string[];
  internalTitle?: string | null;
}

export interface ClubDetailWorkbenchState {
  profile: ClubPublicProfile;
  operatorId: string;
  isApplicationDialogOpen: boolean;
  isLineupDialogOpen: boolean;
  selectedLineupTournament:
    | ClubPublicProfile['activeTournaments'][number]
    | null;
  isContributionDialogOpen: boolean;
  selectedContributionMember: ClubAdminMemberEntry | null;
  isContributionSubmitting: boolean;
  isTitleDialogOpen: boolean;
  selectedTitleMember: ClubAdminMemberEntry | null;
  isTitleSubmitting: boolean;
  isCurrentMember: boolean;
  isCurrentClubAdmin: boolean;
  clubMemberNames: string[];
  currentApplicationStatus: ClubApplication['status'] | null;
  applicationInbox: ClubApplicationView[];
  isInboxLoading: boolean;
  contributionChanges: AuditEventEntry[];
  isContributionChangesLoading: boolean;
  canViewContributionChanges: boolean;
  canReviewApplications: boolean;
  canAssignAdmins: boolean;
  canAdjustContributions: boolean;
  canEditTitles: boolean;
  canRemoveMembers: boolean;
  clubMembers: ClubAdminMemberEntry[];
  isClubMembersLoading: boolean;
  isFeaturedMember: boolean;
  isClubMember: boolean;
  featuredPlayerNames: string[];
  canApply: boolean;
  actionableTournaments: ClubPublicProfile['activeTournaments'];
  canManageLineup: boolean;
}
