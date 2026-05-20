import { APIMessage } from '@/system/api';
import type { Club } from '@/objects/club';

export class GetClubAPI extends APIMessage<Club> {
  constructor(readonly clubId: string) {
    super();
  }
}
