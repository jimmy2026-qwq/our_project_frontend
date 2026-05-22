export type Role =
  | 'Guest'
  | 'RegisteredPlayer'
  | 'ClubAdmin'
  | 'TournamentAdmin'
  | 'SuperAdmin';

export type Permission =
  | 'ViewPublicSchedule'
  | 'ViewClubDirectory'
  | 'ViewPublicLeaderboard'
  | 'ViewOwnDashboard'
  | 'ViewClubDashboard'
  | 'SubmitClubApplication'
  | 'WithdrawClubApplication'
  | 'ManageClubMembership'
  | 'ManageClubOperations'
  | 'SetClubTitle'
  | 'AssignClubAdmin'
  | 'SubmitTournamentLineup'
  | 'ManageTournamentStages'
  | 'ConfigureTournamentRules'
  | 'ResetTableState'
  | 'ManageTableSeatState'
  | 'FileAppealTicket'
  | 'ResolveAppeal'
  | 'ManageGlobalDictionary'
  | 'BanRegisteredPlayer'
  | 'DissolveClub'
  | 'AssignTournamentAdmin'
  | 'ViewAuditTrail';

export type SessionPrincipalKind = 'Anonymous' | 'Guest' | 'RegisteredPlayer';

export interface CurrentSessionRoleFlags {
  isGuest: boolean;
  isRegisteredPlayer: boolean;
  isClubAdmin: boolean;
  isTournamentAdmin: boolean;
  isSuperAdmin: boolean;
}

export interface CurrentSessionView {
  principalKind: SessionPrincipalKind;
  principalId: string;
  displayName: string;
  authenticated: boolean;
  roles: CurrentSessionRoleFlags;
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

export interface AuthSuccessView {
  userId: string;
  username: string;
  displayName: string;
  token: string;
  roles: CurrentSessionRoleFlags;
}

export interface AuthSessionView {
  userId: string;
  username: string;
  displayName: string;
  authenticated: boolean;
  roles: CurrentSessionRoleFlags;
}

export interface ApiMessage {
  message: string;
}

export type CurrentSessionResponse = CurrentSessionView;
export type AuthSuccessResponse = AuthSuccessView;
export type AuthSessionResponse = AuthSessionView;
