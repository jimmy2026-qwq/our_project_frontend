import { CurrentSessionAuthAPI } from '@/api/auth';
import { sendAPI } from '@/system/api';

import { mapGuestSession } from './mapAuthSession';
import { readGuestSessionId } from './authSessionStorage';
import { resolveAuthenticatedAuthSession } from './resolveAuthenticatedAuthSession';

export async function restoreAuthSession(token: string) {
  const guestSessionId = readGuestSessionId(token);

  if (guestSessionId) {
    const session = await sendAPI(new CurrentSessionAuthAPI({ guestSessionId }));

    return session.authenticated ? mapGuestSession(session) : null;
  }

  return resolveAuthenticatedAuthSession(token);
}
