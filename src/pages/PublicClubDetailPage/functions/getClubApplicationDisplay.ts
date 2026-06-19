import type { ClubSummary } from '@/pages/objects/ClubSummary';

import type { HomeClubApplicationState } from '../objects/ClubApplication.types';

export function formatDateTime(value: string) {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

export function getSelectedClubName(clubId: string, clubs: ClubSummary[]) {
  return clubs.find((club) => club.id === clubId)?.name ?? clubId;
}

export function getFallbackPlayerName(
  state: Pick<HomeClubApplicationState, 'operatorDisplayName' | 'operatorId'>,
) {
  return state.operatorDisplayName || state.operatorId;
}
