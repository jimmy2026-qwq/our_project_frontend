import type { ClubSummary } from '@/pages/objects/ClubSummary';

import type { ClubPublicProfile } from '../objects/PublicTournamentDetailPage.types';

export function toClubPublicProfileSummary(
  profile: ClubPublicProfile,
): ClubSummary {
  return {
    id: profile.id,
    name: profile.name,
    memberCount: profile.memberCount,
    activeMemberCount: profile.activeMemberCount ?? profile.memberCount,
    adminCount: profile.adminCount ?? 0,
    powerRating: profile.powerRating,
    treasury: profile.treasury,
    totalPoints: profile.totalPoints ?? 0,
    pointPool: profile.pointPool ?? 0,
    allianceCount: profile.relations.filter(
      (relation) => relation === 'Alliance',
    ).length,
    rivalryCount: profile.relations.filter((relation) => relation === 'Hostile')
      .length,
    relations: profile.relations,
  };
}

export function createFallbackClubSummary(clubId: string): ClubSummary {
  return {
    id: clubId,
    name: clubId,
    memberCount: 0,
    activeMemberCount: 0,
    adminCount: 0,
    powerRating: 0,
    treasury: 0,
    totalPoints: 0,
    pointPool: 0,
    allianceCount: 0,
    rivalryCount: 0,
    relations: [],
  };
}
