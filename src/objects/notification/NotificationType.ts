export const NotificationTypes = {
  ClubApplicationSubmitted: 'ClubApplicationSubmitted',
  ClubApplicationApproved: 'ClubApplicationApproved',
  ClubApplicationRejected: 'ClubApplicationRejected',
  ClubMemberContributionAdjusted: 'ClubMemberContributionAdjusted',
  ClubTitleAssigned: 'ClubTitleAssigned',
  ClubRelationChangeRequested: 'ClubRelationChangeRequested',
  TournamentClubInvited: 'TournamentClubInvited',
  TournamentPlayerInvited: 'TournamentPlayerInvited',
  TournamentLineupSelected: 'TournamentLineupSelected',
  TournamentSettlementFinalized: 'TournamentSettlementFinalized',
  TournamentTableStarted: 'TournamentTableStarted',
  TournamentAppealFiled: 'TournamentAppealFiled',
  TournamentAppealAdjudicated: 'TournamentAppealAdjudicated',
  PlayerEloChanged: 'PlayerEloChanged',
} as const;

export type NotificationType =
  (typeof NotificationTypes)[keyof typeof NotificationTypes];

export function isNotificationType(value: string): value is NotificationType {
  return Object.values(NotificationTypes).includes(value as NotificationType);
}
