import { NotificationTypes, type Notification } from '@/objects/notification';

export function getNotificationBadgeVariant(notification: Notification) {
  if (
    notification.notificationType === NotificationTypes.ClubApplicationRejected
  ) {
    return 'outline';
  }

  return severityVariant(notification.severity);
}

export function getNotificationBadgeLabel(notification: Notification) {
  switch (notification.notificationType) {
    case NotificationTypes.ClubApplicationSubmitted:
      return '申请';
    case NotificationTypes.ClubApplicationApproved:
    case NotificationTypes.ClubApplicationRejected:
      return '申请结果';
    case NotificationTypes.ClubMemberContributionAdjusted:
    case NotificationTypes.ClubTitleAssigned:
    case NotificationTypes.ClubRelationChangeRequested:
      return '俱乐部';
    case NotificationTypes.TournamentClubInvited:
    case NotificationTypes.TournamentPlayerInvited:
    case NotificationTypes.TournamentLineupSelected:
    case NotificationTypes.TournamentSettlementFinalized:
    case NotificationTypes.TournamentTableStarted:
      return '赛事';
    case NotificationTypes.TournamentAppealFiled:
    case NotificationTypes.TournamentAppealAdjudicated:
      return '赛事申诉';
    case NotificationTypes.PlayerEloChanged:
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
