import { authAuthnApi } from './auth.authn';
import { authDemoApi } from './auth.demo';
import { authPlayersApi } from './auth.players';
import { authSessionsApi } from './auth.sessions';

export type {
  CreateGuestSessionPayload,
  CreatePlayerPayload,
  DemoSummaryQuery,
  SessionQuery,
} from './auth.shared';

export const authApi = {
  ...authAuthnApi,
  ...authSessionsApi,
  ...authPlayersApi,
  ...authDemoApi,
};
