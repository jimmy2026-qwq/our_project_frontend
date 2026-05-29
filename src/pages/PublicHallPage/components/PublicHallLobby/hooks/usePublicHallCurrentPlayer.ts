import { GetCurrentPlayerAPI } from '@/api/player';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { sendAPI } from '@/system/api';
import type { PublicHallViewerContext } from '../../../objects/PublicHallPage.types';
import { toPlayerProfile } from '../../../objects/PublicHall.mappers';

export function usePublicHallCurrentPlayer(
  session: PublicHallViewerContext['session'],
  operatorId: string,
) {
  return useAsyncResource(async () => {
    if (!session?.user.roles.isRegisteredPlayer || !operatorId) {
      return null;
    }

    return sendAPI(new GetCurrentPlayerAPI(operatorId)).then(toPlayerProfile);
  }, [operatorId, session?.user.roles.isRegisteredPlayer]);
}
