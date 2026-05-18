import type {
  ClubPublicProfile,
  ClubSummary,
  PublicSchedule,
  StageStatus,
  TournamentPublicProfile,
} from '@/objects';
import type {
  PublicClubDetailContract,
  PublicClubDirectoryEntryContract,
  PublicScheduleContract,
  PublicTournamentDetailContract,
  PublicTournamentStageContract,
} from '@/objects/publicquery';

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

export function mapPublicSchedule(
  item: PublicScheduleContract,
): PublicSchedule {
  return {
    tournamentId: item.tournamentId,
    tournamentName: item.tournamentName,
    tournamentStatus: item.tournamentStatus,
    stageId: item.stageId,
    stageName: item.stageName,
    stageStatus: item.stageStatus,
    scheduledAt: item.startsAt,
    endsAt: item.endsAt,
    currentRound: item.currentRound,
    roundCount: item.roundCount,
    tableCount: item.tableCount,
    activeTableCount: item.activeTableCount,
    pendingTablePlanCount: item.pendingTablePlanCount,
    participantCount: item.participantCount,
    whitelistCount: item.whitelistCount,
  };
}

function mapStageStatus(
  status: PublicTournamentStageContract['status'],
): StageStatus {
  return status === 'Ready' ? 'Pending' : status;
}

function mapTournamentWhitelistType(
  item: PublicTournamentDetailContract,
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
  item: PublicTournamentDetailContract,
): TournamentPublicProfile {
  const nextStage =
    item.stages.find(
      (stage) => stage.status === 'Active' || stage.status === 'Ready',
    ) ?? item.stages[0];

  return {
    id: item.tournamentId,
    name: item.name,
    organizer: item.organizer,
    status: item.status,
    tagline: `Organizer: ${item.organizer}`,
    description: `Public tournament detail includes ${item.stages.length} stage(s), ${item.playerIds.length} player slot(s), and ${item.whitelistCount} whitelist entry/entries.`,
    venue: item.organizer,
    startsAt: item.startsAt,
    endsAt: item.endsAt,
    stageCount: item.stages.length,
    whitelistType: mapTournamentWhitelistType(item),
    clubIds: item.clubIds,
    clubCount: item.clubIds.length,
    playerCount: item.playerIds.length,
    whitelistCount: item.whitelistCount,
    nextStageId: nextStage?.stageId ?? '',
    nextStageName: nextStage?.name ?? 'No stages available',
    nextStageStatus: nextStage ? mapStageStatus(nextStage.status) : 'Pending',
    nextScheduledAt: item.startsAt,
    stages: item.stages.map((stage) => ({
      stageId: stage.stageId,
      name: stage.name,
      status: mapStageStatus(stage.status),
      roundCount: stage.roundCount,
      tableCount: stage.tableCount,
      pendingTablePlanCount: stage.pendingTablePlanCount,
      format: stage.format,
      order: stage.order,
      currentRound: stage.currentRound,
      archivedTableCount: stage.archivedTableCount,
      standings: stage.standings ?? null,
      bracket: stage.bracket ?? null,
    })),
  };
}

export function mapPublicClub(
  item: PublicClubDirectoryEntryContract,
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

export function mapPublicClubDetail(
  item: PublicClubDetailContract,
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
    honors,
    applicationPolicy: item.applicationPolicy
      ? {
          applicationsOpen: item.applicationPolicy.applicationsOpen ?? true,
          requirementsText: requirementsText ?? null,
          expectedReviewSlaHours: expectedReviewSlaHours ?? null,
          pendingApplicationCount:
            item.applicationPolicy.pendingApplicationCount ?? undefined,
        }
      : undefined,
    featuredPlayers: currentLineup.map((member) => member.nickname),
    currentLineup: currentLineup.map((member) => ({
      nickname: member.nickname,
    })),
    recentMatches: recentMatches.map((match) => ({
      tournamentId: match.tournamentId,
      tournamentName: match.tournamentName,
    })),
    activeTournaments: recentMatches.map((match, index) => ({
      id: match.tournamentId ?? `${item.clubId}-recent-${index}`,
      name: match.tournamentName,
      source: 'recent' as const,
    })),
  };
}
