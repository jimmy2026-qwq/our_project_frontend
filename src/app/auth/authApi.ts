import {
  BootstrapSuperAdminAuthAPI,
  CreateGuestSessionAuthAPI,
  CurrentSessionAuthAPI,
  LoginAuthAPI,
  LogoutAuthAPI,
  RegisterAuthAPI,
  RestoreAuthSessionAPI,
  RevokeGuestSessionAuthAPI,
} from '@/api/auth';
import { GetCurrentPlayerAPI } from '@/api/player';
import type {
  AuthSessionView,
  AuthSuccessView,
  BootstrapSuperAdminRequest,
  CreateGuestSessionRequest,
  CurrentSessionQuery,
  CurrentSessionView,
  GuestSessionResponse,
  LoginRequest,
  LogoutResponse,
  RegisterAccountRequest,
} from '@/objects/auth';
import type { PlayerProfileView } from '@/objects/player';
import { sendAPI } from '@/system/api';

export const authApi = {
  bootstrapSuperAdmin(payload: BootstrapSuperAdminRequest) {
    return sendAPI<AuthSuccessView>(
      BootstrapSuperAdminAuthAPI.fromRequest(payload),
    );
  },
  login(payload: LoginRequest) {
    return sendAPI<AuthSuccessView>(LoginAuthAPI.fromRequest(payload));
  },
  register(payload: RegisterAccountRequest) {
    return sendAPI<AuthSuccessView>(RegisterAuthAPI.fromRequest(payload));
  },
  getAuthSession(token: string) {
    return sendAPI<AuthSessionView>(new RestoreAuthSessionAPI(token));
  },
  logout(token: string) {
    return sendAPI<LogoutResponse>(new LogoutAuthAPI(token));
  },
  getSession(filters: CurrentSessionQuery) {
    return sendAPI<CurrentSessionView>(new CurrentSessionAuthAPI(filters));
  },
  createGuestSession(payload: CreateGuestSessionRequest) {
    return sendAPI<GuestSessionResponse>(new CreateGuestSessionAuthAPI(payload));
  },
  revokeGuestSession(guestSessionId: string, reason?: string) {
    return sendAPI<GuestSessionResponse>(
      new RevokeGuestSessionAuthAPI(guestSessionId, reason),
    );
  },
};

export function getCurrentPlayer(operatorId: string) {
  return sendAPI<PlayerProfileView>(new GetCurrentPlayerAPI(operatorId));
}
