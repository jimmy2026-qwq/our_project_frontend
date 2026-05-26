export interface AuthenticatedSession {
  token: string;
  username: string;
  playerId: string;
  createdAt: string;
  expiresAt: string;
  lastSeenAt: string | null;
  revokedAt: string | null;
  version: number;
}
