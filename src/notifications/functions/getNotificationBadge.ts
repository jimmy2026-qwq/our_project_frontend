import type { Notification } from '@/objects/notification';

export function getNotificationBadgeVariant(notification: Notification) {
  if (notification.notificationType === 'ClubApplicationRejected') {
    return 'outline';
  }

  return severityVariant(notification.severity);
}

export function getNotificationBadgeLabel(notification: Notification) {
  switch (notification.notificationType) {
    case 'ClubApplicationSubmitted':
      return '申请';
    case 'ClubApplicationApproved':
    case 'ClubApplicationRejected':
      return '申请结果';
    case 'ClubMemberContributionAdjusted':
    case 'ClubTitleAssigned':
      return '俱乐部';
    case 'TournamentClubInvited':
    case 'TournamentPlayerInvited':
    case 'TournamentLineupSelected':
    case 'TournamentSettlementFinalized':
      return '赛事';
    case 'PlayerEloChanged':
      return 'ELO';
    default:
      return severityLabel(notification.severity);
  }
}

function severityVariant(severity: string) {
  switch (severity) {
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'danger':
    case 'error':
      return 'danger';
    default:
      return 'outline';
  }
}

function severityLabel(severity: string) {
  switch (severity) {
    case 'success':
      return '成功';
    case 'warning':
      return '提醒';
    case 'danger':
    case 'error':
      return '异常';
    case 'info':
      return '通知';
    default:
      return '通知';
  }
}
