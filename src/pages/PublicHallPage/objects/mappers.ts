import type { ClubSummary } from '@/pages/objects/club';
import type {
  PublicClubDirectoryEntry,
  PublicScheduleView,
} from '@/objects';

import type { PublicSchedule } from './types';

export function mapPublicSchedule(item: PublicScheduleView): PublicSchedule {
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
