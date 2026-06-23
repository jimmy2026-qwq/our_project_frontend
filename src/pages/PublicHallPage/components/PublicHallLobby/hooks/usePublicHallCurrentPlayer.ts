import { GetPlayerAPI } from '@/api/player';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { sendAPI } from '@/system/api';

import type { PublicHallViewerContext } from '../../../objects/state/PublicHallViewerContext';

import { toPlayerProfile } from '../../../functions/toPublicHallData';

export function usePublicHallCurrentPlayer(
  session: PublicHallViewerContext['session'],
  operatorId: string,
) {
  return useAsyncResource(async () => {
    if (!session?.user.roles.isRegisteredPlayer || !operatorId) {
      return null;
    }

    return sendAPI(new GetPlayerAPI(operatorId)).then(toPlayerProfile);
  }, [operatorId, session?.user.roles.isRegisteredPlayer]);
}
