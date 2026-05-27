import type { TournamentDetailWorkbenchState } from '../../../../../objects/tournament-detail.types';
import { getCurrentRuleStage } from '../../../../../objects/tournament-detail.rules';

import { getKnockoutResultRows } from './TournamentRulesPanel.knockout';
import type {
  KnockoutBracketSnapshotLike,
  PlayerListRow,
  QualifiedStandingEntry,
  StageSnapshotWithQualifiedPlayers,
} from './TournamentRulesPanel.types';
import {
  isRecord,
  normalizePlayerIds,
} from './TournamentRulesPanel.types';

export type { PlayerListRow };

export function getQualifiedPlayerIds(
  stage: ReturnType<typeof getCurrentRuleStage>,
) {
  if (!stage) {
    return [];
  }

  if (
    stage.format === 'Knockout' ||
    stage.advancementRule?.ruleType === 'KnockoutElimination'
  ) {
    const knockoutResultPlayerIds = getKnockoutResultRows(stage.bracket, false)
      .map((row) => row.playerId);

    if (knockoutResultPlayerIds.length > 0) {
      return knockoutResultPlayerIds;
    }
  }

  const standings = stage.standings;

  if (isRecord(standings)) {
    const snapshot = standings as StageSnapshotWithQualifiedPlayers;
    const explicitIds = normalizePlayerIds(snapshot.qualifiedPlayerIds);

    if (explicitIds.length > 0) {
      return explicitIds;
    }

    if (Array.isArray(snapshot.entries)) {
      return snapshot.entries
        .filter((entry): entry is QualifiedStandingEntry => isRecord(entry))
        .filter((entry) => entry.qualified === true)
        .sort((left, right) => {
          const leftSeed =
            typeof left.seed === 'number' ? left.seed : Number.MAX_SAFE_INTEGER;
          const rightSeed =
            typeof right.seed === 'number' ? right.seed : Number.MAX_SAFE_INTEGER;
          return leftSeed - rightSeed;
        })
        .map((entry) => entry.playerId)
        .filter((playerId): playerId is string => typeof playerId === 'string');
    }
  }

  const bracket = stage.bracket;

  if (isRecord(bracket)) {
    return normalizePlayerIds(
      (bracket as KnockoutBracketSnapshotLike).qualifiedPlayerIds,
    );
  }

  return [];
}

export function getStandingResultRows(
  stage: ReturnType<typeof getCurrentRuleStage>,
) {
  if (!stage || !isRecord(stage.standings)) {
    return [];
  }

  const entries = (stage.standings as StageSnapshotWithQualifiedPlayers).entries;

  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .filter((entry): entry is QualifiedStandingEntry => isRecord(entry))
    .sort((left, right) => {
      const leftSeed =
        typeof left.seed === 'number' ? left.seed : Number.MAX_SAFE_INTEGER;
      const rightSeed =
        typeof right.seed === 'number' ? right.seed : Number.MAX_SAFE_INTEGER;
      return leftSeed - rightSeed;
    })
    .flatMap((entry): PlayerListRow[] =>
      typeof entry.playerId === 'string'
        ? [
            {
              playerId: entry.playerId,
              placement: typeof entry.seed === 'number' ? entry.seed : undefined,
            },
          ]
        : [],
    );
}

export function isCompletedStage(stage: ReturnType<typeof getCurrentRuleStage>) {
  return stage?.status === 'Completed' || stage?.status === 'Archived';
}

export function isFinalStage(
  stage: ReturnType<typeof getCurrentRuleStage>,
  workbench: TournamentDetailWorkbenchState,
) {
  if (!stage || !isCompletedStage(stage)) {
    return false;
  }

  const stageOrder = stage.order ?? 0;

  return !(workbench.profile.stages ?? []).some(
    (candidate) => (candidate.order ?? 0) > stageOrder,
  );
}

export { getKnockoutResultRows };
