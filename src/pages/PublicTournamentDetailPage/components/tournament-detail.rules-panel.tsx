import { useEffect, useMemo, useState } from 'react';

import { Button, DetailCard, DetailList, DetailListItem, StatusPill } from '@/components/ui';
import { playerApi } from '@/pages/PublicShared/objects/data.transport';
import type { TournamentDetailWorkbenchState } from '../objects/tournament-detail.types';
import {
  describeAdvancementRule,
  describeRuleDetails,
  getCurrentRuleStage,
  getRuleSummaryLabel,
  getTournamentFormatLabel,
} from '../objects/tournament-detail.rules';
import { getStageStatusLabel } from '@/pages/PublicShared/objects/utils';
import { getStatusTone } from '@/pages/PublicShared/components/shared.status';

type QualifiedStandingEntry = {
  playerId?: unknown;
  seed?: unknown;
  qualified?: unknown;
};

type StageSnapshotWithQualifiedPlayers = {
  qualifiedPlayerIds?: unknown;
  entries?: unknown;
};

type KnockoutBracketResultLike = {
  playerId?: unknown;
  placement?: unknown;
  advanced?: unknown;
};

type KnockoutBracketMatchLike = {
  roundNumber?: unknown;
  advancementCount?: unknown;
  completed?: unknown;
  results?: unknown;
};

type KnockoutBracketRoundLike = {
  roundNumber?: unknown;
  matches?: unknown;
};

type KnockoutBracketSnapshotLike = {
  qualifiedPlayerIds?: unknown;
  rounds?: unknown;
};

type PlayerListRow = {
  playerId: string;
  placement?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizePlayerIds(value: unknown) {
  return Array.isArray(value)
    ? value.filter((playerId): playerId is string => typeof playerId === 'string')
    : [];
}

function getCompletedKnockoutMatches(bracket: unknown) {
  if (!isRecord(bracket)) {
    return [];
  }

  const snapshot = bracket as KnockoutBracketSnapshotLike;

  if (!Array.isArray(snapshot.rounds)) {
    return [];
  }

  return snapshot.rounds
    .filter((round): round is KnockoutBracketRoundLike => isRecord(round))
    .flatMap((round) =>
      Array.isArray(round.matches)
        ? round.matches
            .filter((match): match is KnockoutBracketMatchLike => isRecord(match))
            .map((match) => ({
              ...match,
              roundNumber:
                typeof match.roundNumber === 'number'
                  ? match.roundNumber
                  : typeof round.roundNumber === 'number'
                    ? round.roundNumber
                    : 0,
            }))
        : [],
    )
    .filter((match) => match.completed === true);
}

function getKnockoutResultRows(bracket: unknown, finalOnly: boolean) {
  const completedMatches = getCompletedKnockoutMatches(bracket);
  const finalMatches = completedMatches.filter(
    (match) => match.advancementCount === 0,
  );
  const targetMatches =
    finalOnly && finalMatches.length > 0 ? finalMatches : completedMatches;
  const lastRound = targetMatches.reduce(
    (maxRound, match) =>
      Math.max(
        maxRound,
        typeof match.roundNumber === 'number' ? match.roundNumber : 0,
      ),
    0,
  );
  const decisiveMatches = targetMatches.filter(
    (match) => match.roundNumber === lastRound,
  );
  const rows = decisiveMatches.flatMap((match) =>
    Array.isArray(match.results)
      ? match.results
          .filter((result): result is KnockoutBracketResultLike =>
            isRecord(result),
          )
          .filter((result) =>
            finalOnly && finalMatches.length > 0
              ? true
              : result.advanced === true,
          )
          .sort((left, right) => {
            const leftPlacement =
              typeof left.placement === 'number'
                ? left.placement
                : Number.MAX_SAFE_INTEGER;
            const rightPlacement =
              typeof right.placement === 'number'
                ? right.placement
                : Number.MAX_SAFE_INTEGER;
            return leftPlacement - rightPlacement;
          })
          .flatMap((result): PlayerListRow[] =>
            typeof result.playerId === 'string'
              ? [
                  {
                    playerId: result.playerId,
                    placement:
                      typeof result.placement === 'number'
                        ? result.placement
                        : undefined,
                  },
                ]
              : [],
          )
      : [],
  );

  return Array.from(
    new Map(rows.map((row) => [row.playerId, row])).values(),
  );
}

function getQualifiedPlayerIds(
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

function getStandingResultRows(stage: ReturnType<typeof getCurrentRuleStage>) {
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

function isCompletedStage(stage: ReturnType<typeof getCurrentRuleStage>) {
  return stage?.status === 'Completed' || stage?.status === 'Archived';
}

function isFinalStage(
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

export function TournamentCurrentRulesPanel({
  workbench,
  onOpenRulesDialog,
}: {
  workbench: TournamentDetailWorkbenchState;
  onOpenRulesDialog: () => void;
}) {
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
          const player = await playerApi.getPlayer(playerId);
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

  const playerDisplayRows = playerRows.map(
    (row) => ({
      ...row,
      name: qualifiedPlayerNameById[row.playerId] ?? row.playerId,
    }),
  );

  return (
    <DetailCard
      title={
        <span className="flex flex-wrap items-center gap-3 text-[1.25rem] font-semibold">
          <span>当前阶段规则</span>
          {canEditRules ? (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenRulesDialog}
              disabled={workbench.isSubmittingTournamentAction}
            >
              {actionLabel}
            </Button>
          ) : null}
        </span>
      }
    >
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <strong className="text-[#f2f7fb]">
            {stage?.name ?? '尚未创建赛段'}
          </strong>
          {stage ? (
            <>
              <StatusPill tone={getStatusTone(stage.status)}>
                {getStageStatusLabel(stage.status)}
              </StatusPill>
              <StatusPill tone="info">
                {getRuleSummaryLabel(stage.advancementRule)}
              </StatusPill>
            </>
          ) : null}
        </div>

        <DetailList>
          <DetailListItem
            label="赛制"
            value={stage ? getTournamentFormatLabel(stage.format) : '--'}
          />
          <DetailListItem
            label="晋级规则"
            value={describeAdvancementRule(stage)}
          />
          <DetailListItem
            label={showTournamentResults ? '赛事结果' : '晋级名单'}
            value={
              playerDisplayRows.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {playerDisplayRows.map((row, index) => (
                    <span
                      key={`${row.playerId}-${index}`}
                      className="inline-flex min-h-8 items-center border border-[rgba(219,175,98,0.28)] bg-[rgba(28,40,74,0.72)] px-3 text-sm text-[#f2f7fb]"
                    >
                      {showTournamentResults && row.placement
                        ? `第 ${row.placement} 名 ${row.name}`
                        : row.name}
                    </span>
                  ))}
                </div>
              ) : (
                showTournamentResults ? '暂无赛事结果' : '暂无晋级名单'
              )
            }
          />
          <DetailListItem label="规则细节" value={details.join(' / ')} />
        </DetailList>
      </div>
    </DetailCard>
  );
}
