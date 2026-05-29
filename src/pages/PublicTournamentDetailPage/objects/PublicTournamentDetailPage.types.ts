import type { StageStatus, TournamentStatus } from '@/objects';
import type {
  AdvancementRuleView,
  KnockoutRuleConfigView,
  SwissRuleConfigView,
} from '@/objects/tournament';
import type { ClubSummary } from '@/pages/objects/ClubSummary';

export type DataSource = 'api' | 'mock';

export interface DetailState<T> {
  item: T | null;
  source: DataSource;
  warning?: string;
}

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
  featuredPlayers: string[];
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

export type TournamentDetailState = DetailState<TournamentPublicProfile>;
