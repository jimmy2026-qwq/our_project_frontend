import type { ClubApplicationStatus } from './ClubApplicationStatus';
import type { RankPlatform, TournamentStatus } from '@/objects/tournament';

type PlayerStatus = 'Active' | 'Suspended' | 'Banned';

export interface ClubMembershipApplicantView {
  playerId: string | null;
  applicantUserId: string | null;
  displayName: string;
  playerStatus: PlayerStatus | null;
  currentRank:
    | {
        platform: RankPlatform;
        tier: string;
        stars: number | null;
      }
    | null;
  elo: number | null;
  clubIds: string[];
}

export interface ClubMembershipApplicationView {
  applicationId: string;
  clubId: string;
  clubName: string;
  applicant: ClubMembershipApplicantView;
  submittedAt: string;
  message: string | null;
  status: ClubApplicationStatus;
  reviewedBy: string | null;
  reviewedByDisplayName: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  withdrawnByPrincipalId: string | null;
  canReview: boolean;
  canWithdraw: boolean;
}

export type ClubTournamentParticipationStatus = 'Invited' | 'Participating';
export type ClubTournamentScope = 'recent' | 'active' | 'all';

export interface ClubTournamentParticipationView {
  clubId: string;
  tournamentId: string;
  name: string;
  status: TournamentStatus;
  clubParticipationStatus: ClubTournamentParticipationStatus;
  stageName: string | null;
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
  applicantUserId: string | null;
  displayName: string;
  submittedAt: string;
  message: string | null;
  status: ClubApplicationStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  withdrawnByPrincipalId: string | null;
}

export interface ClubTournamentQuery {
  scope?: ClubTournamentScope;
  viewer?: string;
  limit?: number;
  offset?: number;
}
