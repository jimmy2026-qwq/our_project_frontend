export interface CurrentSessionQuery {
  operatorId?: string;
  guestSessionId?: string;
}

export interface CreateGuestSessionRequest {
  displayName?: string;
  ttlHours?: number;
  deviceFingerprint?: string;
}

export interface RevokeGuestSessionRequest {
  reason?: string;
}

export interface UpgradeGuestSessionRequest {
  playerId: string;
}

export interface ListGuestSessionsRequest {
  activeOnly?: boolean;
  limit?: number;
  offset?: number;
}
