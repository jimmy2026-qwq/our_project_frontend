import { useEffect, useMemo, useState } from 'react';

import { GetPlayerAPI } from '@/api/player';
import { mapPlayerProfile } from '@/pages/objects/player';
import { sendAPI } from '@/system/api';

import type { TournamentDetailWorkbenchState } from '../../../../../objects/tournament-detail.types';
import {
  describeRuleDetails,
  getCurrentRuleStage,
} from '../../../../../objects/tournament-detail.rules';
import {
  getKnockoutResultRows,
  getQualifiedPlayerIds,
  getStandingResultRows,
  isCompletedStage,
  isFinalStage,
  type PlayerListRow,
} from '../objects/TournamentRulesPanel.results';

export function useTournamentDetailRulesPanel(
  workbench: TournamentDetailWorkbenchState,
) {
  const stage = getCurrentRuleStage(workbench.profile);
  const details = describeRuleDetails(stage);
  const actionLabel = stage ? '修改规则' : '创建规则';
  const canEditRules =
    workbench.canManageTournament && (!stage || !isCompletedStage(stage));
  const showTournamentResults = isFinalStage(stage, workbench);
  const playerRows = useMemo<PlayerListRow[]>(
    () =>
      showTournamentResults
        ? getKnockoutResultRows(stage?.bracket, true).length > 0
          ? getKnockoutResultRows(stage?.bracket, true)
          : getStandingResultRows(stage)
        : getQualifiedPlayerIds(stage).map((playerId) => ({ playerId })),
    [showTournamentResults, stage],
  );
  const playerIds = playerRows.map((row) => row.playerId);
  const playerIdsKey = playerIds.join('|');
  const [qualifiedPlayerNameById, setQualifiedPlayerNameById] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const missingPlayerIds = playerIds.filter(
      (playerId) => !qualifiedPlayerNameById[playerId],
    );

    if (missingPlayerIds.length === 0) {
      return;
    }

    let cancelled = false;

    void Promise.all(
      missingPlayerIds.map(async (playerId) => {
        try {
          const player = await sendAPI(new GetPlayerAPI(playerId)).then(
            mapPlayerProfile,
          );
          return [playerId, player.displayName] as const;
        } catch {
          return [playerId, playerId] as const;
        }
      }),
    ).then((entries) => {
      if (!cancelled) {
        setQualifiedPlayerNameById((current) => ({
          ...current,
          ...Object.fromEntries(entries),
        }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [playerIdsKey, qualifiedPlayerNameById, playerIds]);

  const playerDisplayRows = playerRows.map((row) => ({
    ...row,
    name: qualifiedPlayerNameById[row.playerId] ?? row.playerId,
  }));

  return {
    actionLabel,
    canEditRules,
    details,
    playerDisplayRows,
    showTournamentResults,
    stage,
  };
}
