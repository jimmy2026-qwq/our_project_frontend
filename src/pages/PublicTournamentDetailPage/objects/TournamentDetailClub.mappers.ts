import type { PublicClubDetailView, PublicClubDirectoryEntry } from '@/objects';
import type { ClubView } from '@/objects/club';
import type { ClubSummary } from '@/pages/objects/ClubSummary';

import type { ClubPublicProfile } from './PublicTournamentDetailPage.types';

function unwrapSingletonArray<T>(
  value: T | T[] | null | undefined,
): T | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value ?? undefined;
}

function normalizeOptionalString(
  value: string | string[] | null | undefined,
): string | undefined {
  const normalized = unwrapSingletonArray(value);
  return typeof normalized === 'string'
    ? normalized.trim() || undefined
    : undefined;
}

function normalizeOptionalNumber(
  value: number | number[] | null | undefined,
): number | undefined {
  const normalized = unwrapSingletonArray(value);
  return typeof normalized === 'number' ? normalized : undefined;
}

export function toClubSummary(item: ClubView): ClubSummary {
  return {
    id: item.id,
    name: item.name,
    memberCount: item.members.length,
    powerRating: item.powerRating,
    treasury: item.treasuryBalance ?? item.pointPool ?? item.totalPoints ?? 0,
    relations: (item.relations ?? []).map((relation) =>
      relation.relation === 'Alliance' ? 'Alliance' : 'Hostile',
    ),
  };
}

export function toPublicClubSummary(
  item: PublicClubDirectoryEntry,
): ClubSummary {
  return {
    id: item.clubId,
    name: item.name,
    memberCount: item.memberCount,
    activeMemberCount: item.activeMemberCount,
    adminCount: item.adminCount,
    powerRating: item.powerRating,
    treasury: item.treasuryBalance,
    totalPoints: item.totalPoints,
    pointPool: item.pointPool,
    allianceCount: item.allianceCount,
    rivalryCount: item.rivalryCount,
    strongestRivalClubId: item.strongestRivalClubId,
    strongestRivalPower: item.strongestRivalPower,
    honorTitles: item.honorTitles,
    relations: item.relations.map((relation) =>
      relation.relation === 'Alliance' ? 'Alliance' : 'Hostile',
    ),
  };
}

export function toPublicClubDetail(
  item: PublicClubDetailView,
): ClubPublicProfile {
  const requirementsText = normalizeOptionalString(
    item.applicationPolicy?.requirementsText,
  );
  const expectedReviewSlaHours = normalizeOptionalNumber(
    item.applicationPolicy?.expectedReviewSlaHours,
  );
  const honors = item.honors ?? [];
  const relations = item.relations ?? [];
  const currentLineup = item.currentLineup ?? [];
  const recentMatches = item.recentMatches ?? [];
  const applicationNote =
    item.applicationPolicy?.applicationsOpen === false
      ? 'Applications are currently closed.'
      : expectedReviewSlaHours
        ? `Expected review SLA: ${expectedReviewSlaHours} hours.`
        : 'Public recruitment policy is available from the backend detail endpoint.';

  return {
    id: item.clubId,
    name: item.name,
    slogan: honors[0]?.title ?? 'Public club profile',
    description: requirementsText || applicationNote,
    memberCount: item.memberCount,
    activeMemberCount: item.activeMemberCount,
    adminCount: item.adminCount,
    powerRating: item.powerRating,
    treasury: item.treasuryBalance ?? 0,
    totalPoints: item.totalPoints,
    pointPool: item.pointPool,
    relations: relations.map((relation) =>
      relation.relation === 'Alliance' ? 'Alliance' : 'Hostile',
    ),
    featuredPlayers: currentLineup.map((member) => member.nickname),
    activeTournaments: recentMatches.map((match, index) => ({
      id: match.tournamentId ?? `${item.clubId}-recent-${index}`,
      name: match.tournamentName,
      source: 'recent' as const,
    })),
  };
}
