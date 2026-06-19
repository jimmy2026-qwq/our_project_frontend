import type { AuthContextSession } from '@/app/auth/AuthContextSession';

// Maps the auth session to the player/operator id expected by notification APIs.
export function getNotificationOperatorId(session: AuthContextSession | null): string {
  if (!session?.user.roles.isRegisteredPlayer) {
    return '';
  }

  return session.user.operatorId ?? session.user.userId;
}
