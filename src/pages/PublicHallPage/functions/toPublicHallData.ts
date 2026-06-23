import { PlayerStatus, StageStatus, type ClubView, type PublicClubDirectoryEntry, type PublicScheduleView, type TournamentSummaryView } from '@/objects';
import type { PlayerProfileView } from '@/objects/player';
import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';
import { toClubSummaryRelation } from '@/pages/shared_objects/club/functions/toClubSummaryRelation';
import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';

import type { PlayerLeaderboardEntry } from '../objects/leaderboard/PlayerLeaderboardEntry';
import type { PublicHallState } from '../objects/state/PublicHallState';
import type { PublicSchedule } from '../objects/schedule/PublicSchedule';
import { PublicHallLeaderboardDisplayStatus } from '@/pages/PublicHallPage/objects/PublicHallLeaderboardDisplayStatus';

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
      relations: (item.relations ?? []).map(toClubSummaryRelation),
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
    relations: item.relations.map(toClubSummaryRelation),
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
  status: PlayerStatus,
): PlayerLeaderboardEntry['status'] {
  if (status === PlayerStatus.Active) {
    return PublicHallLeaderboardDisplayStatus.Active;
  }

  if (status === PlayerStatus.Banned) {
    return PublicHallLeaderboardDisplayStatus.Banned;
  }

  return PublicHallLeaderboardDisplayStatus.Inactive;
}

export function toLeaderboardStatusFilter(
  status: PublicHallState['leaderboardStatus'],
): PlayerStatus | undefined {
  if (!status) {
    return undefined;
  }

  if (status === PublicHallLeaderboardDisplayStatus.Active) {
    return PlayerStatus.Active;
  }

  if (status === PublicHallLeaderboardDisplayStatus.Banned) {
    return PlayerStatus.Banned;
  }

  return PlayerStatus.Suspended;
}

export function toStageStatus(status?: string): StageStatus {
  if (status === StageStatus.Ready) {
    return StageStatus.Ready;
  }

  if (status === StageStatus.Active) {
    return StageStatus.Active;
  }

  if (status === StageStatus.Completed) {
    return StageStatus.Completed;
  }

  if (status === StageStatus.Archived) {
    return StageStatus.Archived;
  }

  return StageStatus.Pending;
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
  return status;
}

export function toPlayerProfile(item: PlayerProfileView): PlayerProfile {
  return {
    playerId: item.playerId,
    displayName: item.nickname,
    playerStatus: toPlayerStatus(item.status),
    currentRank: item.currentRank,
    elo: item.elo,
    clubIds: toPlayerClubIds(item),
  };
}
