import type { AuthSession } from '@/app/auth/AuthSession';

// Maps the auth session to the player/operator id expected by notification APIs.
export function getNotificationOperatorId(session: AuthSession | null): string {
  if (!session?.user.roles.isRegisteredPlayer) {
    return '';
  }

  return session.user.operatorId ?? session.user.userId;
}
