import type { AuthContextSession } from '@/app/auth/AuthContextSession';

import { restoreAuthSession } from './restoreAuthSession';

let pendingRestoreToken: string | null = null;
let pendingRestorePromise: Promise<AuthContextSession | null> | null = null;

export function restoreAuthSessionOnce(token: string) {
  if (pendingRestorePromise && pendingRestoreToken === token) {
    return pendingRestorePromise;
  }

  pendingRestoreToken = token;
  pendingRestorePromise = restoreAuthSession(token).finally(() => {
    pendingRestoreToken = null;
    pendingRestorePromise = null;
  });

  return pendingRestorePromise;
}
