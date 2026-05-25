import type {
  AdvancementRuleType,
  KnockoutSeedingPolicy,
  SeatWind,
  SwissPairingMethod,
  TournamentFormat,
} from './TournamentDomainTypes';

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
  preferredWind?: SeatWind | null;
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
  format?: TournamentFormat;
  roundCount?: number;
  advancementRuleType?: AdvancementRuleType;
  cutSize?: number;
  thresholdScore?: number;
  targetTableCount?: number;
  schedulingPoolSize?: number;
  ruleTemplateKey?: string;
  pairingMethod?: SwissPairingMethod;
  carryOverPoints?: boolean;
  maxRounds?: number;
  bracketSize?: number;
  thirdPlaceMatch?: boolean;
  repechageEnabled?: boolean;
  seedingPolicy?: KnockoutSeedingPolicy;
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
  advancementRuleType?: AdvancementRuleType;
  cutSize?: number;
  thresholdScore?: number;
  targetTableCount?: number;
  note?: string;
  pairingMethod?: SwissPairingMethod;
  carryOverPoints?: boolean;
  maxRounds?: number;
  bracketSize?: number;
  thirdPlaceMatch?: boolean;
  repechageEnabled?: boolean;
  seedingPolicy?: KnockoutSeedingPolicy;
  schedulingPoolSize?: number;
}

export interface CompleteStageRequest {
  operatorId?: string;
}

export interface AdvanceKnockoutStageRequest {
  operatorId?: string;
}
