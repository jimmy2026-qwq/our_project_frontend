import type { StageStatus } from '@/objects';
import type { AppealTicketView } from '@/objects';
import type {
  PublicClubDetailView,
  PublicClubDirectoryEntry,
  PublicTournamentDetailView,
  PublicTournamentStageView,
} from '@/objects/publicquery';
import type { ClubSummary } from '@/pages/objects/club';
import type { AppealSummary } from '@/pages/objects/tournament';

import type {
  ClubPublicProfile,
  TournamentPublicProfile,
} from './types';

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

function mapStageStatus(
  status: PublicTournamentStageView['status'],
): StageStatus {
  return status;
}

function mapTournamentWhitelistType(
  item: PublicTournamentDetailView,
): TournamentPublicProfile['whitelistType'] {
  const hasClubParticipants = item.clubIds.length > 0;
  const hasDirectPlayers = item.playerIds.length > 0;

  if (hasClubParticipants && hasDirectPlayers) {
    return 'Mixed';
  }

  if (hasClubParticipants) {
    return 'Club';
  }

  return 'Player';
}

export function mapPublicTournamentDetail(
  item: PublicTournamentDetailView,
): TournamentPublicProfile {
  const stages = [...item.stages].sort(
    (left, right) => (left.order ?? 0) - (right.order ?? 0),
  );
  const nextStage =
    stages.find(
      (stage) => stage.status !== 'Completed' && stage.status !== 'Archived',
    ) ?? stages[stages.length - 1];

  return {
    id: item.tournamentId,
    name: item.name,
    organizer: item.organizer,
    status: item.status,
    tagline: `Organizer: ${item.organizer}`,
    description: `Public tournament detail includes ${stages.length} stage(s), ${item.playerIds.length} player slot(s), and ${item.whitelistCount} whitelist entry/entries.`,
    venue: item.organizer,
    startsAt: item.startsAt,
    endsAt: item.endsAt,
    stageCount: stages.length,
    whitelistType: mapTournamentWhitelistType(item),
    clubIds: item.clubIds,
    playerIds: item.playerIds,
    clubCount: item.clubIds.length,
    playerCount: item.playerIds.length,
    whitelistCount: item.whitelistCount,
    nextStageId: nextStage?.stageId ?? '',
    nextStageName: nextStage?.name ?? 'No stages available',
    nextStageStatus: nextStage ? mapStageStatus(nextStage.status) : 'Pending',
    nextScheduledAt: item.startsAt,
    stages: stages.map((stage) => ({
      stageId: stage.stageId,
      name: stage.name,
      status: mapStageStatus(stage.status),
      roundCount: stage.roundCount,
      schedulingPoolSize: stage.schedulingPoolSize,
      tableCount: stage.tableCount,
      pendingTablePlanCount: stage.pendingTablePlanCount,
      format: stage.format,
      order: stage.order,
      currentRound: stage.currentRound,
      archivedTableCount: stage.archivedTableCount,
      standings: stage.standings ?? null,
      bracket: stage.bracket ?? null,
      advancementRule: stage.advancementRule,
      swissRule: stage.swissRule ?? null,
      knockoutRule: stage.knockoutRule ?? null,
    })),
  };
}

export function mapPublicClub(item: PublicClubDirectoryEntry): ClubSummary {
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

export function mapPublicClubDetail(
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

export function mapAppeal(ticket: AppealTicketView): AppealSummary {
  const lastLog = ticket.logs[ticket.logs.length - 1];

  return {
    id: ticket.appealId,
    tournamentId: ticket.tournamentId,
    stageId: ticket.stageId,
    tableId: ticket.tableId,
    status: ticket.status,
    openedBy: ticket.openedBy,
    createdBy: ticket.openedBy,
    description: ticket.description,
    attachments: ticket.attachments.map((attachment) => attachment.uri),
    priority: ticket.priority,
    assigneeId: ticket.assigneeId,
    dueAt: ticket.dueAt,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    resolution: ticket.resolution,
    verdict: lastLog?.note ?? null,
    reopenCount: ticket.reopenCount,
  };
}
