export const RealtimeEventTypes = {
  NotificationCreated: 'NotificationCreated',
  ClubApplicationChanged: 'ClubApplicationChanged',
  ClubMemberChanged: 'ClubMemberChanged',
  ClubChanged: 'ClubChanged',
  AppealChanged: 'AppealChanged',
  TournamentTableChanged: 'TournamentTableChanged',
  TournamentChanged: 'TournamentChanged',
  PlayerChanged: 'PlayerChanged',
  DomainChanged: 'DomainChanged',
  MahjongTableChanged: 'MahjongTableChanged',
  MahjongActionAccepted: 'MahjongActionAccepted',
} as const;

export type RealtimeEventType =
  (typeof RealtimeEventTypes)[keyof typeof RealtimeEventTypes];

export function isRealtimeEventType(
  value: string,
): value is RealtimeEventType {
  return Object.values(RealtimeEventTypes).includes(value as RealtimeEventType);
}
