import { authAuthnApi } from './authn.api';
import { authDemoApi } from './demo.api';
import { authSessionsApi } from './sessions.api';

export type {
  CreateGuestSessionPayload,
  DemoSummaryQuery,
  SessionQuery,
} from './requests/auth.requests';

export const authApi = {
  ...authAuthnApi,
  ...authSessionsApi,
  ...authDemoApi,
};
