import { authAuthnApi } from './authn.api';
import { authDemoApi } from './demo.api';
import { authSessionsApi } from './sessions.api';

export const authApi = {
  ...authAuthnApi,
  ...authSessionsApi,
  ...authDemoApi,
};
