import type { ClubPrivilegeCode, StageStatus, TournamentStatus } from '@/objects';
import type {
  AdvancementRuleView,
  KnockoutRuleConfigView,
  SwissRuleConfigView,
} from '@/objects/tournament';
import type { ClubSummary } from '@/pages/objects/ClubSummary';
import type { AuthSession } from '@/providers/auth/AuthSession';

export type DataSource = 'api' | 'mock';

export interface DetailState<T> {
  item: T | null;
  source: DataSource;
  warning?: string;
}

export interface PublicHallViewerContext {
  session: AuthSession | null;
}

export interface ClubPublicProfile {
  id: string;
  name: string;
  slogan: string;
  description: string;
  memberCount: number;
  activeMemberCount?: number;
  adminCount?: number;
  powerRating: number;
  treasury: number;
  totalPoints?: number;
  pointPool?: number;
  relations: ClubSummary['relations'];
  honors?: Array<{
    title: string;
    achievedAt?: string;
    note?: string;
  }>;
  applicationPolicy?: {
    applicationsOpen: boolean;
    requirementsText?: string | null;
    expectedReviewSlaHours?: number | null;
    pendingApplicationCount?: number;
  };
  featuredPlayers: string[];
  currentLineup?: Array<{
    playerId?: string;
    nickname: string;
    elo?: number;
    currentRank?: {
      platform: string;
      tier: string;
      stars?: number | null;
    } | null;
    status?: 'Active' | 'Inactive' | 'Banned';
    isAdmin?: boolean;
    internalTitle?: string | null;
    privileges?: ClubPrivilegeCode[];
  }>;
  recentMatches?: Array<{
    matchRecordId?: string;
    tournamentId?: string;
    tournamentName: string;
    stageId?: string;
    stageName?: string;
    tableId?: string;
    generatedAt?: string;
  }>;
  activeTournaments: Array<{
    id: string;
    name: string;
    status?: TournamentStatus;
    source?: 'recent' | 'invited';
    participationStatus?: 'Invited' | 'Participating';
    canSubmitLineup?: boolean;
    canDecline?: boolean;
  }>;
}

export type ClubDetailState = DetailState<ClubPublicProfile>;

export interface TournamentPublicProfile {
  id: string;
  name: string;
  organizer?: string;
  status: TournamentStatus;
  tagline: string;
  description: string;
  venue: string;
  startsAt?: string;
  endsAt?: string;
  stageCount: number;
  activeStageCount?: number;
  participantCount?: number;
  whitelistType: 'Club' | 'Player' | 'Mixed';
  clubIds?: string[];
  playerIds?: string[];
  clubCount?: number;
  playerCount?: number;
  whitelistCount?: number;
  nextStageId: string;
  nextStageName: string;
  nextStageStatus: StageStatus;
  nextScheduledAt: string;
  stages?: Array<{
    stageId: string;
    name: string;
    format?: string;
    order?: number;
    status: StageStatus;
    currentRound?: number;
    roundCount: number;
    schedulingPoolSize?: number;
    tableCount: number;
    archivedTableCount?: number;
    pendingTablePlanCount: number;
    standings?: unknown | null;
    bracket?: unknown | null;
    advancementRule?: AdvancementRuleView;
    swissRule?: SwissRuleConfigView | null;
    knockoutRule?: KnockoutRuleConfigView | null;
    lineupSubmissions?: Array<{
      submissionId: string;
      clubId: string;
      submittedBy: string;
      submittedAt: string;
      activePlayerIds: string[];
      reservePlayerIds: string[];
      note?: string | null;
    }>;
  }>;
}
