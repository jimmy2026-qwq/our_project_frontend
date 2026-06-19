import { RestoreAuthSessionAPI } from '@/api/auth';
import { sendAPI } from '@/system/api';

import { mapBackendAuthSession } from './mapAuthSession';

export async function resolveAuthenticatedAuthSession(token: string) {
  return mapBackendAuthSession(
    await sendAPI(new RestoreAuthSessionAPI(token)),
    token,
  );
}
