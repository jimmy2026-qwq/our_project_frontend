import type {
  ClubView,
  PublicClubDirectoryEntry,
  PublicScheduleView,
  StageStatus,
  TournamentSummaryView,
} from '@/objects';
import type { PlayerProfileView, PlayerStatus } from '@/objects/player';
import type { ClubSummary } from '@/pages/objects/ClubSummary';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

import type {
  PlayerLeaderboardEntry,
  PublicHallLeaderboardStatus,
  PublicHallState,
  PublicSchedule,
} from './PublicHallPage.types';

export interface TournamentDirectoryEntryView {
  id: string;
  name: string;
}

export function toPublicSchedule(item: PublicScheduleView): PublicSchedule {
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

export function toPublicClubSummary(
  item: PublicClubDirectoryEntry | ClubView,
): ClubSummary {
  if ('id' in item) {
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

export function toTournamentDirectoryEntry(
  item: TournamentDirectoryEntryView | TournamentSummaryView,
): TournamentDirectoryEntryView {
  return {
    id: 'id' in item ? item.id : item.tournamentId,
    name: item.name,
  };
}

export function toLeaderboardStatus(
  status: PublicHallLeaderboardStatus,
): PlayerLeaderboardEntry['status'] {
  return status === 'Suspended' ? 'Inactive' : status;
}

export function toLeaderboardStatusFilter(
  status: PublicHallState['leaderboardStatus'],
): PlayerStatus | undefined {
  if (!status) {
    return undefined;
  }

  return status === 'Inactive' ? 'Suspended' : status;
}

export function toStageStatus(status?: string): StageStatus {
  if (status === 'Ready') {
    return 'Ready';
  }

  if (status === 'Active') {
    return 'Active';
  }

  if (status === 'Completed') {
    return 'Completed';
  }

  if (status === 'Archived') {
    return 'Archived';
  }

  return 'Pending';
}

function toPlayerClubIds(item: PlayerProfileView): string[] {
  return Array.from(
    new Set([
      ...(item.clubId ? [item.clubId] : []),
      ...(item.affiliatedClubIds ?? []),
    ]),
  );
}

function toPlayerStatus(status: PlayerStatus): PlayerProfile['playerStatus'] {
  return status === 'Suspended' ? 'Inactive' : status;
}

export function toPlayerProfile(item: PlayerProfileView): PlayerProfile {
  return {
    playerId: item.playerId,
    applicantUserId: item.userId,
    displayName: item.nickname,
    playerStatus: toPlayerStatus(item.status),
    currentRank: item.currentRank,
    elo: item.elo,
    clubIds: toPlayerClubIds(item),
  };
}
