import type {
  PublicTournamentDetailView,
  PublicTournamentStageView,
} from '@/objects';
import { TournamentFormats } from '@/objects';

function getStageFormatLabel(format?: string) {
  switch (format) {
    case TournamentFormats.Knockout:
      return '淘汰赛';
    case TournamentFormats.Swiss:
      return '瑞士轮';
    default:
      return undefined;
  }
}

export function getStageDisplayName(
  tournament: PublicTournamentDetailView,
  stage?: PublicTournamentStageView,
) {
  const formatLabel = getStageFormatLabel(stage?.format);

  if (formatLabel) {
    return `${tournament.name} ${formatLabel}`;
  }

  return stage?.name ?? undefined;
}
