import type { Dispatch, SetStateAction } from 'react';
import type { NavigateFunction } from 'react-router-dom';

import type { ClubSummary } from '@/pages/objects/ClubSummary';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

import type { TournamentPublicProfile } from '../../../objects/PublicTournamentDetailPage.types';
import type { TournamentDetailWorkbenchState } from '../../../objects/TournamentDetail.types';
import type { TournamentStageRuleDraft } from '../../../objects/TournamentDetailRule.types';

export type CurrentRuleStage =
  | NonNullable<TournamentPublicProfile['stages']>[number]
  | null;

export type RefreshTournamentProfile = (
  tournamentId: string,
) => Promise<TournamentPublicProfile>;

export interface UseTournamentDetailActionsParams {
  availableClubs: ClubSummary[];
  currentRuleStage: CurrentRuleStage;
  navigate: NavigateFunction;
  onScheduleSuccess?: () => void;
  operatorId?: string;
  ruleDraft: TournamentStageRuleDraft;
  setIsSubmittingTournamentAction: Dispatch<SetStateAction<boolean>>;
  setLocalProfile: Dispatch<SetStateAction<TournamentPublicProfile | null>>;
  setParticipantPlayers: Dispatch<SetStateAction<PlayerProfile[]>>;
  setPublishBlockedOpen: Dispatch<SetStateAction<boolean>>;
  setRuleDraft: Dispatch<SetStateAction<TournamentStageRuleDraft>>;
  setRulesDialogOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedClubId: Dispatch<SetStateAction<string>>;
  setSelectedPlayerId: Dispatch<SetStateAction<string>>;
  setTournamentActionError: Dispatch<SetStateAction<string>>;
  workbench: TournamentDetailWorkbenchState | null;
}
