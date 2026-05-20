import type {
  ApiMessage,
  AuthSessionResponse,
  AuthSuccessResponse,
  CreateGuestSessionRequest,
  GuestSessionResponse,
  LoginRequest,
  RegisterAccountRequest,
  CurrentSessionView,
  CurrentSessionQuery,
} from '@/objects/auth';
import { sendAPI } from '@/system/api';

import { CreateGuestSessionAuthAPI } from '@/api/auth/CreateGuestSessionAuthAPI';
import { CurrentSessionAuthAPI } from '@/api/auth/CurrentSessionAuthAPI';
import { GetGuestSessionAuthAPI } from '@/api/auth/GetGuestSessionAuthAPI';
import { LoginAuthAPI } from '@/api/auth/LoginAuthAPI';
import { LogoutAuthAPI } from '@/api/auth/LogoutAuthAPI';
import { RegisterAuthAPI } from '@/api/auth/RegisterAuthAPI';
import { RestoreAuthSessionAPI } from '@/api/auth/RestoreAuthSessionAPI';
import { RevokeGuestSessionAuthAPI } from '@/api/auth/RevokeGuestSessionAuthAPI';
import { UpgradeGuestSessionAuthAPI } from '@/api/auth/UpgradeGuestSessionAuthAPI';


export const authApi = {
  login(payload: LoginRequest) {
    return sendAPI<AuthSuccessResponse>(LoginAuthAPI.fromRequest(payload));
  },
  register(payload: RegisterAccountRequest) {
    return sendAPI<AuthSuccessResponse>(RegisterAuthAPI.fromRequest(payload));
  },
  getAuthSession(token: string) {
    return sendAPI<AuthSessionResponse>(new RestoreAuthSessionAPI(token));
  },
  logout(token: string) {
    return sendAPI<ApiMessage>(new LogoutAuthAPI(token));
  },
  getSession(filters: CurrentSessionQuery) {
    return sendAPI<CurrentSessionView>(new CurrentSessionAuthAPI(filters));
  },
  createGuestSession(payload: CreateGuestSessionRequest) {
    return sendAPI<GuestSessionResponse>(new CreateGuestSessionAuthAPI(payload));
  },
  getGuestSession(guestSessionId: string) {
    return sendAPI<GuestSessionResponse>(new GetGuestSessionAuthAPI(guestSessionId));
  },
  upgradeGuestSession(guestSessionId: string, playerId: string) {
    return sendAPI<GuestSessionResponse>(
      new UpgradeGuestSessionAuthAPI(guestSessionId, playerId),
    );
  },
  revokeGuestSession(guestSessionId: string, reason?: string) {
    return sendAPI<GuestSessionResponse>(
      new RevokeGuestSessionAuthAPI(guestSessionId, reason),
    );
  },
};
