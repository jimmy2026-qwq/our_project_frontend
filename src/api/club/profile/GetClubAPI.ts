import { APIMessage } from '@/system/api';
import type { ClubView } from '@/objects/club';

export class GetClubAPI extends APIMessage<ClubView> {
  constructor(readonly clubId: string) {
    super();
  }
}
