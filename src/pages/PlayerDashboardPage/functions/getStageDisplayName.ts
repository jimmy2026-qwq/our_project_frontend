import type {
  PublicTournamentDetailView,
  PublicTournamentStageView,
} from '@/objects';

function getStageFormatLabel(format?: string) {
  switch (format) {
    case 'Knockout':
      return '淘汰赛';
    case 'Swiss':
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
