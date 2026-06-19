export const TournamentParticipantKinds = {
  Club: 'Club',
  Player: 'Player',
} as const;

export type TournamentParticipantKind =
  (typeof TournamentParticipantKinds)[keyof typeof TournamentParticipantKinds];
