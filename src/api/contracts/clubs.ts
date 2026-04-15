import type { ClubApplication, ClubApplicationView } from '@/domain';

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
  playerId?: string[] | string;
  applicantUserId?: string[] | string;
  displayName: string;
  playerStatus?: string[] | string;
  currentRank?:
    | {
        platform: string;
        tier: string;
        stars?: number | null;
      }[]
    | {
        platform: string;
        tier: string;
        stars?: number | null;
      }
    | null;
  elo?: number[] | number;
  clubIds?: string[];
}

export interface ClubApplicationViewContract {
  applicationId: string;
  clubId: string;
  clubName: string;
  applicant: ClubApplicationApplicantContract;
  submittedAt: string;
  message?: string[] | string;
  status: ClubApplicationView['status'];
  reviewedBy?: string[] | string;
  reviewedByDisplayName?: string[] | string;
  reviewedAt?: string[] | string;
  reviewNote?: string[] | string;
  withdrawnByPrincipalId?: string[] | string;
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
  powerRating: number;
  treasuryBalance?: number;
  totalPoints?: number;
  pointPool?: number;
  relations?: PublicClubRelationContract[];
  dissolvedAt?: string | null;
}

export interface ClubMemberContract {
  id: string;
  userId?: string;
  nickname: string;
  status?: 'Active' | 'Inactive' | 'Banned';
  elo?: number;
  clubId?: string[];
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
