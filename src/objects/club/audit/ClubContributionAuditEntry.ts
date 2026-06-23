export interface ClubContributionAuditEntry {
  id: string;
  clubId: string;
  playerId: string | null;
  delta: string | null;
  contribution: string | null;
  occurredAt: string;
  actorId: string | null;
  note: string | null;
}

