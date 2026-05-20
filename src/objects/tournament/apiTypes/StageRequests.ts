import type { TournamentFormat } from './TournamentDomainTypes';

export interface CreateTournamentRequest {
  name: string;
  organizer: string;
  startsAt: string;
  endsAt: string;
  adminId?: string;
  stages: CreateTournamentStageRequest[];
}

export interface StageLineupSeatRequest {
  playerId: string;
  preferredWind?: string | null;
  reserve?: boolean;
}

export interface SubmitStageLineupRequest {
  clubId: string;
  operatorId: string;
  seats: StageLineupSeatRequest[];
  note?: string;
}

export interface ConfigureStageRulesRequest {
  operatorId: string;
  advancementRuleType?: string;
  cutSize?: number;
  thresholdScore?: number;
  targetTableCount?: number;
  schedulingPoolSize?: number;
  ruleTemplateKey?: string;
  pairingMethod?: string;
  carryOverPoints?: boolean;
  maxRounds?: number;
  bracketSize?: number;
  thirdPlaceMatch?: boolean;
  repechageEnabled?: boolean;
  seedingPolicy?: string;
  note?: string;
}

export interface CreateTournamentStageRequest {
  id?: string;
  name: string;
  format: TournamentFormat;
  order: number;
  roundCount: number;
  operatorId?: string;
  ruleTemplateKey?: string;
  advancementRuleType?: string;
  cutSize?: number;
  thresholdScore?: number;
  targetTableCount?: number;
  note?: string;
  pairingMethod?: string;
  carryOverPoints?: boolean;
  maxRounds?: number;
  bracketSize?: number;
  thirdPlaceMatch?: boolean;
  repechageEnabled?: boolean;
  seedingPolicy?: string;
  schedulingPoolSize?: number;
}

export interface CompleteStageRequest {
  operatorId?: string;
}

export interface AdvanceKnockoutStageRequest {
  operatorId?: string;
}
