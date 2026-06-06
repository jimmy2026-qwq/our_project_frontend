import type {
  ClubApplication,
  ClubApplicationView,
} from '@/pages/objects/ClubApplicationViews';
import type { ClubContributionAuditEntry } from '@/objects';
import type { ClubPrivilegeCode } from '@/objects/club';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';
import type { ClubPublicProfile } from './PublicClubDetailPage.types';

export interface ClubAdminMemberEntry extends PlayerProfile {
  isAdmin: boolean;
  isCurrentUser: boolean;
  contribution?: number;
  rankCode?: string;
  rankLabel?: string;
  privileges?: ClubPrivilegeCode[];
  internalTitle?: string | null;
}

export interface ClubContributionTitleField {
  rankCode: string;
  defaultLabel: string;
  displayLabel: string;
  minimumContribution?: number;
  privileges?: ClubPrivilegeCode[];
}

export interface ClubContributionTitleDraft {
  rankCode: string;
  label: string;
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
  isContributionTitleDialogOpen: boolean;
  isContributionTitleSubmitting: boolean;
  isRelationDialogOpen: boolean;
  isRelationSubmitting: boolean;
  contributionTitleFields: ClubContributionTitleField[];
  isCurrentMember: boolean;
  isCurrentClubAdmin: boolean;
  clubMemberNames: string[];
  currentApplicationStatus: ClubApplication['status'] | null;
  applicationInbox: ClubApplicationView[];
  isInboxLoading: boolean;
  contributionChanges: ClubContributionAuditEntry[];
  isContributionChangesLoading: boolean;
  canViewContributionChanges: boolean;
  canReviewApplications: boolean;
  canAssignAdmins: boolean;
  canAdjustContributions: boolean;
  canEditTitles: boolean;
  canManageRelations: boolean;
  canRequestRelationChange: boolean;
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
