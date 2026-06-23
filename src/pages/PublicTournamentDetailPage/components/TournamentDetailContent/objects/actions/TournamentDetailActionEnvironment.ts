import type { NavigateFunction } from 'react-router-dom';

import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';

import type { CurrentRuleStage } from '../CurrentRuleStage';

export interface TournamentDetailActionEnvironment {
  availableClubs: ClubSummary[];
  currentRuleStage: CurrentRuleStage;
  navigate: NavigateFunction;
  onScheduleSuccess?: () => void;
  operatorId?: string;
}
