import type { ClubApplication, ClubApplicationView } from '@/objects';

export interface ClubApplicationMutationResponseContract {
  id: string;
  applicantUserId?: string | null;
  displayName: string;
  submittedAt: string;
  message?: string | null;
  status: ClubApplication['status'];
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
  withdrawnByPrincipalId?: string | null;
}

export interface ClubApplicationApplicantContract {
  playerId?: string;
  applicantUserId?: string;
  displayName: string;
  playerStatus?: string;
  currentRank?:
    | {
        platform: string;
        tier: string;
        stars?: number | null;
      }
    | null;
  elo?: number;
  clubIds?: string[];
}

export interface ClubApplicationViewContract {
  applicationId: string;
  clubId: string;
  clubName: string;
  applicant: ClubApplicationApplicantContract;
  submittedAt: string;
  message?: string;
  status: ClubApplicationView['status'];
  reviewedBy?: string | null;
  reviewedByDisplayName?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
  withdrawnByPrincipalId?: string | null;
  canReview: boolean;
  canWithdraw: boolean;
}

export interface PublicClubRelationContract {
  relation: 'Alliance' | 'Rivalry' | 'Neutral';
}

export interface ClubContract {
  id: string;
  name: string;
  members: string[];
  admins?: string[];
  powerRating: number;
  treasuryBalance?: number;
  totalPoints?: number;
  pointPool?: number;
  relations?: PublicClubRelationContract[];
  dissolvedAt?: string | null;
}

export interface ClubMemberContract {
  id: string;
  userId: string;
  nickname: string;
  status: 'Active' | 'Inactive' | 'Banned';
  elo: number;
  boundClubIds: string[];
}

export interface ClubTournamentParticipationContract {
  clubId: string;
  tournamentId: string;
  name: string;
  status: string;
  clubParticipationStatus: 'Invited' | 'Participating';
  stageName?: string | null;
  startsAt: string;
  endsAt: string;
  canViewDetail: boolean;
  canSubmitLineup: boolean;
  canDecline: boolean;
}
