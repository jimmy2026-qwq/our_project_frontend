export interface GuestSession {
  id: string;
  displayName: string;
  createdAt: string;
}

export interface AuthRoleFlags {
  isGuest: boolean;
  isRegisteredPlayer: boolean;
  isClubAdmin: boolean;
  isTournamentAdmin: boolean;
  isSuperAdmin: boolean;
}

export interface SessionInfo {
  principalKind: 'Anonymous' | 'Guest' | 'RegisteredPlayer';
  principalId: string;
  displayName: string;
  authenticated: boolean;
  roles: AuthRoleFlags;
  player?: {
    id: string;
    userId: string;
    nickname: string;
  } | null;
  guestSession?: {
    id: string;
    displayName: string;
  } | null;
}

export interface AuthUser {
  userId: string;
  username: string;
  displayName: string;
  operatorId?: string;
  roles: AuthRoleFlags;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  displayName: string;
  password: string;
}

export interface PlayerProfile {
  playerId: string;
  applicantUserId?: string;
  displayName: string;
  playerStatus?: 'Active' | 'Inactive' | 'Banned';
  currentRank?: {
    platform: string;
    tier: string;
    stars?: number | null;
  } | null;
  elo?: number;
  clubIds?: string[];
}
