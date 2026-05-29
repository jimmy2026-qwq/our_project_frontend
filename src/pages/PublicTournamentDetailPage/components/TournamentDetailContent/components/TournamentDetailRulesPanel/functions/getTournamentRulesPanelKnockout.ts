import type {
  KnockoutBracketMatchLike,
  KnockoutBracketResultLike,
  KnockoutBracketRoundLike,
  KnockoutBracketSnapshotLike,
  PlayerListRow,
} from '../objects/TournamentRulesPanel.types';
import { isRecord } from './normalizeTournamentRulesPanelValues';

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
            .filter((match): match is KnockoutBracketMatchLike =>
              isRecord(match),
            )
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

export function getKnockoutResultRows(bracket: unknown, finalOnly: boolean) {
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

  return Array.from(new Map(rows.map((row) => [row.playerId, row])).values());
}
