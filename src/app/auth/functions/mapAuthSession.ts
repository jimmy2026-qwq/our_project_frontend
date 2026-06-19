import type { AuthContextSession } from '@/app/auth/AuthContextSession';
import { GetPlayerAPI } from '@/api/player';
import type {
  AuthSessionView,
  AuthSuccessView,
  CurrentSessionView,
} from '@/objects/auth';
import { sendAPI } from '@/system/api';

import { createGuestToken } from './authSessionStorage';

type BackendAuthResponse = AuthSuccessView | AuthSessionView;

async function resolveOperatorId(response: BackendAuthResponse) {
  if (!response.roles.isRegisteredPlayer) {
    return response.userId;
  }

  try {
    const player = await sendAPI(new GetPlayerAPI(response.userId));
    return player.playerId || response.userId;
  } catch {
    return response.userId;
  }
}

export async function mapBackendAuthSession(
  response: BackendAuthResponse,
  tokenOverride?: string,
): Promise<AuthContextSession> {
  const token =
    tokenOverride ?? ('token' in response ? response.token : undefined);

  if (!token) {
    throw new Error(
      'Authenticated session token is missing from the backend response.',
    );
  }

  const operatorId = await resolveOperatorId(response);

  return {
    token,
    user: {
      userId: response.userId,
      username: response.username,
      displayName: response.displayName,
      operatorId,
      roles: response.roles,
    },
  };
}

export function mapGuestSession(session: CurrentSessionView): AuthContextSession {
  const guestSessionId = session.guestSession?.id ?? session.principalId;

  return {
    token: createGuestToken(guestSessionId),
    user: {
      userId: guestSessionId,
      username: guestSessionId,
      displayName: session.displayName,
      roles: session.roles,
    },
  };
}
