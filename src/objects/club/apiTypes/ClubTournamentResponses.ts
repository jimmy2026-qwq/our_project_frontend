import type { ClubApplicationStatus } from './ClubApplicationStatus';

export interface ClubMembershipApplicantView {
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
  clubIds: string[];
}

export interface ClubMembershipApplicationView {
  applicationId: string;
  clubId: string;
  clubName: string;
  applicant: ClubMembershipApplicantView;
  submittedAt: string;
  message?: string;
  status: ClubApplicationStatus;
  reviewedBy?: string | null;
  reviewedByDisplayName?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
  withdrawnByPrincipalId?: string | null;
  canReview: boolean;
  canWithdraw: boolean;
}

export type ClubTournamentParticipationStatus = 'Invited' | 'Participating';

export interface ClubTournamentParticipationView {
  clubId: string;
  tournamentId: string;
  name: string;
  status: string;
  clubParticipationStatus: ClubTournamentParticipationStatus;
  stageName?: string | null;
  startsAt: string;
  endsAt: string;
  canViewDetail: boolean;
  canSubmitLineup: boolean;
  canDecline: boolean;
}

export type ClubMembershipApplicationResponse = ClubMembershipApplicationView;
export type ClubTournamentParticipationResponse = ClubTournamentParticipationView;

export interface ClubMembershipApplication {
  id: string;
  applicantUserId?: string | null;
  displayName: string;
  submittedAt: string;
  message?: string | null;
  status: ClubApplicationStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
  withdrawnByPrincipalId?: string | null;
}

export interface ClubTournamentQuery {
  scope?: string;
  viewer?: string;
  limit?: number;
  offset?: number;
}
