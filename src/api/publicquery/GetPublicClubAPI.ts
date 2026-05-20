import { APIMessage } from '@/system/api';
import type { PublicClubDetailView } from '@/objects';

export class GetPublicClubAPI extends APIMessage<PublicClubDetailView> {
  constructor(readonly clubId: string) {
    super();
  }
}
