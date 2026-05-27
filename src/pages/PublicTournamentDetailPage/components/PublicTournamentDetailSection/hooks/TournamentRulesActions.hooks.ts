import {
  TournamentStageConfigureRulesAPI,
  TournamentStageCreateAPI,
} from '@/api/tournament';
import { sendAPI } from '@/system/api';

import {
  createRuleDraftFromStage,
  getDefaultRoundCount,
  normalizeKnockoutBracketSize,
} from '../../../objects/tournament-detail.rules';
import type {
  RefreshTournamentProfile,
  UseTournamentDetailActionsParams,
} from './TournamentDetailActions.types';

export function useTournamentRulesActions({
  currentRuleStage,
  operatorId,
  refreshTournamentProfile,
  ruleDraft,
  setIsSubmittingTournamentAction,
  setRuleDraft,
  setRulesDialogOpen,
  setTournamentActionError,
  workbench,
}: Pick<
  UseTournamentDetailActionsParams,
  | 'currentRuleStage'
  | 'operatorId'
  | 'ruleDraft'
  | 'setIsSubmittingTournamentAction'
  | 'setRuleDraft'
  | 'setRulesDialogOpen'
  | 'setTournamentActionError'
  | 'workbench'
> & {
  refreshTournamentProfile: RefreshTournamentProfile;
}) {
  function openRulesDialog() {
    setRuleDraft(createRuleDraftFromStage(currentRuleStage));
    setRulesDialogOpen(true);
    setTournamentActionError('');
  }

  async function handleSaveRules() {
    if (!operatorId || !workbench?.profile.id) {
      return;
    }

    const isKnockout = ruleDraft.format === 'Knockout';
    const advanceCount = isKnockout
      ? normalizeKnockoutBracketSize(ruleDraft.advanceCount)
      : Math.max(1, Math.floor(ruleDraft.advanceCount || 0));

    try {
      setIsSubmittingTournamentAction(true);
      setTournamentActionError('');

      if (currentRuleStage) {
        await sendAPI(
          new TournamentStageConfigureRulesAPI(
            workbench.profile.id,
            currentRuleStage.stageId,
            {
              operatorId,
              format: ruleDraft.format,
              roundCount: currentRuleStage.roundCount,
              advancementRuleType: isKnockout
                ? 'KnockoutElimination'
                : 'SwissCut',
              cutSize: isKnockout ? undefined : advanceCount,
              bracketSize: isKnockout ? advanceCount : undefined,
              targetTableCount: isKnockout ? advanceCount / 4 : undefined,
              schedulingPoolSize: currentRuleStage.schedulingPoolSize ?? 4,
              pairingMethod: isKnockout
                ? undefined
                : currentRuleStage.swissRule?.pairingMethod ?? 'balanced-elo',
              carryOverPoints: isKnockout
                ? undefined
                : currentRuleStage.swissRule?.carryOverPoints ?? true,
              maxRounds: isKnockout
                ? undefined
                : currentRuleStage.swissRule?.maxRounds ??
                  currentRuleStage.roundCount,
              thirdPlaceMatch: isKnockout
                ? currentRuleStage.knockoutRule?.thirdPlaceMatch ?? false
                : undefined,
              repechageEnabled: isKnockout
                ? currentRuleStage.knockoutRule?.repechageEnabled ?? false
                : undefined,
              seedingPolicy: isKnockout
                ? currentRuleStage.knockoutRule?.seedingPolicy ?? 'rating'
                : undefined,
            },
          ),
        );
      } else {
        await sendAPI(
          new TournamentStageCreateAPI(workbench.profile.id, {
            name: `${workbench.profile.name} ${isKnockout ? '淘汰赛' : '瑞士轮'}`,
            format: ruleDraft.format,
            order: 1,
            roundCount: getDefaultRoundCount(ruleDraft.format),
            operatorId,
            advancementRuleType: isKnockout
              ? 'KnockoutElimination'
              : 'SwissCut',
            cutSize: isKnockout ? undefined : advanceCount,
            bracketSize: isKnockout ? advanceCount : undefined,
            targetTableCount: isKnockout ? advanceCount / 4 : undefined,
            pairingMethod: isKnockout ? undefined : 'balanced-elo',
            carryOverPoints: isKnockout ? undefined : true,
            maxRounds: isKnockout
              ? undefined
              : getDefaultRoundCount(ruleDraft.format),
            thirdPlaceMatch: isKnockout ? false : undefined,
            repechageEnabled: isKnockout ? false : undefined,
            seedingPolicy: isKnockout ? 'rating' : undefined,
            schedulingPoolSize: 4,
          }),
        );
      }

      await refreshTournamentProfile(workbench.profile.id);
      setRulesDialogOpen(false);
    } catch (error) {
      setTournamentActionError(
        error instanceof Error
          ? error.message
          : '保存阶段规则失败，请稍后重试。',
      );
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  }

  return { handleSaveRules, openRulesDialog };
}
