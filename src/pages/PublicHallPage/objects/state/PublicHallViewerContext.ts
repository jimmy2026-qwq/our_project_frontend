import type { AuthContextSession } from '@/app/auth/AuthContextSession';

export interface PublicHallViewerContext {
  session: AuthContextSession | null;
}
