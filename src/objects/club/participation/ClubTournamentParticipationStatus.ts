export const ClubTournamentParticipationStatuses = {
  Invited: 'Invited',
  Participating: 'Participating',
} as const;

export type ClubTournamentParticipationStatus =
  (typeof ClubTournamentParticipationStatuses)[keyof typeof ClubTournamentParticipationStatuses];
