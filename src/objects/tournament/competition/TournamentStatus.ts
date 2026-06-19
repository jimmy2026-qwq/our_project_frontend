export const TournamentStatuses = {
  Draft: 'Draft',
  RegistrationOpen: 'RegistrationOpen',
  Scheduled: 'Scheduled',
  InProgress: 'InProgress',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  Archived: 'Archived',
} as const;

export type TournamentStatus =
  (typeof TournamentStatuses)[keyof typeof TournamentStatuses];
