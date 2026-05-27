import { GetCurrentPlayerAPI } from '@/api/player';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { mapPlayerProfile } from '@/pages/objects/player';
import { sendAPI } from '@/system/api';
import type { PublicHallViewerContext } from '../objects/types';

export function usePublicHallCurrentPlayer(
  session: PublicHallViewerContext['session'],
  operatorId: string,
) {
  return useAsyncResource(async () => {
    if (!session?.user.roles.isRegisteredPlayer || !operatorId) {
      return null;
    }

    return sendAPI(new GetCurrentPlayerAPI(operatorId)).then(
      mapPlayerProfile,
    );
  }, [operatorId, session?.user.roles.isRegisteredPlayer]);
}
