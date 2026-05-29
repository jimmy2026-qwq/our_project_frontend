export type QualifiedStandingEntry = {
  playerId?: unknown;
  seed?: unknown;
  qualified?: unknown;
};

export type StageSnapshotWithQualifiedPlayers = {
  qualifiedPlayerIds?: unknown;
  entries?: unknown;
};

export type KnockoutBracketResultLike = {
  playerId?: unknown;
  placement?: unknown;
  advanced?: unknown;
};

export type KnockoutBracketMatchLike = {
  roundNumber?: unknown;
  advancementCount?: unknown;
  completed?: unknown;
  results?: unknown;
};

export type KnockoutBracketRoundLike = {
  roundNumber?: unknown;
  matches?: unknown;
};

export type KnockoutBracketSnapshotLike = {
  qualifiedPlayerIds?: unknown;
  rounds?: unknown;
};

export type PlayerListRow = {
  playerId: string;
  placement?: number;
};
